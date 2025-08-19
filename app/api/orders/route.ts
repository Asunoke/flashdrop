import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const orderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
    }),
  ),
  customerName: z.string().min(1, "Le nom est requis"),
  customerEmail: z.string().email("Email invalide"),
  customerPhone: z.string().min(8, "Numéro de téléphone invalide"),
  customerAddress: z.string().min(1, "L'adresse est requise"),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Authentification requise" }, { status: 401 })
    }

    const body = await request.json()
    const data = orderSchema.parse(body)

    // Calculer le total et vérifier la disponibilité
    let total = 0
    const orderItems = []

    for (const item of data.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      })

      if (!product || !product.inStock || product.stockQuantity < item.quantity) {
        return NextResponse.json(
          {
            error: `Produit ${product?.name || "inconnu"} non disponible en quantité suffisante`,
          },
          { status: 400 },
        )
      }

      const itemTotal = product.price * item.quantity
      total += itemTotal

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      })
    }

    // Créer la commande avec expiration dans 20 minutes
    const expiresAt = new Date(Date.now() + 20 * 60 * 1000)

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress,
        expiresAt,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Erreur lors de la création de la commande:", error)
    return NextResponse.json({ error: "Erreur lors de la création de la commande" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Authentification requise" }, { status: 401 })
    }

    let orders
    if (session.user.role === "ADMIN" || session.user.role === "MANAGER") {
      orders = await prisma.order.findMany({
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    } else {
      orders = await prisma.order.findMany({
        where: { userId: session.user.id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    }

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des commandes" }, { status: 500 })
  }
}

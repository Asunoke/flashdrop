import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const confirmOrderSchema = z.object({
  paymentRef: z.string().optional(),
})

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Authentification requise" }, { status: 401 })
    }

    const body = await request.json()
    const { paymentRef } = confirmOrderSchema.parse(body)

    // Récupérer la commande avec ses items
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: "Commande non trouvée" }, { status: 404 })
    }

    // Vérifier les permissions
    const canConfirm =
      session.user.role === "ADMIN" || session.user.role === "MANAGER" || order.userId === session.user.id

    if (!canConfirm) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 })
    }

    // Vérifier si la commande peut être confirmée
    if (order.status !== "PENDING") {
      return NextResponse.json({ error: "Cette commande ne peut pas être confirmée" }, { status: 400 })
    }

    // Utiliser une transaction pour confirmer la commande et décrémenter le stock
    const result = await prisma.$transaction(async (tx) => {
      // Vérifier et décrémenter le stock pour chaque produit
      for (const item of order.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        })

        if (!product) {
          throw new Error(`Produit ${item.productId} non trouvé`)
        }

        if (product.stockQuantity < item.quantity) {
          throw new Error(`Stock insuffisant pour le produit ${product.name}`)
        }

        // Décrémenter le stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: product.stockQuantity - item.quantity,
            inStock: product.stockQuantity - item.quantity > 0,
          },
        })
      }

      // Confirmer la commande
      const updatedOrder = await tx.order.update({
        where: { id: params.id },
        data: {
          status: "CONFIRMED",
          paymentRef: paymentRef || null,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })

      return updatedOrder
    })

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Erreur lors de la confirmation de la commande:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erreur lors de la confirmation de la commande",
      },
      { status: 500 },
    )
  }
}

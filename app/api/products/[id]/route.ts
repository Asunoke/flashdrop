import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  longDescription: z.string().optional(),
  price: z.number().positive().optional(),
  originalPrice: z.number().positive().optional(),
  category: z.string().min(1).optional(),
  stockQuantity: z.number().int().min(0).optional(),
  images: z.array(z.string().url()).optional(),
  features: z.array(z.string()).optional(),
  warranty: z.string().optional(),
  delivery: z.string().optional(),
  installation: z.boolean().optional(),
  isNew: z.boolean().optional(),
  isPromo: z.boolean().optional(),
})

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    })

    if (!product) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Erreur lors de la récupération du produit:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération du produit" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateProductSchema.parse(body)

    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
    }

    const updatedData: any = { ...validatedData }
    if (validatedData.stockQuantity !== undefined) {
      updatedData.inStock = validatedData.stockQuantity > 0
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: updatedData,
    })

    return NextResponse.json(product)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides", details: error.errors }, { status: 400 })
    }

    console.error("Erreur lors de la mise à jour du produit:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour du produit" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 })
    }

    // Vérifier si le produit existe
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        orderItems: true,
      },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 })
    }

    // Vérifier s'il y a des commandes liées
    if (existingProduct.orderItems.length > 0) {
      return NextResponse.json(
        { error: "Impossible de supprimer ce produit car il est lié à des commandes" },
        { status: 400 },
      )
    }

    // Supprimer le produit
    await prisma.product.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Produit supprimé avec succès" })
  } catch (error) {
    console.error("Erreur lors de la suppression du produit:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression du produit" }, { status: 500 })
  }
}

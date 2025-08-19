import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  longDescription: z.string().optional(),
  price: z.number().positive(),
  originalPrice: z.number().positive().optional(),
  category: z.string().min(1),
  stockQuantity: z.number().int().min(0),
  images: z.array(z.string().url()),
  features: z.array(z.string()).optional(),
  warranty: z.string().optional(),
  delivery: z.string().optional(),
  installation: z.boolean().optional(),
  isNew: z.boolean().optional(),
  isPromo: z.boolean().optional(),
})

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(products || [])
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des produits" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createProductSchema.parse(body)

    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        longDescription: validatedData.longDescription,
        price: validatedData.price,
        originalPrice: validatedData.originalPrice,
        category: validatedData.category,
        stockQuantity: validatedData.stockQuantity,
        images: validatedData.images,
        features: validatedData.features || [],
        warranty: validatedData.warranty,
        delivery: validatedData.delivery,
        installation: validatedData.installation || false,
        isNew: validatedData.isNew || false,
        isPromo: validatedData.isPromo || false,
        inStock: validatedData.stockQuantity > 0,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides", details: error.errors }, { status: 400 })
    }

    console.error("Erreur lors de la création du produit:", error)
    return NextResponse.json({ error: "Erreur lors de la création du produit" }, { status: 500 })
  }
}

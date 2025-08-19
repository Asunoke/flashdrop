import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  excerpt: z.string().min(1).optional(),
  image: z.string().url().optional(),
  published: z.boolean().optional(),
})

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json({ error: "Article non trouvé" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Erreur lors de la récupération de l'article:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération de l'article" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const validatedData = updatePostSchema.parse(body)

    const post = await prisma.post.update({
      where: { id },
      data: validatedData,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides", details: error.errors }, { status: 400 })
    }

    console.error("Erreur lors de la mise à jour de l'article:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour de l'article" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 })
    }

    const { id } = params

    await prisma.post.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la suppression de l'article:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression de l'article" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const postSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  excerpt: z.string().min(1, "L'extrait est requis"),
  content: z.string().min(1, "Le contenu est requis"),
  author: z.string().min(1, "L'auteur est requis"),
  category: z.string().min(1, "La catégorie est requise"),
  image: z.string().url("URL d'image invalide"),
  published: z.boolean().optional(),
})

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la récupération des articles" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const data = postSchema.parse(body)

    const post = await prisma.post.create({
      data: {
        ...data,
        userId: session.user.id,
        published: data.published ?? false,
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    return NextResponse.json({ error: "Erreur lors de la création de l'article" }, { status: 500 })
  }
}

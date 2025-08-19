import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"
import { z } from "zod"

const updateUserSchema = z.object({
  name: z.string().min(1, "Le nom est requis").optional(),
  email: z.string().email("Email invalide").optional(),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères").optional(),
  role: z.enum(["USER", "MANAGER", "ADMIN"]).optional(),
})

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 })
    }

    // Empêcher la modification de son propre compte
    if (session.user.id === params.id) {
      return NextResponse.json({ error: "Vous ne pouvez pas modifier votre propre compte" }, { status: 400 })
    }

    const body = await request.json()
    const validatedData = updateUserSchema.parse(body)

    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    })

    if (!existingUser) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (validatedData.email && validatedData.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: validatedData.email },
      })

      if (emailExists) {
        return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 400 })
      }
    }

    // Préparer les données de mise à jour
    const updateData: any = {
      name: validatedData.name,
      email: validatedData.email,
      role: validatedData.role,
    }

    // Hasher le nouveau mot de passe si fourni
    if (validatedData.password) {
      updateData.password = await hash(validatedData.password, 12)
    }

    // Mettre à jour l'utilisateur
    const user = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            orders: true,
          },
        },
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Données invalides", details: error.errors }, { status: 400 })
    }

    console.error("Erreur lors de la mise à jour de l'utilisateur:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour de l'utilisateur" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 })
    }

    // Empêcher la suppression de son propre compte
    if (session.user.id === params.id) {
      return NextResponse.json({ error: "Vous ne pouvez pas supprimer votre propre compte" }, { status: 400 })
    }

    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    })

    if (!existingUser) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    // Supprimer l'utilisateur (les posts et orders seront supprimés en cascade si configuré dans le schema)
    await prisma.user.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Utilisateur supprimé avec succès" })
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression de l'utilisateur" }, { status: 500 })
  }
}

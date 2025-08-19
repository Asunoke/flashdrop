import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Authentification requise" }, { status: 401 })
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
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
    })

    if (!order) {
      return NextResponse.json({ error: "Commande non trouvée" }, { status: 404 })
    }

    // Vérifier les permissions
    if (order.userId !== session.user.id && !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    // Vérifier si la commande a expiré
    if (order.status === "PENDING" && new Date() > order.expiresAt) {
      await prisma.order.update({
        where: { id: params.id },
        data: { status: "EXPIRED" },
      })
      order.status = "EXPIRED"
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Erreur lors de la récupération de la commande:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

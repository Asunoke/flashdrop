import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const rejectOrderSchema = z.object({
  rejectionReason: z.string().min(1, "La raison du rejet est requise"),
})

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const { rejectionReason } = rejectOrderSchema.parse(body)

    const order = await prisma.order.findUnique({
      where: { id: params.id },
    })

    if (!order) {
      return NextResponse.json({ error: "Commande non trouvée" }, { status: 404 })
    }

    if (order.status !== "PENDING") {
      return NextResponse.json({ error: "Cette commande ne peut pas être rejetée" }, { status: 400 })
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: "REJECTED",
        rejectionReason,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Erreur lors du rejet de la commande:", error)
    return NextResponse.json({ error: "Erreur lors du rejet de la commande" }, { status: 500 })
  }
}

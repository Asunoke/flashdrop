import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    await prisma.post.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de l'incrémentation des vues:", error)
    return NextResponse.json({ error: "Erreur lors de l'incrémentation des vues" }, { status: 500 })
  }
}

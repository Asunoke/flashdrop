"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Package,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Printer,
  Download,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"

interface OrderDetails {
  id: string
  total: number
  status: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  createdAt: string
  expiresAt: string
  items: Array<{
    quantity: number
    price: number
    product: {
      id: string
      name: string
      images: string[]
      category: string
    }
  }>
  user: {
    name: string
    email: string
  }
}

export default function OrderDetailsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return

    if (!session?.user || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      router.push("/auth/signin")
      return
    }

    fetchOrder()
  }, [session, status, router, params.id])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      } else {
        throw new Error("Commande non trouvée")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger la commande",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmOrder = async () => {
    if (!order) return

    try {
      const response = await fetch(`/api/orders/${order.id}/confirm`, {
        method: "POST",
      })

      if (response.ok) {
        setOrder({ ...order, status: "CONFIRMED" })
        toast({
          title: "Succès",
          description: "Commande confirmée",
        })
      } else {
        throw new Error("Erreur lors de la confirmation")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la confirmation de la commande",
        variant: "destructive",
      })
    }
  }

  const handleRejectOrder = async () => {
    if (!order) return

    try {
      const response = await fetch(`/api/orders/${order.id}/reject`, {
        method: "POST",
      })

      if (response.ok) {
        setOrder({ ...order, status: "REJECTED" })
        toast({
          title: "Succès",
          description: "Commande rejetée",
        })
      } else {
        throw new Error("Erreur lors du rejet")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors du rejet de la commande",
        variant: "destructive",
      })
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "REJECTED":
        return <XCircle className="w-5 h-5 text-red-600" />
      case "PENDING":
        return <Clock className="w-5 h-5 text-yellow-600" />
      case "EXPIRED":
        return <AlertCircle className="w-5 h-5 text-gray-600" />
      default:
        return <Package className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "Confirmée"
      case "REJECTED":
        return "Rejetée"
      case "PENDING":
        return "En attente"
      case "EXPIRED":
        return "Expirée"
      default:
        return status
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "default"
      case "REJECTED":
        return "destructive"
      case "PENDING":
        return "secondary"
      case "EXPIRED":
        return "outline"
      default:
        return "outline"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">Chargement...</h2>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Commande non trouvée</h2>
          <Button asChild>
            <Link href="/admin/dashboard">Retour au dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/admin/dashboard">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Commande #{order.id.slice(-8)}</h1>
                <p className="text-sm text-gray-500">Détails de la commande</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-2" />
                Imprimer
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Status et actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-8">
          <div className="flex items-center space-x-3">
            {getStatusIcon(order.status)}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Commande #{order.id.slice(-8)}</h2>
              <Badge variant={getStatusVariant(order.status)} className="mt-1">
                {getStatusText(order.status)}
              </Badge>
            </div>
          </div>

          {order.status === "PENDING" && (
            <div className="flex space-x-2">
              <Button onClick={handleConfirmOrder} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirmer
              </Button>
              <Button onClick={handleRejectOrder} variant="destructive">
                <XCircle className="w-4 h-4 mr-2" />
                Rejeter
              </Button>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Informations principales */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations client */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Informations client</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Nom complet</p>
                      <p className="font-medium">{order.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{order.customerEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Téléphone</p>
                      <p className="font-medium">{order.customerPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Adresse de livraison</p>
                      <p className="font-medium">{order.customerAddress}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Articles commandés */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>Articles commandés ({order.items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 relative">
                        <Image
                          src={item.product.images[0] || "/placeholder.svg?height=64&width=64"}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.product.name}</h4>
                        <p className="text-sm text-gray-500">{item.product.category}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm">Quantité: {item.quantity}</span>
                          <span className="text-sm">Prix unitaire: {formatPrice(item.price)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Résumé et informations */}
          <div className="space-y-6">
            {/* Résumé de la commande */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Résumé</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sous-total</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Livraison</span>
                    <span className="text-green-600">Gratuite</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations de la commande */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Informations</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Date de création</p>
                    <p className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {order.status === "PENDING" && (
                    <div>
                      <p className="text-sm text-gray-500">Expire le</p>
                      <p className="font-medium text-orange-600">
                        {new Date(order.expiresAt).toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Créée par</p>
                    <p className="font-medium">{order.user.name}</p>
                    <p className="text-sm text-gray-400">{order.user.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Historique des actions */}
            <Card>
              <CardHeader>
                <CardTitle>Historique</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Commande créée</p>
                      <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString("fr-FR")}</p>
                    </div>
                  </div>
                  {order.status === "CONFIRMED" && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Commande confirmée</p>
                        <p className="text-xs text-gray-500">Aujourd'hui</p>
                      </div>
                    </div>
                  )}
                  {order.status === "REJECTED" && (
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">Commande rejetée</p>
                        <p className="text-xs text-gray-500">Aujourd'hui</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

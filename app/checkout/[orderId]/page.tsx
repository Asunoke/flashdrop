"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Clock, Phone, Mail, MapPin, CreditCard, CheckCircle, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Order {
  id: string
  total: number
  status: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  expiresAt: string
  items: Array<{
    quantity: number
    price: number
    product: {
      name: string
      images: string[]
    }
  }>
}

export default function CheckoutPage() {
  const params = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [paymentRef, setPaymentRef] = useState("")
  const [isConfirming, setIsConfirming] = useState(false)
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)

  useEffect(() => {
    fetchOrder()
  }, [params.orderId])

  useEffect(() => {
    if (order && order.status === "PENDING") {
      const timer = setInterval(() => {
        const now = new Date().getTime()
        const expiry = new Date(order.expiresAt).getTime()
        const difference = expiry - now

        if (difference > 0) {
          setTimeLeft(Math.floor(difference / 1000))
        } else {
          setTimeLeft(0)
          clearInterval(timer)
        }
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [order])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${params.orderId}`)
      if (response.ok) {
        const orderData = await response.json()
        setOrder(orderData)
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de la commande:", error)
    }
  }

  const handleConfirmPayment = async () => {
    if (!paymentRef.trim()) {
      alert("Veuillez entrer la référence de paiement")
      return
    }

    setIsConfirming(true)
    try {
      const response = await fetch(`/api/orders/${params.orderId}/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentRef }),
      })

      if (response.ok) {
        setPaymentConfirmed(true)
        fetchOrder()
      }
    } catch (error) {
      console.error("Erreur lors de la confirmation:", error)
    } finally {
      setIsConfirming(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Chargement...</h2>
        </div>
      </div>
    )
  }

  if (order.status === "EXPIRED") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-8">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">Commande expirée</h2>
            <p className="text-muted-foreground mb-4">
              Le délai de paiement de 20 minutes a expiré. Veuillez passer une nouvelle commande.
            </p>
            <Button asChild>
              <a href="/boutique">Retour à la boutique</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (order.status === "CONFIRMED") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">Commande confirmée</h2>
            <p className="text-muted-foreground mb-4">
              Votre commande a été confirmée et sera traitée dans les plus brefs délais.
            </p>
            <Button asChild>
              <a href="/user/dashboard">Voir mes commandes</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (order.status === "REJECTED") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-8">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground mb-2">Commande rejetée</h2>
            <p className="text-muted-foreground mb-4">
              Votre commande a été rejetée. Contactez-nous pour plus d'informations.
            </p>
            <Button asChild>
              <a href="tel:+22385239219">Nous contacter</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Finaliser votre commande</h1>
          <p className="text-muted-foreground">Suivez les instructions pour compléter votre paiement</p>
        </div>

        {timeLeft > 0 && (
          <Alert className="mb-6">
            <Clock className="h-4 w-4" />
            <AlertDescription>
              <strong>Temps restant pour le paiement: {formatTime(timeLeft)}</strong>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Informations de commande */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Récapitulatif de la commande</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <Image
                        src={item.product.images[0] || "/placeholder.svg"}
                        alt={item.product.name}
                        width={60}
                        height={60}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Quantité: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="font-semibold">{formatPrice(item.quantity * item.price)}</div>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total</span>
                      <span>{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informations de livraison</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{order.customerName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{order.customerEmail}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{order.customerPhone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{order.customerAddress}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Instructions de paiement */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Paiement Orange Money</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="bg-orange-100 dark:bg-orange-900/20 p-6 rounded-lg mb-4">
                    <Image
                      src="/placeholder.svg?height=200&width=200&text=QR+Code"
                      alt="QR Code Orange Money"
                      width={200}
                      height={200}
                      className="mx-auto mb-4"
                    />
                    <div className="text-2xl font-bold text-orange-600 mb-2">85 23 92 19</div>
                    <p className="text-sm text-muted-foreground">Numéro de dépôt Orange Money</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Instructions de paiement:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Composez #144# sur votre téléphone</li>
                    <li>Sélectionnez "Transfert d'argent"</li>
                    <li>
                      Entrez le numéro: <strong>85 23 92 19</strong>
                    </li>
                    <li>
                      Montant: <strong>{formatPrice(order.total)}</strong>
                    </li>
                    <li>Confirmez le transfert</li>
                    <li>Notez la référence de transaction</li>
                  </ol>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="paymentRef">Référence de transaction</Label>
                  <Input
                    id="paymentRef"
                    placeholder="Ex: OM240125.1234.A12345"
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                  />
                  <Button
                    onClick={handleConfirmPayment}
                    disabled={isConfirming || !paymentRef.trim()}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                  >
                    {isConfirming ? "Confirmation..." : "Confirmer le paiement"}
                  </Button>
                </div>

                {paymentConfirmed && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Paiement confirmé ! Votre commande est en cours de vérification.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-sm text-muted-foreground">
                  <p className="mb-2">Besoin d'aide ?</p>
                  <div className="flex justify-center space-x-4">
                    <Button variant="outline" size="sm" asChild>
                      <a href="tel:+223764827002">Appeler</a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://wa.me/22385239219">WhatsApp</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

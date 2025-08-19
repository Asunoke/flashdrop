"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart, User, Mail, Phone, MapPin, CreditCard } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"

interface CartItem {
  id: string
  name: string
  price: number
  images: string[]
  stockQuantity: number
  quantity: number
}

interface CustomerInfo {
  name: string
  email: string
  phone: string
  address: string
}

export default function CartPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
    address: "",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin")
      return
    }

    // Charger le panier depuis localStorage
    const savedCart = localStorage.getItem("evotech-cart")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }

    // Pré-remplir les infos client si disponibles
    if (session.user) {
      setCustomerInfo((prev) => ({
        ...prev,
        name: session.user.name || "",
        email: session.user.email || "",
      }))
    }
  }, [session, status, router])

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return

    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        const maxQuantity = Math.min(newQuantity, item.stockQuantity)
        return { ...item, quantity: maxQuantity }
      }
      return item
    })

    setCartItems(updatedCart)
    localStorage.setItem("evotech-cart", JSON.stringify(updatedCart))

    if (newQuantity > cartItems.find((item) => item.id === id)?.stockQuantity!) {
      toast({
        title: "Stock insuffisant",
        description: "Quantité ajustée selon le stock disponible",
        variant: "destructive",
      })
    }
  }

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id)
    setCartItems(updatedCart)
    localStorage.setItem("evotech-cart", JSON.stringify(updatedCart))

    toast({
      title: "Article retiré",
      description: "L'article a été retiré du panier",
    })
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validation
      if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
        toast({
          title: "Informations manquantes",
          description: "Veuillez remplir tous les champs",
          variant: "destructive",
        })
        return
      }

      if (cartItems.length === 0) {
        toast({
          title: "Panier vide",
          description: "Ajoutez des articles à votre panier",
          variant: "destructive",
        })
        return
      }

      // Créer la commande
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        customerAddress: customerInfo.address,
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        const order = await response.json()

        // Vider le panier
        localStorage.removeItem("evotech-cart")

        toast({
          title: "Commande créée",
          description: "Redirection vers le paiement...",
        })

        // Rediriger vers la page de paiement
        router.push(`/checkout/${order.id}`)
      } else {
        const error = await response.json()
        throw new Error(error.error || "Erreur lors de la création de la commande")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la création de la commande",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Chargement...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/boutique">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground">Mon Panier</h1>
                <p className="text-sm text-muted-foreground">{cartItems.length} article(s)</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold">{formatPrice(getTotalPrice())}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Votre panier est vide</h2>
            <p className="text-muted-foreground mb-6">Découvrez nos produits et ajoutez-les à votre panier</p>
            <Button asChild>
              <Link href="/boutique">Découvrir nos produits</Link>
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Articles du panier */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Articles ({cartItems.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 border rounded-lg"
                    >
                      <div className="w-full sm:w-20 h-48 sm:h-20 relative">
                        <Image
                          src={item.images[0] || "/placeholder.svg?height=80&width=80"}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>

                      <div className="flex-1 w-full">
                        <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                        <p className="text-muted-foreground text-sm mb-2">Stock disponible: {item.stockQuantity}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.stockQuantity}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end space-x-4">
                            <span className="font-semibold text-lg">{formatPrice(item.price * item.quantity)}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Formulaire et résumé */}
            <div className="space-y-6">
              {/* Informations client */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Informations de livraison</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Nom complet</span>
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Votre nom complet"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>Email</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="votre@email.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>Téléphone</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="+223 XX XX XX XX"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>Adresse de livraison</span>
                      </Label>
                      <Textarea
                        id="address"
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo((prev) => ({ ...prev, address: e.target.value }))}
                        placeholder="Votre adresse complète de livraison"
                        rows={3}
                        required
                      />
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Résumé de la commande */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Résumé de la commande</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Sous-total ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} articles)</span>
                      <span>{formatPrice(getTotalPrice())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Livraison</span>
                      <span className="text-green-600">on vous contactera</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{formatPrice(getTotalPrice())}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={loading || cartItems.length === 0}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? "Création en cours..." : "Continuer vers le paiement"}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    En continuant, vous acceptez nos conditions d'utilisation
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

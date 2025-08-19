"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ShoppingCart, Share2, Plus, Minus, Package, Truck, Shield, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"

interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  stockQuantity: number
  inStock: boolean
  createdAt: string
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [cartItems, setCartItems] = useState<any[]>([])

  useEffect(() => {
    fetchProduct()
    loadCart()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data)
      } else {
        throw new Error("Produit non trouvé")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger le produit",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadCart = () => {
    const savedCart = localStorage.getItem("evotech-cart")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }

  const addToCart = (buyNow = false) => {
    if (!product) return

    const existingCart = JSON.parse(localStorage.getItem("evotech-cart") || "[]")
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id)

    if (existingItemIndex > -1) {
      const newQuantity = existingCart[existingItemIndex].quantity + quantity
      if (newQuantity <= product.stockQuantity) {
        existingCart[existingItemIndex].quantity = newQuantity
      } else {
        toast({
          title: "Stock insuffisant",
          description: `Seulement ${product.stockQuantity} articles disponibles`,
          variant: "destructive",
        })
        return
      }
    } else {
      existingCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images,
        stockQuantity: product.stockQuantity,
        quantity: quantity,
      })
    }

    localStorage.setItem("evotech-cart", JSON.stringify(existingCart))
    setCartItems(existingCart)

    toast({
      title: "Ajouté au panier",
      description: `${quantity} ${product.name} ajouté(s) au panier`,
    })

    if (buyNow) {
      router.push("/cart")
    }
  }

  const shareProduct = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Lien copié",
        description: "Le lien du produit a été copié dans le presse-papiers",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
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

  const getStockStatus = () => {
    if (!product) return { text: "", color: "" }

    if (product.stockQuantity === 0) {
      return { text: "Rupture de stock", color: "text-red-600" }
    } else if (product.stockQuantity <= 5) {
      return { text: `Plus que ${product.stockQuantity} en stock`, color: "text-orange-600" }
    } else {
      return { text: "En stock", color: "text-green-600" }
    }
  }

  const getCartItemCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Chargement...</h2>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Produit non trouvé</h2>
          <Button asChild>
            <Link href="/boutique">Retour à la boutique</Link>
          </Button>
        </div>
      </div>
    )
  }

  const stockStatus = getStockStatus()

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
                <h1 className="text-lg md:text-xl font-bold text-foreground line-clamp-1">{product.name}</h1>
                <p className="text-sm text-muted-foreground">{product.category}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={shareProduct}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" asChild className="relative">
                <Link href="/cart">
                  <ShoppingCart className="h-4 w-4" />
                  {getCartItemCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getCartItemCount()}
                    </span>
                  )}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg?height=600&width=600"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square relative bg-muted rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? "border-blue-600" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg?height=150&width=150"}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Détails du produit */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline">{product.category}</Badge>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground ml-1">(4.0)</span>
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold mb-4">{product.name}</h1>

              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl font-bold text-blue-600">{formatPrice(product.price)}</span>
                <span className={`text-sm font-medium ${stockStatus.color}`}>{stockStatus.text}</span>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            <Separator />

            {/* Quantité et actions */}
            {product.stockQuantity > 0 && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Quantité</label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-16 text-center font-medium text-lg">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                      disabled={quantity >= product.stockQuantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button onClick={() => addToCart(false)} variant="outline" size="lg" className="w-full">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Ajouter au panier
                  </Button>
                  <Button onClick={() => addToCart(true)} size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                    Acheter maintenant
                  </Button>
                </div>
              </div>
            )}

            {product.stockQuantity === 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">Ce produit est actuellement en rupture de stock.</p>
                <p className="text-red-600 text-sm mt-1">Contactez-nous pour être notifié de sa disponibilité.</p>
              </div>
            )}

            <Separator />

            {/* Informations de livraison */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Truck className="h-5 w-5 text-green-600" />
                <span>Livraison gratuite à Bamako</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Package className="h-5 w-5 text-blue-600" />
                <span>Emballage soigné et sécurisé</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Shield className="h-5 w-5 text-purple-600" />
                <span>Garantie constructeur incluse</span>
              </div>
            </div>
          </div>
        </div>

        {/* Produits similaires */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Produits similaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square bg-muted rounded-lg mb-4"></div>
                  <h3 className="font-semibold mb-2">Produit similaire {i}</h3>
                  <p className="text-muted-foreground text-sm mb-2">Description courte du produit</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-600">25,000 FCFA</span>
                    <Badge variant="outline">En stock</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

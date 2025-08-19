"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Star } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  stockQuantity: number
  isPromo?: boolean
  rating?: number
  reviews?: number
  createdAt: string
}

export function FlashSalesSection() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    fetchFlashProducts()
  }, [])

  const fetchFlashProducts = async () => {
    try {
      const res = await fetch("/api/products")
      if (res.ok) {
        const data: Product[] = await res.json()
        const promos = data.filter((p) => p.isPromo)
        setProducts(promos)
      }
    } catch (err) {
      console.error("Erreur chargement flash sales:", err)
      toast({
        title: "Erreur",
        description: "Impossible de charger les ventes flash",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(price)

  const calculateDiscount = (original: number, current: number) =>
    Math.round(((original - current) / original) * 100)

  // slider auto défilement
  useEffect(() => {
    if (products.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % products.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [products])

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/20 dark:to-yellow-900/20">
        <div className="container text-center">
          <p className="text-lg">Chargement des ventes flash...</p>
        </div>
      </section>
    )
  }

  if (products.length === 0) return null

  return (
    <section className="py-16 bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/20 dark:to-yellow-900/20">
      <div className="container mx-auto px-4">
       

        <div className="relative w-full max-w-4xl mx-auto overflow-hidden">
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {products.map((product) => (
              <div key={product.id} className="min-w-full px-4">
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="relative aspect-square">
                        <Image
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                        {product.originalPrice && (
                          <Badge className="absolute top-3 left-3 bg-red-600 text-white">
                            -{calculateDiscount(product.originalPrice, product.price)}%
                          </Badge>
                        )}
                      </div>
                      <div className="p-6 flex flex-col justify-between">
                        <div>
                          <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                          <p className="text-muted-foreground mb-4">{product.description}</p>

                          <div className="flex items-center mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating || 4.5)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                            <span className="text-sm text-muted-foreground ml-2">
                              ({product.reviews || 10})
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl font-bold text-red-600">
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice && (
                              <span className="text-muted-foreground line-through">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>
                          <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
                            <Link href={`/boutique/${product.id}`}>
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Voir l&apos;offre
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Dots navigation */}
          <div className="flex justify-center mt-6 gap-2">
            {products.map((_, idx) => (
              <button
                key={idx}
                className={`w-3 h-3 rounded-full ${
                  idx === currentIndex ? "bg-orange-600" : "bg-gray-300"
                }`}
                onClick={() => setCurrentIndex(idx)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

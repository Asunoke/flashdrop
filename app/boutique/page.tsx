"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Grid, List, Heart, Star, ShoppingCart, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Footer } from "@/components/footer"
import { ThemeToggle } from "@/components/theme-toggle"

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  stockQuantity: number
  isNew?: boolean
  isPromo?: boolean
  rating?: number
  reviews?: number
  createdAt: string
}

export default function BoutiquePage() {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [wishlist, setWishlist] = useState<string[]>([])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error)
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des produits",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const calculateDiscount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100)
  }

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))]

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
          return a.name.localeCompare(b.name)
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Chargement des produits...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-900/20 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Flash Drop Market</h1>
          <p className="text-xl mb-8 text-orange-600 max-w-2xl mx-auto">
            Découvrez notre sélection de produits technologiques de qualité. Ordinateurs, smartphones, accessoires et
            bien plus encore.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
              Voir tous les produits
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-card shadow-sm border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories
                    .filter((cat) => cat !== "all")
                    .map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Plus récents</SelectItem>
                  <SelectItem value="price-low">Prix croissant</SelectItem>
                  <SelectItem value="price-high">Prix décroissant</SelectItem>
                  <SelectItem value="name">Nom A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <p className="text-muted-foreground">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""} trouvé
              {filteredProducts.length > 1 ? "s" : ""}
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Aucun produit trouvé</h3>
              <p className="text-muted-foreground mb-4">Essayez de modifier vos critères de recherche</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <div
              className={`grid gap-6 ${
                viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
              }`}
            >
              {filteredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="aspect-square relative overflow-hidden rounded-t-lg bg-muted">
                        <Image
                          src={product.images[0] || "/placeholder.svg?height=300&width=300"}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {product.isNew && (
                            <Badge className="bg-green-600 hover:bg-green-700 text-white">Nouveau</Badge>
                          )}
                          {product.isPromo && product.originalPrice && (
                            <Badge className="bg-red-600 hover:bg-red-700 text-white">
                              -{calculateDiscount(product.originalPrice, product.price)}%
                            </Badge>
                          )}
                        </div>
                        {/* Wishlist */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-3 right-3 bg-background/80 hover:bg-background"
                          onClick={() => toggleWishlist(product.id)}
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              wishlist.includes(product.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"
                            }`}
                          />
                        </Button>
                        {/* Stock overlay */}
                        {product.stockQuantity === 0 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge variant="destructive" className="text-sm">
                              Rupture de stock
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="mb-2">
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                      </div>

                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors text-foreground">
                        <Link href={`/boutique/${product.id}`}>{product.name}</Link>
                      </h3>

                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>

                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
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
                        </div>
                        <span className="text-sm text-muted-foreground ml-2">({product.reviews || 12})</span>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-blue-600">{formatPrice(product.price)}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-xs font-medium ${
                            product.stockQuantity > 10
                              ? "text-green-600"
                              : product.stockQuantity > 0
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {product.stockQuantity > 10
                            ? "En stock"
                            : product.stockQuantity > 0
                              ? `${product.stockQuantity} restants`
                              : "Rupture"}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          asChild
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                          disabled={product.stockQuantity === 0}
                        >
                          <Link href={`/boutique/${product.id}`}>
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            {product.stockQuantity > 0 ? "Voir détails" : "Indisponible"}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

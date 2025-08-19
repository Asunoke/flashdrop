"use client"

import {
  ShoppingBag,
  Zap,
  Users,
  Store,
  
  Star,
  ArrowRight,
  Check,
  Percent,
  Shield,
 
  Truck,
  
  Award,
  TrendingUp,
 
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { MobileMenu } from "@/components/mobile-menu"
import { FlashSalesSection } from "@/components/flashsalessection"
import { Footer } from "@/components/footer"
export default function Component() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30,
  })

  
  const categories = [
    { name: "Smartphones", icon: "📱", count: 0 },
    { name: "Ordinateurs", icon: "💻", count: 0 },
    { name: "Audio", icon: "🎧", count: 0 },
    { name: "Tablettes", icon: "📱", count: 0 },
    { name: "Accessoires", icon: "🔌", count: 0 },
    { name: "Gaming", icon: "🎮", count: 0 },
  ]

  const testimonials = [
    {
      id: 1,
      name: "cheick oumar traore",
      location: "Bamako",
      rating: 5,
      comment: "J'ai économisé plus de 200,000 FCFA sur mon iPhone ! Livraison rapide et produit authentique.",
      avatar: "https://cdn.pixabay.com/photo/2025/07/14/16/59/kananaskis-9714444_1280.jpg",
    },
    {
      id: 2,
      name: "SD Multi service",
      location: "Bamako",
      rating: 5,
      comment: "Excellent service ! Les ventes flash sont vraiment intéressantes. Je recommande vivement FDM.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
    },
    {
      id: 3,
      name: "Fatoumata Coulibaly",
      location: "Bamako",
      rating: 5,
      comment: "Interface simple, paiement sécurisé avec Orange Money. Parfait pour nous au Mali !",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
    },
  ]

useEffect(() => {
  setIsVisible(true)

  // Timer countdown
  const timer = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev.seconds > 0) {
        return { ...prev, seconds: prev.seconds - 1 }
      } else if (prev.minutes > 0) {
        return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
      } else if (prev.hours > 0) {
        return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
      }
      return prev
    })
  }, 1000)

  // Cleanup interval on unmount
  return () => clearInterval(timer)
}, [])

const getVisibleDeals = () => {
  const dealsPerSlide = 3
  const startIndex = currentSlide * dealsPerSlide
  
}

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">FDM</h1>
                <p className="text-xs text-muted-foreground">Flash Drop Market</p>
              </div>
            </div>

            {/* Navigation Links - Desktop */}
            <nav className="hidden md:flex space-x-8">
              <Link href="#accueil" className="text-foreground hover:text-orange-600 font-medium transition-colors">
                Accueil
              </Link>
              <Link href="#deals" className="text-foreground hover:text-orange-600 font-medium transition-colors">
                Ventes Flash
              </Link>
              <Link href="#categories" className="text-foreground hover:text-orange-600 font-medium transition-colors">
                Catégories
              </Link>
              <Link href="#plans" className="text-foreground hover:text-orange-600 font-medium transition-colors">
                Abonnements
              </Link>
              <Link href="/boutique" className="text-foreground hover:text-orange-600 font-medium transition-colors">
                Boutique
              </Link>
            </nav>

            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Button variant="outline" className="hidden sm:inline-flex bg-transparent">
                <Store className="w-4 h-4 mr-2" />
                <Link href="/auth/signin">vendre</Link>
              </Button>
              <Button className="bg-orange-600 hover:bg-orange-700 hidden sm:inline-flex" asChild>
                <Link href="/auth/signin">Connexion</Link>
              </Button>
              <MobileMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="accueil"
        className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-900/20 py-20"
      >
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div
              className={`transform transition-all duration-1000 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
            >
              <Badge className="mb-4 bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900 dark:text-orange-200">
                🔥 Ventes Flash Quotidiennes
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
                Les meilleures <span className="text-orange-600">offres flash</span> du Mali
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Découvrez des produits de qualité à prix réduits. Nouvelles offres chaque jour, stocks limités !
              </p>

              {/* Countdown Timer */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg mb-8 border">
                <div className="text-center mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Prochaine vente flash dans :</span>
                </div>
                <div className="flex justify-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {timeLeft.hours.toString().padStart(2, "0")}
                    </div>
                    <div className="text-xs text-muted-foreground">Heures</div>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">:</div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {timeLeft.minutes.toString().padStart(2, "0")}
                    </div>
                    <div className="text-xs text-muted-foreground">Minutes</div>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">:</div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {timeLeft.seconds.toString().padStart(2, "0")}
                    </div>
                    <div className="text-xs text-muted-foreground">Secondes</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 group">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  <Link href="/boutique">Voir les offres</Link>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button size="lg" variant="outline">
                  <Store className="mr-2 h-4 w-4" />
                 <Link href="/devenir-vendeur">  Devenir vendeur </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-12">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">5+</div>
                  <div className="text-sm text-muted-foreground">Clients satisfaits</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">10+</div>
                  <div className="text-sm text-muted-foreground">Produits vendus</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">24h</div>
                  <div className="text-sm text-muted-foreground">Livraison rapide</div>
                </div>
              </div>
            </div>
            <div
              className={`relative transform transition-all duration-1000 delay-300 ${isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
            >
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop"
                  alt="Shopping et ventes flash au Mali"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                  priority
                />
                <div className="absolute -bottom-6 -left-6 bg-background p-4 rounded-lg shadow-lg border">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Offres en direct</span>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 bg-orange-600 text-white p-3 rounded-lg shadow-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold">-50%</div>
                    <div className="text-xs">Jusqu'à</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Catégories Populaires</h2>
            <p className="text-muted-foreground">Explorez nos différentes catégories de produits</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{category.icon}</div>
                  <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">{category.count} produits</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Pourquoi choisir FDM ?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              La plateforme de ventes flash la plus fiable du Mali
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Client Benefit 1 */}
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group border-orange-200 dark:border-orange-800">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <Percent className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-orange-600">Prix Imbattables</CardTitle>
                <CardDescription className="text-center">
                  Jusqu'à 70% de réduction sur des produits de qualité. Nouvelles offres chaque jour.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Client Benefit 2 */}
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group border-orange-200 dark:border-orange-800">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-orange-600">Achat Sécurisé</CardTitle>
                <CardDescription className="text-center">
                  Paiement sécurisé avec Orange Money, garantie de remboursement et service client 24h/7j.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Additional Benefit */}
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group border-orange-200 dark:border-orange-800">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <Truck className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-orange-600">Livraison Rapide</CardTitle>
                <CardDescription className="text-center">
                  Livraison en 24h à Bamako et 48h dans les autres régions du Mali.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Vendor Benefit */}
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group border-orange-200 dark:border-orange-800">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-orange-600">Vendez Plus</CardTitle>
                <CardDescription className="text-center">
                  Accédez à des milliers de clients, outils de gestion avancés et support marketing.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Flash Deals Slider */}
      <section id="deals" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">🔥 Ventes Flash du Jour</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Offres limitées, dépêchez-vous !</p>
          </div>

          <FlashSalesSection />

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="group bg-transparent" asChild>
              <Link href="/boutique">
                Voir toutes les offres
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section id="plans" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Nos Abonnements</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choisissez le plan qui vous convient le mieux
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className="relative hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-600" />
                </div>
                <CardTitle className="text-2xl">Gratuit</CardTitle>
                <div className="text-center py-4">
                  <span className="text-4xl font-bold">0</span>
                  <span className="text-muted-foreground"> FCFA/mois</span>
                </div>
                <CardDescription className="text-center">Pour découvrir FDM</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Accès aux ventes flash</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Support client de base</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Livraison standard</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Paiement sécurisé</span>
                  </div>
                </div>
                <Button className="w-full bg-transparent" variant="outline">
                  <Link href="https://wa.me/22391973041">Commencer gratuitement</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Vendor Premium */}
            <Card className="relative hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-orange-200 dark:border-orange-800">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-orange-600 text-white px-4 py-1">Populaire</Badge>
              </div>
              <CardHeader className="text-center pt-8">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Store className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle className="text-2xl text-orange-600">Vendeur Premium</CardTitle>
                <div className="text-center py-4">
                  <span className="text-4xl font-bold">4,500</span>
                  <span className="text-muted-foreground"> FCFA/mois</span>
                </div>
                <CardDescription className="text-center">Pour les vendeurs ambitieux</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Boutique personnalisée</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Outils d'analyse avancés</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Support prioritaire</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Commission réduite (5%)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Promotion de vos produits</span>
                  </div>
                </div>
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  <Link href="https://wa.me/22391973041">Devenir vendeur premium </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Client Premium+ */}
            <Card className="relative hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl text-blue-600">Client Premium+</CardTitle>
                <div className="text-center py-4">
                  <span className="text-4xl font-bold">3,000</span>
                  <span className="text-muted-foreground"> FCFA/mois</span>
                </div>
                <CardDescription className="text-center">Pour les acheteurs réguliers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Accès anticipé aux deals</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Livraison gratuite</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Réductions exclusives</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Support VIP 24h/7j</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Garantie étendue</span>
                  </div>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700"><Link href="https://wa.me/22391973041">Passer au premium </Link></Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Ce que disent nos clients</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Plus de 5 clients satisfaits nous font confiance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.comment}"</p>
                  <div className="flex items-center space-x-3">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Prêt à découvrir les meilleures offres du Mali ?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Rejoignez des milliers de Maliens qui économisent chaque jour avec FDM
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Commencer à acheter
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-orange-600 bg-transparent"
            >
              <Store className="mr-2 h-5 w-5" />
              Devenir vendeur
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
    <Footer />
    </div>
  )
}

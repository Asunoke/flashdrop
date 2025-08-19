import React from "react"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, MapPin, Package, ShoppingBag, Smartphone, Truck, Check, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "FlashDrop Market - Programme Vendeurs",
  description: "Rejoignez le programme vendeur FlashDrop Market pour vendre rapidement vos produits au Mali avec notre plateforme de ventes flash.",
  keywords: ["vendeur", "e-commerce Mali", "ventes flash", "programme vendeur", "vendre en ligne Mali"],
}

export default function SellerProgramPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Simple Nav */}
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-orange-600">FlashDrop Market</h1>
        <div className="space-x-6">
          <Link href="#features" className="text-gray-800 hover:text-orange-600 font-medium">Fonctionnalités</Link>
          <Link href="#pricing" className="text-gray-800 hover:text-orange-600 font-medium">Plans</Link>
          <Link href="#testimonials" className="text-gray-800 hover:text-orange-600 font-medium">Témoignages</Link>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-orange-600 text-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">
                  Programme Vendeur FlashDrop
                </h1>
                <p className="max-w-[600px] text-orange-100 md:text-xl">
                  Version 3 : Nous nous chargeons d'uploader vos produits et de vendre pour vous. Votre dashboard vendeur arrive dans la V4.
                </p>
                <Link href="https://wa.me/22391973041" target="_blank">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full text-lg font-medium shadow-lg flex items-center gap-2">
                    <Smartphone className="h-5 w-5" /> Contacter sur WhatsApp
                  </Button>
                </Link>
              </div>
              <div className="flex justify-center">
                <Image
                  src="/ff.webp"
                  alt="Vendeur FlashDrop Market"
                  width={500}
                  height={500}
                  className="rounded-lg object-cover shadow-xl"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-12">🎯 Fonctionnalités V3</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="bg-orange-600 p-3 rounded-full mb-4">
                    <ShoppingBag className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Ventes Flash Organisées</h3>
                  <p className="text-gray-600">Maximisez votre visibilité avec nos ventes flash thématiques.</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="bg-orange-600 p-3 rounded-full mb-4">
                    <Smartphone className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Paiements Mobiles</h3>
                  <p className="text-gray-600">Recevez vos paiements instantanément via Orange Money ou Moov Money.</p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="bg-orange-600 p-3 rounded-full mb-4">
                    <Truck className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Logistique Simplifiée</h3>
                  <p className="text-gray-600">Nous gérons la livraison ou le retrait pour vous.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 px-6 bg-purple-50">
          <div className="max-w-5xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-12">💼 Plans Vendeur</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Free Plan */}
              <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h4 className="text-2xl font-bold text-orange-600 mb-2">Free</h4>
                <p className="text-4xl font-bold mb-4">0 FCFA</p>
                <p className="mb-6 text-gray-600">Rejoignez la liste d’attente pour seulement 2 500 FCFA inscription unique</p>
                <ul className="space-y-3 text-left mb-6">
                  <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> Accès à la plateforme</li>
                  <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> Participation aux ventes flash</li>
                  <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> Commission : 10% par vente</li>
                </ul>
                <Link href="https://wa.me/22385239219" target="_blank">
                  <Button variant="outline" className="w-full">Rejoindre la liste d'attente</Button>
                </Link>
              </div>

              {/* Premium Plan */}
              <div className="bg-white border-2 border-yellow-500 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <h4 className="text-2xl font-bold text-orange-700 mb-2">Premium</h4>
                <p className="text-4xl font-bold mb-4">4 500 FCFA<span className="text-sm font-normal">/mois</span></p>
                <ul className="space-y-3 text-left mb-6">
                  <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> Tous les avantages Free</li>
                  <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> Visibilité boostée</li>
                  <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> Support prioritaire</li>
                  <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-2" /> Conseiller dédié</li>
                </ul>
                <Link href="https://wa.me/22385239219" target="_blank">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">Choisir Premium</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  )
}

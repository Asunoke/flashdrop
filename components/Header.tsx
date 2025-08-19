"use client"

import Link from "next/link"
import { Zap, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/ThemeToggle"
import MobileMenu from "@/components/MobileMenu"

export default function Header() {
  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">FDM</h1>
              <p className="text-xs text-muted-foreground">Flash Drop Market</p>
            </div>
          </div>

          {/* Navigation - Desktop */}
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

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="outline" className="hidden sm:inline-flex bg-transparent" asChild>
              <Link href="/auth/signin">
                <Store className="w-4 h-4 mr-2" />
                Vendre
              </Link>
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700 hidden sm:inline-flex" asChild>
              <Link href="/auth/signin">Connexion</Link>
            </Button>
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  )
}

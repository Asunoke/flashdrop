"use client"

import Link from "next/link"
import { Zap, Facebook, Instagram, Twitter, MapPin, Phone, Mail, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"

export  function Footer() {
  return (
    <footer className="bg-muted text-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Logo + Intro */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">FDM</h3>
                <p className="text-xs text-muted-foreground">Flash Drop Market</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-6 max-w-md">
              La première plateforme de ventes flash du Mali. Des produits de qualité à prix réduits,
              livrés rapidement dans tout le pays.
            </p>
            <div className="flex space-x-4">
              <Button size="icon" variant="outline" className="hover:bg-orange-50 bg-transparent">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="outline" className="hover:bg-orange-50 bg-transparent">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="outline" className="hover:bg-orange-50 bg-transparent">
                <Twitter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Acheter */}
          <div>
            <h4 className="font-semibold mb-4">Acheter</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/boutique" className="hover:text-orange-600 transition-colors">
                  Ventes Flash
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-orange-600 transition-colors">
                  Catégories
                </Link>
              </li>
              <li>
                <Link href="/nouveautes" className="hover:text-orange-600 transition-colors">
                  Nouveautés
                </Link>
              </li>
              <li>
                <Link href="/meilleures-ventes" className="hover:text-orange-600 transition-colors">
                  Meilleures ventes
                </Link>
              </li>
            </ul>
          </div>

          {/* Vendre */}
          <div>
            <h4 className="font-semibold mb-4">Vendre</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/devenir-vendeur" className="hover:text-orange-600 transition-colors">
                  Devenir vendeur
                </Link>
              </li>
              <li>
                <Link href="#plans" className="hover:text-orange-600 transition-colors">
                  Abonnements
                </Link>
              </li>
              <li>
                <Link href="/guide-vendeur" className="hover:text-orange-600 transition-colors">
                  Guide du vendeur
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-orange-600 transition-colors">
                  Espace vendeur
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-orange-600" />
                <span>Bamako, Mali</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-orange-600" />
                <a href="tel:+22385239219" className="hover:text-orange-600 transition-colors">
                  +223 85 23 92 19
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-orange-600" />
                <a href="mailto:contact@fdm-mali.com" className="hover:text-orange-600 transition-colors">
                  contact@fdm-mali.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Headphones className="w-4 h-4 text-orange-600" />
                <span>Support 24h/7j</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground mb-4 md:mb-0">
              <p>© 2024 Tenoble Softwares (TS). Tous droits réservés.</p>
              
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <Link href="/mentions-legales" className="hover:text-orange-600 transition-colors">
                Mentions légales
              </Link>
              <Link href="/politique-confidentialite" className="hover:text-orange-600 transition-colors">
                Confidentialité
              </Link>
              <Link href="/cgv" className="hover:text-orange-600 transition-colors">
                CGV
              </Link>
              <Link href="/aide" className="hover:text-orange-600 transition-colors">
                Aide
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

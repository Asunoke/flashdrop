"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Home, Info, User, BookOpen, Users, ShoppingBag, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"

const menuItems = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/about", label: "À propos", icon: Info },
  { href: "/boutique", label: "Boutique", icon: ShoppingBag },
  { href: "/blog", label: "Blog", icon: BookOpen },
  { href: "/carrieres", label: "Carrières", icon: Users },
  { href: "#contact", label: "Contact", icon: Phone },
  { href: "/auth/signin", label: "Dashboard", icon: User },
]

export function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Ouvrir le menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#4B0082] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <div>
              <span className="text-lg font-bold">Flashdrop Market</span>
              <p className="text-xs text-muted-foreground">Pour les pros</p>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col space-y-4 mt-8">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
              >
                <Icon className="h-5 w-5 text-[#4B0082]" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Thème</span>
            <ThemeToggle />
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            © 2024 Flashdrop Market
            <br />
            Tous droits réservés
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
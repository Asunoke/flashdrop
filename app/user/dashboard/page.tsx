"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  TrendingUp,
  LogOut,
  Menu,
  Users,
  AlertCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"

interface Order {
  id: string
  total: number
  status: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  createdAt: string
  items: Array<{
    quantity: number
    price: number
    product: {
      name: string
      images: string[]
    }
  }>
}

export default function UserDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin")
      return
    }

    fetchOrders()
  }, [session, status, router])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders")
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des commandes:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger vos commandes",
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "REJECTED":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "PENDING":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "EXPIRED":
        return <AlertCircle className="w-4 h-4 text-gray-600" />
      default:
        return <Package className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "Confirmée"
      case "REJECTED":
        return "Rejetée"
      case "PENDING":
        return "En attente"
      case "EXPIRED":
        return "Expirée"
      default:
        return status
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "default"
      case "REJECTED":
        return "destructive"
      case "PENDING":
        return "secondary"
      case "EXPIRED":
        return "outline"
      default:
        return "outline"
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "#", active: true },
    { icon: ShoppingCart, label: "Mes commandes", href: "#orders" },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-foreground">Chargement...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-80 p-0">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">FDM</span>
                </div>
                <div>
                  <h2 className="font-bold text-lg text-foreground">FDM</h2>
                  <p className="text-sm text-muted-foreground">Dashboard</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                          item.active
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-foreground">{session?.user?.name}</p>
                  <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
                </div>
              </div>
              <Button onClick={handleSignOut} variant="outline" size="sm" className="w-full bg-transparent">
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-80 lg:flex-col">
        <div className="flex flex-col flex-grow bg-card border-r border-border">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">FDM</span>
              </div>
              <div>
                <h2 className="font-bold text-lg text-foreground">FDM</h2>
                <p className="text-sm text-muted-foreground">Dashboard</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        item.active
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm text-foreground">{session?.user?.name}</p>
                <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
              </div>
            </div>
            <Button onClick={handleSignOut} variant="outline" size="sm" className="w-full bg-transparent">
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-80">
        {/* Header */}
        <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm border-b border-border sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                  <Menu className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">Mon Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Bienvenue, {session?.user?.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button variant="outline" asChild>
                  <Link href="/boutique">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Continuer mes achats
                  </Link>
                </Button>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Commandes</CardTitle>
                <Package className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{orders.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Toutes vos commandes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">En attente</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {orders.filter((o) => o.status === "PENDING").length}
                </div>
                <p className="text-xs text-yellow-600 mt-1">En cours de traitement</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Confirmées</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {orders.filter((o) => o.status === "CONFIRMED").length}
                </div>
                <p className="text-xs text-green-600 mt-1">Commandes validées</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total dépensé</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {formatPrice(orders.filter((o) => o.status === "CONFIRMED").reduce((sum, o) => sum + o.total, 0))}
                </div>
                <p className="text-xs text-blue-600 mt-1">Montant total validé</p>
              </CardContent>
            </Card>
          </div>

          {/* Orders Section */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <h2 className="text-2xl font-bold text-foreground">Mes commandes</h2>
              <Button asChild>
                <Link href="/boutique">Découvrir nos produits</Link>
              </Button>
            </div>

            {orders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-16">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Aucune commande</h3>
                  <p className="text-muted-foreground mb-6">Vous n'avez pas encore passé de commande</p>
                  <Button asChild>
                    <Link href="/boutique">Découvrir nos produits</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {orders.map((order) => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 mb-4">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(order.status)}
                          <div>
                            <h3 className="font-semibold text-lg text-foreground">Commande #{order.id.slice(-8)}</h3>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                              </div>
                              <div className="flex items-center">
                                <ShoppingCart className="w-4 h-4 mr-1" />
                                {order.items.reduce((sum, item) => sum + item.quantity, 0)} article(s)
                              </div>
                            </div>
                          </div>
                          <Badge variant={getStatusVariant(order.status)}>{getStatusText(order.status)}</Badge>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-xl font-bold text-foreground">{formatPrice(order.total)}</div>
                          </div>
                          {order.status === "PENDING" && (
                            <Button asChild size="sm">
                              <Link href={`/checkout/${order.id}`}>
                                <Eye className="w-4 h-4 mr-2" />
                                Voir le paiement
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Articles commandés */}
                      <div className="border border-border rounded-lg overflow-hidden">
                        <div className="bg-muted/50 px-4 py-2 border-b border-border">
                          <h4 className="font-medium text-sm text-foreground">Articles commandés</h4>
                        </div>
                        <div className="divide-y divide-border">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 relative">
                                  <Image
                                    src={item.product.images[0] || "/placeholder.svg?height=48&width=48"}
                                    alt={item.product.name}
                                    fill
                                    className="object-cover rounded"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium text-sm text-foreground">{item.product.name}</p>
                                  <p className="text-xs text-muted-foreground">Quantité: {item.quantity}</p>
                                </div>
                              </div>
                              <span className="font-medium text-sm text-foreground">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Status message */}
                      {order.status === "PENDING" && (
                        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 text-yellow-600 mr-2" />
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                              Votre commande est en attente de validation. Vous recevrez une confirmation par email.
                            </p>
                          </div>
                        </div>
                      )}

                      {order.status === "CONFIRMED" && (
                        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                            <p className="text-sm text-green-800 dark:text-green-200">
                              Votre commande a été confirmée ! Nous vous contacterons pour la livraison.
                            </p>
                          </div>
                        </div>
                      )}

                      {order.status === "REJECTED" && (
                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                          <div className="flex items-center">
                            <XCircle className="w-4 h-4 text-red-600 mr-2" />
                            <p className="text-sm text-red-800 dark:text-red-200">
                              Votre commande a été rejetée. Contactez-nous pour plus d'informations.
                            </p>
                          </div>
                        </div>
                      )}

                      {order.status === "EXPIRED" && (
                        <div className="mt-4 p-3 bg-muted/50 border border-border rounded-lg">
                          <div className="flex items-center">
                            <AlertCircle className="w-4 h-4 text-muted-foreground mr-2" />
                            <p className="text-sm text-muted-foreground">
                              Cette commande a expiré. Vous pouvez repasser commande si nécessaire.
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

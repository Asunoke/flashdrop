"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  LayoutDashboard,
  Package,
  FileText,
  ShoppingCart,
  Users,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Plus,
  LogOut,
  Menu,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Shield,
  UserCheck,
  UserX,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ProductForm } from "@/components/product-form"
import { PostForm } from "@/components/post-form"
import { UserForm } from "@/components/user-form"
import { ProductEditForm } from "@/components/product-edit-form"
import { PostEditForm } from "@/components/post-edit-form"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"

interface Product {
  id: string
  name: string
  description: string
  longDescription?: string
  price: number
  originalPrice?: number
  images: string[]
  features: string[]
  category: string
  stockQuantity: number
  warranty?: string
  delivery?: string
  installation: boolean
  isNew: boolean
  isPromo: boolean
  createdAt: string
}

interface Post {
  id: string
  title: string
  content: string
  excerpt: string
  image: string
  published: boolean
  views: number
  createdAt: string
  user: {
    name: string
    email: string
  }
}

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

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  _count: {
    posts: number
    orders: number
  }
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showProductForm, setShowProductForm] = useState(false)
  const [showPostForm, setShowPostForm] = useState(false)
  const [showUserForm, setShowUserForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === "loading") return

    if (!session?.user || session.user.role !== "ADMIN") {
      router.push("/auth/signin")
      return
    }

    fetchData()
  }, [session, status, router])

  const fetchData = async () => {
    try {
      const [productsRes, postsRes, ordersRes, usersRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/admin/posts"),
        fetch("/api/orders"),
        fetch("/api/users"),
      ])

      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData)
      }

      if (postsRes.ok) {
        const postsData = await postsRes.json()
        setPosts(postsData)
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setOrders(ordersData)
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== id))
        toast({
          title: "Succès",
          description: "Produit supprimé avec succès",
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || "Erreur lors de la suppression")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la suppression du produit",
        variant: "destructive",
      })
    }
  }

  const handleDeletePost = async (id: string) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setPosts(posts.filter((p) => p.id !== id))
        toast({
          title: "Succès",
          description: "Article supprimé avec succès",
        })
      } else {
        throw new Error("Erreur lors de la suppression")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de l'article",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (id: string) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setUsers(users.filter((u) => u.id !== id))
        toast({
          title: "Succès",
          description: "Utilisateur supprimé avec succès",
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || "Erreur lors de la suppression")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la suppression de l'utilisateur",
        variant: "destructive",
      })
    }
  }

  const handleConfirmOrder = async (id: string) => {
    try {
      const response = await fetch(`/api/orders/${id}/confirm`, {
        method: "POST",
      })

      if (response.ok) {
        setOrders(orders.map((o) => (o.id === id ? { ...o, status: "CONFIRMED" } : o)))
        toast({
          title: "Succès",
          description: "Commande confirmée",
        })
      } else {
        throw new Error("Erreur lors de la confirmation")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la confirmation de la commande",
        variant: "destructive",
      })
    }
  }

  const handleRejectOrder = async (id: string) => {
    try {
      const response = await fetch(`/api/orders/${id}/reject`, {
        method: "POST",
      })

      if (response.ok) {
        setOrders(orders.map((o) => (o.id === id ? { ...o, status: "REJECTED" } : o)))
        toast({
          title: "Succès",
          description: "Commande rejetée",
        })
      } else {
        throw new Error("Erreur lors du rejet")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors du rejet de la commande",
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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Shield className="w-4 h-4 text-red-600" />
      case "MANAGER":
        return <UserCheck className="w-4 h-4 text-blue-600" />
      case "USER":
        return <Users className="w-4 h-4 text-gray-600" />
      default:
        return <Users className="w-4 h-4 text-gray-600" />
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Administrateur"
      case "MANAGER":
        return "Manager"
      case "USER":
        return "Utilisateur"
      default:
        return role
    }
  }

  const getRoleVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "destructive"
      case "MANAGER":
        return "default"
      case "USER":
        return "secondary"
      default:
        return "outline"
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "#", active: true },
    { icon: Package, label: "Produits", href: "#products" },
    { icon: FileText, label: "Articles", href: "#posts" },
    { icon: ShoppingCart, label: "Commandes", href: "#orders" },
    { icon: Users, label: "Utilisateurs", href: "#users" },
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
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">f</span>
                </div>
                <div>
                  <h2 className="font-bold text-lg text-foreground">FDM</h2>
                  <p className="text-sm text-muted-foreground">Admin Dashboard</p>
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
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
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
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">F</span>
              </div>
              <div>
                <h2 className="font-bold text-lg text-foreground">FDM</h2>
                <p className="text-sm text-muted-foreground">Admin Dashboard</p>
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
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
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
                  <h1 className="text-xl font-semibold text-foreground">Dashboard Admin</h1>
                  <p className="text-sm text-muted-foreground">Gestion complète du site</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative hidden sm:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <ThemeToggle />
                <Button asChild>
                  <Link href="/">Voir le site</Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Produits</CardTitle>
                <Package className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{products.length}</div>
                <p className="text-xs text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +12% ce mois
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Articles</CardTitle>
                <FileText className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{posts.length}</div>
                <p className="text-xs text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +8% ce mois
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Commandes</CardTitle>
                <ShoppingCart className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{orders.length}</div>
                <p className="text-xs text-yellow-600 mt-1">
                  {orders.filter((o) => o.status === "PENDING").length} en attente
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Utilisateurs</CardTitle>
                <Users className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{users.length}</div>
                <p className="text-xs text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +5% ce mois
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Content Tabs */}
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
              <TabsTrigger value="products">Produits</TabsTrigger>
              <TabsTrigger value="posts">Articles</TabsTrigger>
              <TabsTrigger value="orders">Commandes</TabsTrigger>
              <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <h2 className="text-2xl font-bold text-foreground">Gestion des produits</h2>
                <Dialog open={showProductForm} onOpenChange={setShowProductForm}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter un produit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Nouveau produit</DialogTitle>
                    </DialogHeader>
                    <ProductForm
                      onSuccess={() => {
                        setShowProductForm(false)
                        fetchData()
                      }}
                      onCancel={() => setShowProductForm(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="w-full sm:w-20 h-48 sm:h-20 relative">
                          <Image
                            src={product.images[0] || "/placeholder.svg?height=80&width=80"}
                            alt={product.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2 text-foreground">{product.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
                          <div className="flex flex-wrap items-center gap-3">
                            <Badge variant="outline">{product.category}</Badge>
                            <span className="text-sm font-medium text-blue-600">{formatPrice(product.price)}</span>
                            <span className="text-sm text-muted-foreground">Stock: {product.stockQuantity}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(product.createdAt).toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                        </div>
                        <div className="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2">
                          <Button variant="outline" size="sm" className="flex-1 sm:flex-none bg-transparent">
                            <Eye className="w-4 h-4 mr-2" />
                            Voir
                          </Button>
                          <Dialog
                            open={editingProduct?.id === product.id}
                            onOpenChange={(open) => !open && setEditingProduct(null)}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 sm:flex-none bg-transparent"
                                onClick={() => setEditingProduct(product)}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Modifier
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Modifier le produit</DialogTitle>
                              </DialogHeader>
                              {editingProduct && (
                                <ProductEditForm
                                  product={editingProduct}
                                  onSuccess={() => {
                                    setEditingProduct(null)
                                    fetchData()
                                  }}
                                  onCancel={() => setEditingProduct(null)}
                                />
                              )}
                            </DialogContent>
                          </Dialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 sm:flex-none text-red-600 hover:text-red-700 bg-transparent"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Supprimer
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer le produit</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="posts" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <h2 className="text-2xl font-bold text-foreground">Gestion des articles</h2>
                <Dialog open={showPostForm} onOpenChange={setShowPostForm}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter un article
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Nouvel article</DialogTitle>
                    </DialogHeader>
                    <PostForm
                      onSuccess={() => {
                        setShowPostForm(false)
                        fetchData()
                      }}
                      onCancel={() => setShowPostForm(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-6">
                {posts.map((post) => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="w-full sm:w-20 h-48 sm:h-20 relative">
                          <Image
                            src={post.image || "/placeholder.svg?height=80&width=80"}
                            alt={post.title}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2 text-foreground">{post.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
                          <div className="flex flex-wrap items-center gap-3">
                            <Badge variant={post.published ? "default" : "secondary"}>
                              {post.published ? "Publié" : "Brouillon"}
                            </Badge>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Eye className="w-4 h-4 mr-1" />
                              {post.views}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(post.createdAt).toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                        </div>
                        <div className="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2">
                          <Button variant="outline" size="sm" className="flex-1 sm:flex-none bg-transparent">
                            <Eye className="w-4 h-4 mr-2" />
                            Voir
                          </Button>
                          <Dialog
                            open={editingPost?.id === post.id}
                            onOpenChange={(open) => !open && setEditingPost(null)}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 sm:flex-none bg-transparent"
                                onClick={() => setEditingPost(post)}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Modifier
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Modifier l'article</DialogTitle>
                              </DialogHeader>
                              {editingPost && (
                                <PostEditForm
                                  post={editingPost}
                                  onSuccess={() => {
                                    setEditingPost(null)
                                    fetchData()
                                  }}
                                  onCancel={() => setEditingPost(null)}
                                />
                              )}
                            </DialogContent>
                          </Dialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 sm:flex-none text-red-600 hover:text-red-700 bg-transparent"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Supprimer
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer l'article</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeletePost(post.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <h2 className="text-2xl font-bold text-foreground">Gestion des commandes</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtrer
                  </Button>
                </div>
              </div>

              <div className="grid gap-6">
                {orders.map((order) => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 mb-4">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(order.status)}
                          <div>
                            <h3 className="font-semibold text-lg text-foreground">Commande #{order.id.slice(-8)}</h3>
                            <p className="text-sm text-muted-foreground">{order.customerName}</p>
                          </div>
                          <Badge variant={getStatusVariant(order.status)}>{getStatusText(order.status)}</Badge>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-xl font-bold text-foreground">{formatPrice(order.total)}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/orders/${order.id}`}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Voir détails
                                </Link>
                              </DropdownMenuItem>
                              {order.status === "PENDING" && (
                                <>
                                  <DropdownMenuItem onClick={() => handleConfirmOrder(order.id)}>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Confirmer
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleRejectOrder(order.id)}>
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Rejeter
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Informations client */}
                      <div className="bg-muted/50 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-sm text-foreground mb-2">Informations client</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="text-foreground">{order.customerName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span className="text-foreground">{order.customerEmail}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span className="text-foreground">{order.customerPhone}</span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <span className="line-clamp-2 text-foreground">{order.customerAddress}</span>
                          </div>
                        </div>
                      </div>

                      {/* Articles commandés */}
                      <div className="border border-border rounded-lg overflow-hidden">
                        <div className="bg-muted/50 px-4 py-2 border-b border-border">
                          <h4 className="font-medium text-sm text-foreground">
                            Articles ({order.items.reduce((sum, item) => sum + item.quantity, 0)})
                          </h4>
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

                      {order.status === "PENDING" && (
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
                          <Button onClick={() => handleConfirmOrder(order.id)} size="sm" className="flex-1">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Confirmer la commande
                          </Button>
                          <Button
                            onClick={() => handleRejectOrder(order.id)}
                            variant="destructive"
                            size="sm"
                            className="flex-1"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Rejeter la commande
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <h2 className="text-2xl font-bold text-foreground">Gestion des utilisateurs</h2>
                <Dialog open={showUserForm} onOpenChange={setShowUserForm}>
                  <DialogTrigger asChild>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter un utilisateur
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Nouvel utilisateur</DialogTitle>
                    </DialogHeader>
                    <UserForm
                      onSuccess={() => {
                        setShowUserForm(false)
                        fetchData()
                      }}
                      onCancel={() => setShowUserForm(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-6">
                {users.map((user) => (
                  <Card key={user.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="w-full sm:w-16 h-16 sm:h-16 relative">
                          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                            <Users className="w-8 h-8 text-muted-foreground" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2 text-foreground">{user.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{user.email}</p>
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center space-x-1">
                              {getRoleIcon(user.role)}
                              <Badge variant={getRoleVariant(user.role)}>{getRoleText(user.role)}</Badge>
                            </div>
                            <span className="text-sm text-muted-foreground">{user._count.posts} articles</span>
                            <span className="text-sm text-muted-foreground">{user._count.orders} commandes</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                        </div>
                        <div className="flex sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2">
                          <Dialog
                            open={editingUser?.id === user.id}
                            onOpenChange={(open) => !open && setEditingUser(null)}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 sm:flex-none bg-transparent"
                                onClick={() => setEditingUser(user)}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Modifier
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Modifier l'utilisateur</DialogTitle>
                              </DialogHeader>
                              {editingUser && (
                                <UserForm
                                  user={editingUser}
                                  onSuccess={() => {
                                    setEditingUser(null)
                                    fetchData()
                                  }}
                                  onCancel={() => setEditingUser(null)}
                                />
                              )}
                            </DialogContent>
                          </Dialog>
                          {user.id !== session?.user?.id && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 sm:flex-none text-red-600 hover:text-red-700 bg-transparent"
                                >
                                  <UserX className="w-4 h-4 mr-2" />
                                  Supprimer
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Supprimer l'utilisateur</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible
                                    et supprimera également tous ses articles et commandes.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

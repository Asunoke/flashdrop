"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Calendar, User, Eye, Clock, BookOpen, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Footer } from "@/components/footer"
import { ThemeToggle } from "@/components/theme-toggle"

interface Post {
  id: string
  title: string
  content: string
  excerpt: string
  image: string
  published: boolean
  views: number
  createdAt: string
  author: {
    name: string
    email: string
  }
  category?: string
}

export default function BlogPage() {
  const { toast } = useToast()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts")
      if (response.ok) {
        const data = await response.json()
        setPosts(data.filter((post: Post) => post.published))
      }
    } catch (error) {
      console.error("Erreur lors du chargement des articles:", error)
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des articles",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.split(" ").length
    return Math.ceil(words / wordsPerMinute)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const categories = ["all", ...Array.from(new Set(posts.map((p) => p.category || "Général")))]

  const filteredPosts = posts
    .filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || (post.category || "Général") === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "views":
          return b.views - a.views
        case "title":
          return a.title.localeCompare(b.title)
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  const featuredPost = filteredPosts[0]
  const otherPosts = filteredPosts.slice(1)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Chargement des articles...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <BookOpen className="w-16 h-16 text-purple-200" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog </h1>
          <p className="text-xl mb-8 text-purple-100 max-w-2xl mx-auto">
            Découvrez nos derniers articles 
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              Lire nos articles
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-purple-600 bg-transparent"
            >
              S'abonner à la newsletter
            </Button>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-card shadow-sm border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Rechercher un article..."
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
                  <SelectItem value="oldest">Plus anciens</SelectItem>
                  <SelectItem value="views">Plus vus</SelectItem>
                  <SelectItem value="title">Titre A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Aucun article trouvé</h3>
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
            <div className="space-y-12">
              {/* Featured Article */}
              {featuredPost && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 text-center text-foreground">Article à la une</h2>
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="grid md:grid-cols-2 gap-0">
                      <div className="relative aspect-video md:aspect-square">
                        <Image
                          src={featuredPost.image || "/placeholder.svg?height=400&width=600"}
                          alt={featuredPost.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-purple-600 hover:bg-purple-700">À la une</Badge>
                        </div>
                      </div>
                      <CardContent className="p-8 flex flex-col justify-center">
                        <div className="mb-4">
                          <Badge variant="outline" className="mb-2">
                            {featuredPost.category || "Général"}
                          </Badge>
                        </div>
                        <h3 className="text-2xl font-bold mb-4 hover:text-purple-600 transition-colors text-foreground">
                          <Link href={`/blog/${featuredPost.id}`}>{featuredPost.title}</Link>
                        </h3>
                        <p className="text-muted-foreground mb-6 line-clamp-3">{featuredPost.excerpt}</p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              {featuredPost.author.name}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(featuredPost.createdAt)}
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {featuredPost.views}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {estimateReadingTime(featuredPost.content)} min
                            </div>
                          </div>
                        </div>
                        <Button asChild className="w-fit bg-purple-600 hover:bg-purple-700">
                          <Link href={`/blog/${featuredPost.id}`}>
                            Lire l'article
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </CardContent>
                    </div>
                  </Card>
                </div>
              )}

              {/* Other Articles */}
              {otherPosts.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-foreground">Autres articles</h2>
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {otherPosts.map((post) => (
                      <Card key={post.id} className="group hover:shadow-lg transition-shadow duration-300">
                        <div className="relative aspect-video overflow-hidden rounded-t-lg">
                          <Image
                            src={post.image || "/placeholder.svg?height=200&width=400"}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3">
                            <Badge variant="secondary" className="bg-background/90 text-foreground">
                              {post.category || "Général"}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors text-foreground">
                            <Link href={`/blog/${post.id}`}>{post.title}</Link>
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center">
                                <User className="w-3 h-3 mr-1" />
                                {post.author.name}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {formatDate(post.createdAt)}
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center">
                                <Eye className="w-3 h-3 mr-1" />
                                {post.views}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {estimateReadingTime(post.content)} min
                              </div>
                            </div>
                          </div>
                          <Button asChild variant="outline" className="w-full bg-transparent">
                            <Link href={`/blog/${post.id}`}>Lire la suite</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

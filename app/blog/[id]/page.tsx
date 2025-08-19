"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, Eye, User, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

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
}

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchPost(params.id as string)
    }
  }, [params.id])

  const fetchPost = async (id: string) => {
    try {
      const response = await fetch(`/api/posts/${id}`)
      if (response.ok) {
        const data = await response.json()
        if (data.published) {
          setPost(data)
          // Increment view count
          await fetch(`/api/posts/${id}/view`, { method: "POST" })
        } else {
          toast({
            title: "Erreur",
            description: "Article non publié",
            variant: "destructive",
          })
          router.push("/blog")
        }
      } else {
        toast({
          title: "Erreur",
          description: "Article non trouvé",
          variant: "destructive",
        })
        router.push("/blog")
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'article:", error)
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement de l'article",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Erreur lors du partage:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Lien copié",
        description: "Le lien de l'article a été copié dans le presse-papiers",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Chargement de l'article...</h2>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Article non trouvé</h2>
          <Button asChild>
            <Link href="/blog">Retour au blog</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/blog">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground line-clamp-1">{post.title}</h1>
                <p className="text-sm text-muted-foreground">Article de blog</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Partager
            </Button>
          </div>
        </div>
      </header>

      {/* Article */}
      <article className="py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Hero Image */}
          <div className="aspect-video relative overflow-hidden rounded-lg mb-8">
            <Image
              src={post.image || "/placeholder.svg?height=400&width=800"}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Article Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-muted-foreground">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  <span>{post.author.name}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>
                    {new Date(post.createdAt).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  <span>{post.views} vues</span>
                </div>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <Card>
            <CardContent className="p-8">
              <div
                className="prose prose-lg max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </CardContent>
          </Card>

          {/* Back to Blog */}
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour au blog
              </Link>
            </Button>
          </div>
        </div>
      </article>
    </div>
  )
}

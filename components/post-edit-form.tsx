"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
  user: {
    name: string
    email: string
  }
}

interface PostEditFormProps {
  post: Post
  onSuccess: () => void
  onCancel: () => void
}

export function PostEditForm({ post, onSuccess, onCancel }: PostEditFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    image: post.image,
    published: post.published,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Article modifié avec succès",
        })
        onSuccess()
      } else {
        const error = await response.json()
        throw new Error(error.error || "Erreur lors de la modification")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Titre de l'article</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="Titre de votre article"
          />
        </div>

        <div>
          <Label htmlFor="excerpt">Résumé</Label>
          <Textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            required
            rows={3}
            placeholder="Résumé de votre article"
          />
        </div>

        <div>
          <Label htmlFor="image">Image de couverture (URL)</Label>
          <Input
            id="image"
            type="url"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://exemple.com/image.jpg"
          />
        </div>

        <div>
          <Label htmlFor="content">Contenu de l'article</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
            rows={12}
            placeholder="Rédigez le contenu de votre article ici..."
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="published"
            checked={formData.published}
            onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
          />
          <Label htmlFor="published">Publier l'article</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Annuler
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Modification..." : "Modifier l'article"}
        </Button>
      </div>
    </form>
  )
}

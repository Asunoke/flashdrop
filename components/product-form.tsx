"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { X, Plus } from "lucide-react"

interface ProductFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function ProductForm({ onSuccess, onCancel }: ProductFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [features, setFeatures] = useState<string[]>([])
  const [newImage, setNewImage] = useState("")
  const [newFeature, setNewFeature] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    longDescription: "",
    price: "",
    originalPrice: "",
    category: "",
    stockQuantity: "",
    warranty: "",
    delivery: "",
    installation: false,
    isNew: false,
    isPromo: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: Number.parseFloat(formData.price),
          originalPrice: formData.originalPrice ? Number.parseFloat(formData.originalPrice) : undefined,
          stockQuantity: Number.parseInt(formData.stockQuantity),
          images,
          features,
        }),
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Produit créé avec succès",
        })
        onSuccess?.()
        router.refresh()
      } else {
        const error = await response.json()
        throw new Error(error.error || "Erreur lors de la création")
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la création du produit",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addImage = () => {
    if (newImage.trim() && !images.includes(newImage.trim())) {
      setImages([...images, newImage.trim()])
      setNewImage("")
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()])
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Ajouter un nouveau produit</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du produit *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description courte *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="longDescription">Description détaillée</Label>
            <Textarea
              id="longDescription"
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Prix (FCFA) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Prix original (FCFA)</Label>
              <Input
                id="originalPrice"
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stockQuantity">Stock *</Label>
              <Input
                id="stockQuantity"
                type="number"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="warranty">Garantie</Label>
              <Input
                id="warranty"
                value={formData.warranty}
                onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                placeholder="Ex: 2 ans"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="delivery">Livraison</Label>
              <Input
                id="delivery"
                value={formData.delivery}
                onChange={(e) => setFormData({ ...formData, delivery: e.target.value })}
                placeholder="Ex: 24-48h"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Images *</Label>
            <div className="flex gap-2">
              <Input
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder="URL de l'image"
                className="flex-1"
              />
              <Button type="button" onClick={addImage}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {images.map((image, index) => (
                <div key={index} className="flex items-center gap-2 bg-muted p-2 rounded">
                  <span className="text-sm truncate max-w-[200px]">{image}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeImage(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label>Caractéristiques</Label>
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Nouvelle caractéristique"
                className="flex-1"
              />
              <Button type="button" onClick={addFeature}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 bg-muted p-2 rounded">
                  <span className="text-sm">{feature}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeFeature(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isNew}
                onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
              />
              <span>Nouveau produit</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isPromo}
                onChange={(e) => setFormData({ ...formData, isPromo: e.target.checked })}
              />
              <span>En promotion</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.installation}
                onChange={(e) => setFormData({ ...formData, installation: e.target.checked })}
              />
              <span>Installation incluse</span>
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading || images.length === 0}>
              {loading ? "Création..." : "Créer le produit"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

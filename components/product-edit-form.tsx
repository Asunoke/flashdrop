"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

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

interface ProductEditFormProps {
  product: Product
  onSuccess: () => void
  onCancel: () => void
}

export function ProductEditForm({ product, onSuccess, onCancel }: ProductEditFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    longDescription: product.longDescription || "",
    price: product.price,
    originalPrice: product.originalPrice || 0,
    category: product.category,
    stockQuantity: product.stockQuantity,
    images: product.images.join("\n"),
    features: product.features.join("\n"),
    warranty: product.warranty || "",
    delivery: product.delivery || "",
    installation: product.installation,
    isNew: product.isNew,
    isPromo: product.isPromo,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dataToSend = {
        ...formData,
        images: formData.images.split("\n").filter((img) => img.trim()),
        features: formData.features.split("\n").filter((feature) => feature.trim()),
        originalPrice: formData.originalPrice > 0 ? formData.originalPrice : undefined,
      }

      const response = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: "Produit modifié avec succès",
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nom du produit</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Catégorie</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Prix (XOF)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="originalPrice">Prix original (XOF)</Label>
              <Input
                id="originalPrice"
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                min="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="stockQuantity">Stock</Label>
            <Input
              id="stockQuantity"
              type="number"
              value={formData.stockQuantity}
              onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
              required
              min="0"
            />
          </div>

          <div>
            <Label htmlFor="warranty">Garantie</Label>
            <Input
              id="warranty"
              value={formData.warranty}
              onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
              placeholder="Ex: 1 an"
            />
          </div>

          <div>
            <Label htmlFor="delivery">Livraison</Label>
            <Input
              id="delivery"
              value={formData.delivery}
              onChange={(e) => setFormData({ ...formData, delivery: e.target.value })}
              placeholder="Ex: 2-3 jours ouvrés"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="description">Description courte</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="longDescription">Description détaillée</Label>
            <Textarea
              id="longDescription"
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="images">Images (une URL par ligne)</Label>
            <Textarea
              id="images"
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              rows={4}
              placeholder="https://exemple.com/image1.jpg"
            />
          </div>

          <div>
            <Label htmlFor="features">Caractéristiques (une par ligne)</Label>
            <Textarea
              id="features"
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              rows={4}
              placeholder="Processeur Intel Core i7"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="installation"
                checked={formData.installation}
                onCheckedChange={(checked) => setFormData({ ...formData, installation: checked })}
              />
              <Label htmlFor="installation">Installation incluse</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isNew"
                checked={formData.isNew}
                onCheckedChange={(checked) => setFormData({ ...formData, isNew: checked })}
              />
              <Label htmlFor="isNew">Nouveau produit</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isPromo"
                checked={formData.isPromo}
                onCheckedChange={(checked) => setFormData({ ...formData, isPromo: checked })}
              />
              <Label htmlFor="isPromo">En promotion</Label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Annuler
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Modification..." : "Modifier le produit"}
        </Button>
      </div>
    </form>
  )
}

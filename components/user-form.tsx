"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

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

interface UserFormProps {
  user?: User
  onSuccess: () => void
  onCancel: () => void
}

export function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    role: user?.role || "USER",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = user ? `/api/users/${user.id}` : "/api/users"
      const method = user ? "PUT" : "POST"

      // Ne pas envoyer le mot de passe s'il est vide lors de la modification
      const dataToSend = { ...formData }
      if (user && !formData.password) {
        delete dataToSend.password
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })

      if (response.ok) {
        toast({
          title: "Succès",
          description: user ? "Utilisateur modifié avec succès" : "Utilisateur créé avec succès",
        })
        onSuccess()
      } else {
        const error = await response.json()
        throw new Error(error.error || "Erreur lors de l'opération")
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
          <Label htmlFor="name">Nom complet</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="Nom complet de l'utilisateur"
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            placeholder="email@exemple.com"
          />
        </div>

        <div>
          <Label htmlFor="password">Mot de passe {user && "(laisser vide pour ne pas modifier)"}</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required={!user}
            placeholder={user ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}
            minLength={6}
          />
        </div>

        <div>
          <Label htmlFor="role">Rôle</Label>
          <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USER">Utilisateur</SelectItem>
              <SelectItem value="MANAGER">Manager</SelectItem>
              <SelectItem value="ADMIN">Administrateur</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Annuler
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "En cours..." : user ? "Modifier" : "Créer"}
        </Button>
      </div>
    </form>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/auth/signin?message=Compte créé avec succès")
      } else {
        setError(data.error || "Une erreur est survenue")
      }
    } catch (error) {
      setError("Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4B0082]/5 to-white dark:from-[#4B0082]/20 dark:to-[#4B0082]/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#4B0082] rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">FDM</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Inscription</h1>
          <p className="text-gray-600">Créez votre compte professionnel Flashdrop Market</p>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-gray-900">Créer un compte pro</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Remplissez les informations pour accéder aux deals exclusifs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-800">Nom complet</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-[#4B0082]" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Votre nom complet"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 border-gray-300 focus-visible:ring-[#4B0082]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-800">Email professionnel</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-[#4B0082]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@votresociete.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-gray-300 focus-visible:ring-[#4B0082]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-800">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-[#4B0082]" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 border-gray-300 focus-visible:ring-[#4B0082]"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-[#4B0082]" />
                    ) : (
                      <Eye className="h-4 w-4 text-[#4B0082]" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-800">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-[#4B0082]" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 border-gray-300 focus-visible:ring-[#4B0082]"
                    required
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-[#FF8C00] hover:bg-[#E67E00] group" 
                disabled={isLoading}
              >
                {isLoading ? "Création en cours..." : (
                  <>
                    Créer mon compte pro
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                Déjà un compte ?{" "}
                <Link 
                  href="/auth/signin" 
                  className="text-[#4B0082] font-medium hover:underline hover:text-[#4B0082]/80"
                >
                  Se connecter
                </Link>
              </p>
              <p className="mt-2 text-xs text-gray-500">
                En créant un compte, vous acceptez nos{" "}
                <Link href="/terms" className="text-[#4B0082] hover:underline">
                  Conditions d'utilisation
                </Link>{" "}
                et notre{" "}
                <Link href="/privacy" className="text-[#4B0082] hover:underline">
                  Politique de confidentialité
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
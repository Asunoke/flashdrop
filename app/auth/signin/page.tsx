"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Email ou mot de passe incorrect")
      } else {
        const session = await getSession()
        if (session?.user?.role === "ADMIN") {
          router.push("/admin/dashboard")
        } else if (session?.user?.role === "MANAGER") {
          router.push("/manager/dashboard")
        } else {
          router.push("/user/dashboard")
        }
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
          <h1 className="text-2xl font-bold text-gray-900">Connexion</h1>
          <p className="text-gray-600">Accédez à votre compte Flashdrop Market</p>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-gray-900">Se connecter</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Entrez vos identifiants pour accéder à votre espace pro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-800">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-[#4B0082]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
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
                {isLoading ? "Connexion..." : (
                  <>
                    Se connecter
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                Pas encore de compte ?{" "}
                <Link 
                  href="/auth/signup" 
                  className="text-[#4B0082] font-medium hover:underline hover:text-[#4B0082]/80"
                >
                  Créer un compte pro
                </Link>
              </p>
              <p className="mt-2 text-gray-600">
                <Link 
                  href="/auth/forgot-password" 
                  className="text-[#4B0082] font-medium hover:underline hover:text-[#4B0082]/80"
                >
                  Mot de passe oublié ?
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
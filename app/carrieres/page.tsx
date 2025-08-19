"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, MapPin, Clock, Users, Award, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const jobOffers = [
  {
    id: 1,
    title: "Ingénieur Informatique Senior",
    department: "Informatique",
    location: "Bamako",
    type: "CDI",
    experience: "5+ ans",
    description: "Nous recherchons un ingénieur informatique expérimenté pour rejoindre notre équipe technique.",
    requirements: [
      "Master en informatique ou équivalent",
      "5+ années d'expérience en développement",
      "Maîtrise des technologies web modernes",
      "Expérience en gestion de projet",
    ],
  },
  {
    id: 2,
    title: "Technicien Électricien",
    department: "Électricité",
    location: "Bamako",
    type: "CDI",
    experience: "2+ ans",
    description: "Poste de technicien électricien pour installations résidentielles et commerciales.",
    requirements: [
      "CAP/BEP en électricité",
      "2+ années d'expérience",
      "Permis de conduire",
      "Disponibilité pour déplacements",
    ],
  },
  {
    id: 3,
    title: "Chef de Projet BTP",
    department: "Construction",
    location: "Bamako/Régions",
    type: "CDI",
    experience: "7+ ans",
    description: "Management de projets de construction et coordination des équipes sur chantier.",
    requirements: [
      "Ingénieur BTP ou équivalent",
      "7+ années d'expérience en gestion de projet",
      "Leadership et management d'équipe",
      "Mobilité géographique",
    ],
  },
]

export default function CarrieresPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Carrières</h1>
              <p className="text-sm text-muted-foreground">Rejoignez l'équipe Evotech Mali</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-6">Construisez votre avenir avec Evotech Mali</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Rejoignez une équipe dynamique et participez à l'innovation technologique au Mali. Nous offrons un
                environnement de travail stimulant et des opportunités de croissance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Voir nos offres
                </Button>
                <Button size="lg" variant="outline">
                  Candidature spontanée
                </Button>
              </div>
            </div>
            <div>
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
                alt="Équipe de travail collaborative"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Pourquoi rejoindre Evotech Mali ?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Découvrez les avantages de travailler dans une entreprise innovante et en pleine croissance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Équipe Dynamique</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Travaillez avec des professionnels passionnés dans un environnement collaboratif
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Formation Continue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Développez vos compétences avec nos programmes de formation et certifications
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Projets Variés</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Participez à des projets diversifiés à travers tout le Mali
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Équilibre Vie Pro</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Horaires flexibles et respect de l'équilibre vie professionnelle/personnelle
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Job Offers */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Offres d'emploi</h2>
            <p className="text-xl text-muted-foreground">Découvrez nos postes ouverts et rejoignez notre équipe</p>
          </div>

          <div className="space-y-6">
            {jobOffers.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge variant="secondary">{job.department}</Badge>
                        <Badge variant="outline">{job.type}</Badge>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{job.title}</h3>
                      <p className="text-muted-foreground mb-4">{job.description}</p>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {job.experience}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-foreground mb-2">Exigences :</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {job.requirements.map((req, index) => (
                            <li key={index} className="flex items-start">
                              <span className="w-1 h-1 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 lg:mt-0 lg:ml-6">
                      <Button className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700" asChild>
                        <a href={`mailto:rh@evotechmali.com?subject=Candidature - ${job.title}`}>
                          <Send className="w-4 h-4 mr-2" />
                          Postuler
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Candidature spontanée</CardTitle>
                <CardDescription>
                  Vous ne trouvez pas le poste qui vous correspond ? Envoyez-nous votre candidature spontanée.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                  <a href="mailto:rh@evotechmali.com?subject=Candidature spontanée">
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer ma candidature
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact RH */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Une question sur nos offres ?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Notre équipe RH est là pour vous accompagner dans votre candidature
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" asChild>
                <a href="tel:+223764827002">Appeler le +223 76 48 27 02</a>
              </Button>
              <Button size="lg" asChild>
                <a href="mailto:rh@evotechmali.com">Contacter les RH</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

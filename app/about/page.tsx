import Head from 'next/head';
import Image from 'next/image';
import { Footer } from "@/components/footer";


export default function AboutPage() {
  return (
    <>
      <Head>
        <title>À propos - FlashDrop Market</title>
        <meta name="description" content="Découvrez FlashDrop Market, la plateforme malienne de vente flash créée par Tenoble Software pour faciliter le commerce au Mali" />
      </Head>

      

      <main className="container mx-auto px-4 py-12">

        {/* Hero / Notre Histoire */}
        <section className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-orange-600 mb-6">Notre Histoire</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 mb-8">
              FlashDrop Market est la plateforme de vente flash du Mali, créée par <span className="font-semibold text-red-500">Tenoble Software</span> et détenue par <span className="font-semibold text-red-500">Tenoble Group Holdings</span>. 
              Notre mission : connecter les commerçants locaux aux clients grâce à un écosystème digital simple, rapide et économique. 
              <span className="font-semibold text-orange-500">🚀 Pourquoi FlashDrop ?</span> Chaque offre est une opportunité éclair ! Des promotions exclusives pendant un temps limité pour profiter au maximum de votre budget.
            </p>
            <div className="relative h-64 md:h-96 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/pcc.webp"
                alt="Équipe FlashDrop Market"
                layout="fill"
                objectFit="cover"
                quality={100}
              />
            </div>
          </div>
        </section>

        {/* Vision */}
        <section className="mb-16 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold text-red-500 mb-6">Notre Vision</h3>
            <p className="text-gray-700 mb-4">
              Nous croyons en un Mali où le commerce numérique est accessible à tous, simple et sécurisé.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start"><span className="text-orange-500 mr-2">✓</span> Faciliter les transactions commerciales</li>
              <li className="flex items-start"><span className="text-orange-500 mr-2">✓</span> Promouvoir les produits maliens</li>
              <li className="flex items-start"><span className="text-orange-500 mr-2">✓</span> Créer des opportunités économiques</li>
            </ul>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/vision.webp"
              alt="Vision FlashDrop Market"
              width={600}
              height={400}
              layout="responsive"
            />
          </div>
        </section>

        {/* Chiffres clés */}
        <section className="mb-16 bg-orange-50 rounded-xl p-8 md:p-12">
          <h3 className="text-3xl font-bold text-red-500 mb-8 text-center">Nos Chiffres Clés</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-orange-500 mb-2">4+</div>
              <div className="text-gray-700">Vendeurs actifs</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-orange-500 mb-2">25k+ FCFA</div>
              <div className="text-gray-700">Transactions</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-orange-500 mb-2">24h</div>
              <div className="text-gray-700">Support continu</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-orange-500 mb-2">1+</div>
              <div className="text-gray-700">Villes couvertes</div>
            </div>
          </div>
        </section>

        {/* Équipe */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-red-500 mb-8 text-center">L'Équipe Derrière FlashDrop</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                img: "/tenoble softwares.webp",
                name: "Tenoble Software",
                role: "Créateur de la plateforme",
                desc: "L'innovation technologique au service du commerce malien"
              },
              {
                img: "/logo_tgh.png",
                name: "Tenoble Group Holdings",
                role: "Groupe détenteur",
                desc: "Investissant dans l'avenir numérique du Mali"
              },
              {
                img: "/cm.webp",
                name: "Notre Communauté",
                role: "Vendeurs & Acheteurs",
                desc: "Le cœur battant de FlashDrop Market"
              }
            ].map((member) => (
              <div key={member.name} className="bg-white p-6 rounded-xl shadow-md text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image src={member.img} alt={member.name} width={128} height={128} />
                </div>
                <h4 className="text-xl font-semibold mb-1">{member.name}</h4>
                <p className="text-orange-500 mb-3">{member.role}</p>
                <p className="text-gray-700">{member.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call-to-action */}
        <section className="bg-red-500 text-white rounded-xl p-8 md:p-12 text-center">
          <h3 className="text-3xl font-bold mb-6">Prêt à rejoindre l'aventure ?</h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Que vous soyez vendeur ou acheteur, FlashDrop Market est la plateforme qu'il vous faut pour le commerce au Mali.
          </p>
          <div className="space-x-4">
            <a 
              href="/register" 
              className="inline-block px-6 py-3 bg-white text-red-500 font-medium rounded-md hover:bg-gray-200 transition-colors"
            >
              S'inscrire maintenant
            </a>
            <a 
              href="/contact" 
              className="inline-block px-6 py-3 border-2 border-white text-white font-medium rounded-md hover:bg-white hover:text-red-500 transition-colors"
            >
              Nous contacter
            </a>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

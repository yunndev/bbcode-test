import { useRouter } from 'next/router'
import { Card } from 'components'

import {
  FingerPrintIcon,
  ExclamationCircleIcon,
  ArchiveIcon,
} from '@heroicons/react/outline'

// Homepage
const Home = () => {
  const router = useRouter()
  return (
    <main>
      <h1 className="text-2xl font-bold text-gray-800 lg:text-3xl dark:text-white">
        Bienvenue!
      </h1>
      <p className="mt-2 text-sm font-medium prose text-left text-gray-400">
        Bienvenue sur le générateur de BBCode, l'outil de choix des officiers du
        Blount County Metropolitan Police Department pour remplir leurs rapports
        d'arrestation, d'intervention et bien plus!{' '}
      </p>
      <div className="grid grid-rows-4 gap-4 pb-16 mt-8 lg:grid-cols-2 lg:grid-rows-2 lg:max-w-3xl">
        {[
          {
            title: "Rapport d'arrestation",
            description:
              "Procédure post-arrestation et remplissage automatique du booking process. Insèrez les détails de votre suspect et recevez un résultat exact en BBCode à déposer sur l'intranet.",
            icon: FingerPrintIcon,
            onClick: () => router.push('/arrestation'),
          },
          {
            title: "Rapport d'intervention",
            description:
              "Remplissez votre fiche d'intervention automatiquement et avec vos détails pré-remplis, vous n'aurez qu'à déposer votre rapport sur l'intranet par la suite.",
            icon: ExclamationCircleIcon,
            onClick: () =>
              router.push(
                'https://bbcode-v1.josefleventon.dev/bbcode/intervention'
              ),
          },
          {
            title: "Rapport d'utilisation de la force létale",
            description:
              "Déclarez facilement une utilisation de la force létale au Force Investigation Bureau en remplissant un rapport d'usage de la force létale, que vous n'aurez qu'à faire parvenir au FIB.",
            icon: ArchiveIcon,
            onClick: () =>
              router.push(
                'https://bbcode-v1.josefleventon.dev/bbcode/force-letale'
              ),
          },
        ].map((route) => (
          <Card {...route} key={route.title}></Card>
        ))}
      </div>
    </main>
  )
}

export default Home

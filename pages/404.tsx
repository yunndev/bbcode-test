import Link from 'next/link'

// 404 Error Page
const ErrorPage = () => (
  <main className="flex flex-col items-center justify-center w-full h-screen pb-16 space-x-2 overflow-hidden">
    <h1 className="font-serif font-extrabold text-primary [font-size:200px]">
      404
    </h1>
    <p className="font-medium text-gray-400">
      Il semblerait que cette page n'existe pas...
    </p>
    <Link href="/">
      <a className="font-medium mt-1text-sm text-primary hover:text-primary/80">
        Retourner à la page d'accueil
      </a>
    </Link>
  </main>
)

export default ErrorPage

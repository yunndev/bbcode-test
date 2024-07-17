// import App from "next/app";
import type { AppProps /*, AppContext */ } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useMemo, useEffect } from 'react'
import { Error, Theme } from 'utils'

import { Nav, Modal } from 'components'
import { Dialog } from '@headlessui/react'
import {
  HomeIcon,
  FingerPrintIcon,
  ExclamationCircleIcon,
  ArchiveIcon,
  CheckIcon,
  ExclamationIcon,
  XIcon,
} from '@heroicons/react/outline'

import '../styles/globals.css'
import { classNames } from 'lib'

// Disable SSR hydration
function SafeHydrate({ children }) {
  return (
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ? null : children}
    </div>
  )
}

const App = ({ Component, pageProps }: AppProps) => {
  // Theme provider
  const [theme, setTheme] = useState<'light' | 'dark'>()

  // Theme handler
  useEffect(() => {
    if (
      !('theme' in sessionStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }, [])

  // Error handler modal state
  const [showError, setShowError] = useState<boolean>(false)
  const [errorData, setErrorData] = useState<{
    type: 'success' | 'warn' | 'error'
    title: string
    description: string
  } | null>(null)

  // Error utility
  function throwError(
    type: 'success' | 'warn' | 'error',
    title: string,
    description?: string
  ) {
    setErrorData({ type, title, description })
    setShowError(true)
  }

  // Initialize router
  const router = useRouter()

  return (
    <SafeHydrate>
      <main
        id="root"
        className={classNames(
          theme === 'dark' ? 'dark' : '',
          'w-screen min-h-screen'
        )}
      >
        <Theme.Provider value={[theme, setTheme]}>
          <div className="min-h-screen bg-slate-100 dark:bg-slate-800">
            <Error.Provider value={useMemo(() => throwError, [])}>
              {/* Metadata */}
              <Head>
                <title>Générateur de BBCode</title>
                <link rel="shortcut icon" href="/favicon.ico" />
                <meta
                  name="viewport"
                  content="initial-scale=1.0, width=device-width"
                />
                <meta
                  name="description"
                  content="Générateur automatique de BBCode pour l'usage des agents du Blount County Metropolitan Police Department."
                />
                <meta property="og:title" content="Générateur de BBCode" />
                <meta
                  property="og:description"
                  content="Générateur automatique de BBCode pour l'usage des agents du Blount County Metropolitan Police Department."
                />
                <meta
                  property="og:image"
                  content="https://2img.net/i.ibb.co/zZ82Z1q/Badge-of-the-Las-Vegas-Metropolitan-Police-Department.png"
                />
                <meta
                  property="og:url"
                  content="http://bbcode.josefleventon.dev"
                />
                <meta property="og:locale" content="fr_FR" />
                <meta property="og:type" content="website" />
              </Head>

              {/* Error modal */}
              <Modal
                actions={[
                  {
                    name: 'Continuer',
                    primary: true,
                  },
                ]}
                state={[showError, setShowError]}
                theme={theme}
              >
                {errorData && (
                  <div>
                    <div
                      className={classNames(
                        errorData.type === 'success'
                          ? 'bg-green-100 dark:bg-green-800'
                          : errorData.type === 'warn'
                          ? 'bg-yellow-100 dark:bg-yellow-800'
                          : 'bg-red-100 dark:bg-red-800',
                        'mx-auto flex items-center justify-center h-12 w-12 rounded-full'
                      )}
                    >
                      {errorData.type === 'success' ? (
                        <CheckIcon
                          className="w-6 h-6 text-green-600 dark:text-white"
                          aria-hidden="true"
                        />
                      ) : errorData.type === 'warn' ? (
                        <ExclamationIcon
                          className="w-6 h-6 text-yellow-600 dark:text-white"
                          aria-hidden="true"
                        />
                      ) : (
                        <XIcon
                          className="w-6 h-6 text-red-600 dark:text-white"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                      >
                        {errorData.title}
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-400">
                          {errorData.description ?? ''}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Modal>

              {/* Navbar */}
              <Nav
                navigation={[
                  {
                    name: 'Accueil',
                    icon: HomeIcon,
                    href: '/',
                    current: router.asPath === '/',
                  },
                  {
                    name: 'Arrestation',
                    icon: FingerPrintIcon,
                    href: '/arrestation',
                    current: router.asPath === '/arrestation',
                  },
                  {
                    name: 'Intervention',
                    icon: ExclamationCircleIcon,
                    href: 'https://bbcode-v1.josefleventon.dev/bbcode/intervention',
                    current: router.asPath === '/intervention',
                  },
                  {
                    name: 'Force létale',
                    icon: ArchiveIcon,
                    href: 'https://bbcode-v1.josefleventon.dev/bbcode/force-letale',
                    current: router.asPath === '/force-letale',
                  },
                ]}
              />

              {/* Page component */}
              <div className="px-6 py-6 overflow-x-hidden lg:ml-64">
                <Component {...pageProps} />
              </div>
            </Error.Provider>
          </div>
        </Theme.Provider>
      </main>
    </SafeHydrate>
  )
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// App.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }

export default App

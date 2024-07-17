import type { District, Rank } from 'lib'

import Link from 'next/link'
import { useState, useRef, useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'

import { Modal, Toggle } from 'components'
import { districts, ranks, classNames, profile } from 'lib'
import { Error, Theme } from 'utils'

// Navbar
export const Nav = ({
  navigation,
}: {
  navigation: {
    name: string
    icon: (props: React.ComponentProps<'svg'>) => JSX.Element
    href: string
    current: boolean
  }[]
}) => {
  // Show/hide profile modal
  const [showProfile, setShowProfile] = useState<boolean>(false)

  // Theme context
  const [theme] = useContext(Theme)

  // Error context
  const throwError = useContext(Error)

  // Form docref
  const formRef = useRef<HTMLFormElement | null>(null)

  // Initialize router
  const router = useRouter()

  // Form handler
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  // Form submit
  const onSubmit = ({
    name,
    rank,
    district,
  }: {
    name: string
    rank: Rank | 'none'
    district: District | 'none'
  }) => {
    if (name === '' || rank === 'none' || district === 'none')
      return throwError(
        'error',
        'Informations manquantes',
        'Il semblerait que certaines informations manquent à votre profil. Veuillez réessayer de modifier votre profil pour appliquer les modifications.'
      )
    profile.set([name, rank, district])
    formRef.current.reset()
    router.reload()
  }

  return (
    <main>
      {/* Profile modal */}
      <Modal
        actions={[
          {
            name: 'Sauvegarder',
            onClick: () => {
              // Create a submit event
              const event = new Event('submit', {
                bubbles: true,
                cancelable: true,
              })

              // Dispatch the event to the form
              formRef.current.dispatchEvent(event)
            },
            primary: true,
          },
          {
            name: 'Supprimer',
            onClick: () => {
              // Remove the profile
              localStorage.removeItem('bbcode-profile')

              // Reset the form
              formRef.current.reset()

              // Reload the page
              router.reload()
            },
            warning: true,
          },
          {
            name: 'Annuler',
            cancel: true,
          },
        ]}
        state={[showProfile, setShowProfile]}
        theme={theme}
      >
        <form
          ref={formRef}
          className="px-2 py-3"
          action="#"
          onSubmit={handleSubmit(onSubmit)}
        >
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            Modifier votre profil
          </p>
          <p className="mt-1 text-sm font-medium text-gray-400">
            Votre profil sera automatiquement inséré sur chacun de vos rapports,
            alors assurez-vous que les informations présentes ci-dessous sont
            exactes.
          </p>
          <div className="hidden sm:block" aria-hidden="true">
            <div className="py-5">
              <div className="border-t border-gray-300 dark:border-gray-600" />
            </div>
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-400"
            >
              Nom
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="name"
                id="name"
                className="block w-full border-gray-300 rounded-md shadow-sm dark:text-white dark:border-gray-600 dark:bg-gray-800 focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Votre nom"
                defaultValue={profile.get()?.name}
                {...register('name', { required: true })}
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="rank"
              className="block text-sm font-medium text-gray-700 dark:text-gray-400"
            >
              Grade
            </label>
            <div className="mt-1">
              <select
                name="rank"
                id="rank"
                className="block w-full border-gray-300 rounded-md shadow-sm dark:text-white dark:border-gray-600 dark:bg-gray-800 focus:ring-primary focus:border-primary sm:text-sm"
                defaultValue={profile.get()?.rank}
                {...register('rank', { required: true })}
                required
              >
                <option selected disabled value={'none'}>
                  Choisir un grade
                </option>
                {ranks.map((rank) => (
                  <option key={rank} value={rank}>
                    {rank}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="district"
              className="block text-sm font-medium text-gray-700 dark:text-gray-400"
            >
              District
            </label>
            <div className="mt-1">
              <select
                name="district"
                id="district"
                className="block w-full border-gray-300 rounded-md shadow-sm dark:text-white dark:border-gray-600 dark:bg-gray-800 focus:ring-primary focus:border-primary sm:text-sm"
                defaultValue={profile.get()?.district}
                {...register('district', { required: true })}
                required
              >
                <option selected disabled value={'none'}>
                  Choisir un district
                </option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </Modal>

      {/* Desktop navbar */}
      <div className="hidden min-h-0 bg-white border-r border-black/10 dark:border-white/10 dark:bg-gray-900 lg:flex lg:flex-col lg:flex-1 lg:w-64 lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <img
              className="w-auto h-14"
              src="/logo.webp"
              alt="Générateur de BBCode"
            />
          </div>
          <nav
            className="flex-1 px-2 mt-5 space-y-1 bg-white dark:bg-gray-900"
            aria-label="Sidebar"
          >
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <a
                  className={classNames(
                    item.current
                      ? 'text-primary'
                      : 'text-gray-600 dark:text-gray-200',
                    'group flex items-center px-2 py-2 text-sm font-medium transition duration-100 ease-in-out rounded-md hover:text-primary'
                  )}
                >
                  <item.icon
                    className={classNames(
                      item.current
                        ? 'text-primary'
                        : 'text-gray-400 dark:text-gray-100 group-hover:text-primary',
                      'mr-3 flex-shrink-0 h-6 w-6'
                    )}
                    aria-hidden="true"
                  />
                  <span className="flex-1 group-hover:text-primary">
                    {item.name}
                  </span>
                </a>
              </Link>
            ))}
          </nav>
          <div className="ml-4">
            <Toggle />
          </div>
        </div>
        <div className="flex flex-shrink-0 p-4 border-t border-black/10 dark:border-white/10">
          <a
            onClick={() => setShowProfile(true)}
            className="flex-shrink-0 block w-full cursor-pointer group"
          >
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 dark:text-gray-100 dark:group-hover:text-gray-300">
                  {profile.exists() ? profile.get().name : 'Anonyme'}
                </p>
                {profile.exists() ? (
                  <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700 dark:text-gray-300 dark:group-hover:text-gray-400">
                    Voir le profil
                  </p>
                ) : (
                  <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700 dark:text-gray-300 dark:group-hover:text-gray-400">
                    Créer un profil
                  </p>
                )}
              </div>
            </div>
          </a>
        </div>
      </div>
    </main>
  )
}

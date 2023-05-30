import { useState, useRef, useEffect } from 'react'
import {
  districts,
  ranks,
  classNames,
  profile,
  Rank,
  District,
  formatDate,
} from 'lib'
import { useForm } from 'react-hook-form'
import { CheckIcon, XIcon, ExclamationIcon } from '@heroicons/react/solid'
import CopyToClipboard from 'react-copy-to-clipboard'
import { Spinner } from 'components'

const Arrestation = () => {
  // BBCode result
  const [result, setResult] = useState<string | null>()
  const [loading, setLoading] = useState<boolean>(false)
  const [copied, setCopied] = useState<boolean>(false)

  // Result textarea docref
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)

  // On result change, update the textarea
  useEffect(() => {
    if (result) textAreaRef.current.value = result
  }, [result])

  // On copy, countdown to reset status
  useEffect(() => {
    if (copied) setTimeout(() => setCopied(false), 3000)
  }, [copied])

  // Form handler
  const { register, handleSubmit } = useForm()

  // Form submit handler
  const onSubmit = (data: {
    profile_name?: string
    profile_rank?: Rank
    profile_district?: District
    last_name: string
    first_name: string
    sex: 'Homme' | 'Femme'
    nationality: string
    vehicle: string
    gun_license_a: boolean
    gun_license_b: boolean
    gun_license_c: boolean
    gun_license_d: boolean
    gun_license_e: boolean
    phone: string
    birthdate: string
    birthplace: string
    height: number
    weight: number
    address: string
    drivers_license_a: boolean
    drivers_license_b: boolean
    drivers_license_c: boolean
    profession: string
    reason: string
    comment: string
    confidentiality: 'Public' | 'Interne' | 'Confidentiel'
    description: string
  }) => {
    // If already fetching, return
    if (loading) return

    // Activate loading indicator
    setLoading(true)

    // Get all gun licenses
    const gun_licenses = []
    ;['a', 'b', 'c', 'd', 'e'].forEach((license) => {
      if (data[`gun_license_${license}`])
        gun_licenses.push(license.toUpperCase())
    })

    // Get all driver's licenses
    const drivers_licenses = []
    ;['a', 'b', 'c'].forEach((license) => {
      if (data[`drivers_license_${license}`])
        drivers_licenses.push(license.toUpperCase())
    })

    // Get the BBCode from the API
    fetch(`/api/arrestation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        officer: profile.get() ?? {
          name: data.profile_name,
          rank: data.profile_rank,
          district: data.profile_district,
        },
        arrestee: {
          last_name: data.last_name,
          first_name: data.first_name,
          sex: data.sex,
          nationality: data.nationality,
          vehicle: data.vehicle,
          gun_licenses: gun_licenses,
          phone: data.phone,
          birthdate: formatDate(data.birthdate),
          birthplace: data.birthplace,
          height: data.height,
          weight: data.weight,
          address: data.address,
          drivers_licenses: drivers_licenses,
          profession: data.profession,
        },
        arrest: {
          reason: data.reason,
          comment: data.comment,
          confidentiality: data.confidentiality,
          description: data.description,
        },
      }),
    })
      .then((res) => {
        return res.json()
      })
      .then((json) => {
        console.log(json.result)
        setLoading(false)
        setResult(json.result)
      })
  }

  return (
    <main className="lg:max-w-5xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-2xl font-bold text-gray-800 lg:text-3xl dark:text-white">
          Rapport d'arrestation
        </h1>
        <p className="mt-2 text-sm font-medium prose text-left text-gray-400">
          Procédure post-arrestation et remplissage automatique du booking
          process. Insèrez les détails de votre suspect et recevez un résultat
          exact en BBCode à déposer sur l'intranet.
        </p>
        <div className="flex flex-col my-3 space-y-2 text-xs font-bold lg:space-y-0 lg:space-x-4 lg:items-center lg:flex-row">
          <a
            href="https://gtacityrp.fr/index.php?threads/rp-code-pénal-de-létat-du-tennessee.16997/"
            rel="noopener noreferrer"
            target="_blank"
            className="transition duration-100 ease-in-out cursor-pointer text-primary hover:text-primary/80"
          >
            Code pénal
          </a>
          <a
            href="https://gtacityrp.fr/index.php?threads/rp-code-de-la-route-de-létat-du-tennessee.22805/"
            rel="noopener noreferrer"
            target="_blank"
            className="transition duration-100 ease-in-out cursor-pointer text-primary hover:text-primary/80"
          >
            Code de la route
          </a>
          <a
            href="https://gtacityrp.fr/index.php?threads/rp-code-de-procédure-pénale-de-lÉtat-du-tennessee.19476/"
            rel="noopener noreferrer"
            target="_blank"
            className="transition duration-100 ease-in-out cursor-pointer text-primary hover:text-primary/80"
          >
            Procédure pénale
          </a>
          <a
            href="https://discord.gg/DWwhUJ3Rnp"
            rel="noopener noreferrer"
            target="_blank"
            className="transition duration-100 ease-in-out cursor-pointer text-primary hover:text-primary/80"
          >
            Contacter un avocat
          </a>
        </div>
        <div className="mt-4">
          {profile.get() ? (
            <span className="flex flex-row items-center space-x-2">
              <CheckIcon className="w-3.5 h-3.5 text-green-600" />
              <p className="text-xs font-medium text-gray-800 dark:text-white">
                Votre profil est complet.
              </p>
            </span>
          ) : (
            <div>
              <span className="flex flex-row items-center space-x-2">
                <XIcon className="w-3.5 h-3.5 text-red-600" />
                <p className="text-xs font-medium text-gray-800 dark:text-white">
                  Vous n'avez pas de profil.
                </p>
              </span>
              <span className="flex flex-row items-center mt-1 lg:space-x-2">
                <ExclamationIcon className="w-3.5 h-3.5 text-yellow-500 hidden lg:block" />
                <p className="text-xs font-medium text-gray-800 dark:text-white">
                  Il est recommandé de créer un profil pour ne pas avoir à
                  compléter les informations sur l'officier.
                </p>
              </span>
            </div>
          )}
        </div>
        {!profile.get() && (
          <div>
            <div className="hidden sm:block" aria-hidden="true">
              <div className="py-5">
                <div className="border-t border-gray-300 dark:border-gray-600" />
              </div>
            </div>
            <div className="mt-10 sm:mt-0">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <div className="px-4 sm:px-0">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                      Informations sur l'officier
                    </h3>
                    <p className="mt-1 text-sm font-medium text-gray-400">
                      Informations générales sur l'officier qui a fait
                      l'arrestation et son district.
                    </p>
                  </div>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                  <div className="overflow-hidden shadow sm:rounded-md">
                    <div className="px-4 py-5 bg-white dark:bg-gray-900 sm:p-6">
                      <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 md:col-span-3">
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                          >
                            Nom <span className="text-red-500">*</span>
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="name"
                              id="name"
                              className="block w-full border-gray-300 rounded-md shadow-sm dark:text-white dark:border-gray-600 dark:bg-gray-800 focus:ring-primary focus:border-primary sm:text-sm"
                              placeholder="Votre nom"
                              defaultValue={profile.get()?.name}
                              {...register('profile_name', { required: true })}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-span-6 md:col-span-3">
                          <label
                            htmlFor="district"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                          >
                            District <span className="text-red-500">*</span>
                          </label>
                          <div className="mt-1">
                            <select
                              name="district"
                              id="district"
                              className="block w-full border-gray-300 rounded-md shadow-sm dark:text-white dark:border-gray-600 dark:bg-gray-800 focus:ring-primary focus:border-primary sm:text-sm"
                              defaultValue={profile.get()?.district}
                              {...register('profile_district', {
                                required: true,
                              })}
                              required
                            >
                              {districts.map((district) => (
                                <option key={district} value={district}>
                                  {district}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-span-6">
                          <label
                            htmlFor="rank"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                          >
                            Grade <span className="text-red-500">*</span>
                          </label>
                          <div className="mt-1">
                            <select
                              name="rank"
                              id="rank"
                              className="block w-full border-gray-300 rounded-md shadow-sm dark:text-white dark:border-gray-600 dark:bg-gray-800 focus:ring-primary focus:border-primary sm:text-sm"
                              defaultValue={profile.get()?.rank}
                              {...register('profile_rank', { required: true })}
                              required
                            >
                              {ranks.map((rank) => (
                                <option key={rank} value={rank}>
                                  {rank}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-300 dark:border-gray-600" />
          </div>
        </div>
        <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                  Informations sur l'arrêté
                </h3>
                <p className="mt-1 text-sm font-medium text-gray-400">
                  Informations spécifiques sur l'arrêté, nationalité et
                  lieu/date de naissance ainsi que licences et permis.
                </p>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="overflow-hidden shadow sm:rounded-md">
                <div className="px-4 py-5 bg-white dark:bg-gray-900 sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="last_name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        Nom <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        id="last_name"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm dark:text-white dark:border-gray-600 dark:bg-gray-800 focus:ring-primary focus:border-primary sm:text-sm"
                        placeholder="Nom de famille"
                        {...register('last_name', { required: true })}
                        required
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="first_name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        Prénom <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        id="first_name"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm dark:text-white dark:border-gray-600 dark:bg-gray-800 focus:ring-primary focus:border-primary sm:text-sm"
                        placeholder="Prénom"
                        {...register('first_name', { required: true })}
                        required
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="sex"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        Sexe <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="sex"
                        id="sex"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm dark:text-white dark:border-gray-600 dark:bg-gray-800 focus:ring-primary focus:border-primary sm:text-sm"
                        {...register('sex', { required: true })}
                        required
                      >
                        <option>Homme</option>
                        <option>Femme</option>
                      </select>
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="nationality"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        Nationalité <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="nationality"
                        id="nationality"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm dark:text-white dark:border-gray-600 dark:bg-gray-800 focus:ring-primary focus:border-primary sm:text-sm"
                        placeholder="Nationalité du suspect"
                        {...register('nationality', { required: true })}
                        required
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        Adresse
                      </label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm dark:text-white dark:border-gray-600 dark:bg-gray-800 focus:ring-primary focus:border-primary sm:text-sm"
                        placeholder="123 Fox Hollow Ave. Suite 4, Townsend, TN 37882"
                        {...register('address')}
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        No. de téléphone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm dark:text-white dark:border-gray-600 dark:bg-gray-800 focus:ring-primary focus:border-primary sm:text-sm"
                        placeholder="2-491-04-681"
                        {...register('phone')}
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="birthdate"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        Date de naissance{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="birthdate"
                        id="birthdate"
                        className="inline-flex items-center w-full px-2 py-1.5 mt-1 border-gray-300 rounded-md shadow-sm dark:text-white dark:border-gray-600 dark:bg-gray-800 focus:ring-primary focus:border-primary sm:text-sm"
                        {...register('birthdate', {
                          required: true,
                          valueAsDate: true,
                        })}
                        required
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="birthplace"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        Lieu de naissance{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="birthplace"
                        id="birthplace"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm dark:text-white dark:border-gray-600 dark:bg-gray-800 focus:ring-primary focus:border-primary sm:text-sm"
                        placeholder="Truenorth, TN"
                        {...register('birthplace', { required: true })}
                        required
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                      <label
                        htmlFor="height"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        Taille (cm) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="height"
                        id="height"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm dark:text-white dark:border-gray-600 dark:bg-gray-800 focus:ring-primary focus:border-primary sm:text-sm"
                        placeholder="0"
                        {...register('height', {
                          required: true,
                          valueAsNumber: true,
                          setValueAs: (v) => parseInt(v),
                        })}
                        required
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                      <label
                        htmlFor="weight"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        Poids (kg) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="weight"
                        id="weight"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm dark:text-white dark:border-gray-600 dark:bg-gray-800 focus:ring-primary focus:border-primary sm:text-sm"
                        placeholder="0"
                        {...register('weight', {
                          required: true,
                          valueAsNumber: true,
                          setValueAs: (v) => parseInt(v),
                        })}
                        required
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                      <label
                        htmlFor="profession"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        Profession
                      </label>
                      <input
                        type="text"
                        name="profession"
                        id="profession"
                        placeholder="Profession"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm dark:text-white dark:border-gray-600 dark:bg-gray-800 focus:ring-primary focus:border-primary sm:text-sm"
                        {...register('profession')}
                      />
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="vehicle"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                      >
                        Véhicule (modèle, couleur, plaque)
                      </label>
                      <input
                        type="text"
                        name="vehicle"
                        id="vehicle"
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm dark:text-white dark:border-gray-600 dark:bg-gray-800 focus:ring-primary focus:border-primary sm:text-sm"
                        placeholder="Toyota Impreza, rouge foncé, H31Y0"
                        {...register('vehicle')}
                      />
                    </div>
                  </div>

                  <div className="col-span-6">
                    <fieldset className="mt-4">
                      <legend className="text-sm font-medium text-gray-900 dark:text-gray-400">
                        Permis de conduire
                      </legend>
                      <div className="flex flex-col gap-2 pt-2 lg:space-y-0 lg:grid lg:grid-cols-3">
                        {['a', 'b', 'c'].map((license) => (
                          <div
                            key={license}
                            className="flex items-start mt-4 md:mt-0"
                          >
                            <div className="flex items-center h-5">
                              <input
                                id={`drivers_license_${license}`}
                                name={`drivers_license_${license}`}
                                type="checkbox"
                                className="w-4 h-4 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-800 text-primary focus:ring-primary"
                                {...register(`drivers_license_${license}`)}
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label
                                htmlFor={`drivers_license_${license}`}
                                className="font-medium text-gray-700 dark:text-gray-400"
                              >
                                Permis {license.toUpperCase()}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </fieldset>
                  </div>

                  <div className="col-span-6">
                    <fieldset className="mt-4">
                      <legend className="text-sm font-medium text-gray-900 dark:text-gray-400">
                        Licence d'arme
                      </legend>
                      <div className="flex flex-col gap-2 pt-2 lg:space-y-0 lg:grid lg:grid-cols-3">
                        {['a', 'b', 'c', 'd', 'e'].map((license) => (
                          <div
                            key={license}
                            className="flex items-start mt-4 md:mt-0"
                          >
                            <div className="flex items-center h-5">
                              <input
                                id={`gun_license_${license}`}
                                name={`gun_license_${license}`}
                                type="checkbox"
                                className="w-4 h-4 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-800 text-primary focus:ring-primary"
                                {...register(`gun_license_${license}`)}
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label
                                htmlFor={`gun_license_${license}`}
                                className="font-medium text-gray-700 dark:text-gray-400"
                              >
                                Licence {license.toUpperCase()}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="hidden sm:block" aria-hidden="true">
            <div className="py-5">
              <div className="border-t border-gray-300 dark:border-gray-600" />
            </div>
          </div>
          <div className="mt-10 sm:mt-0">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <div className="px-4 sm:px-0">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                    Informations sur l'arrestation
                  </h3>
                  <p className="mt-1 text-sm font-medium text-gray-400">
                    Motifs et remarques sur l'arrestation, référez-vous au code
                    pénal.
                  </p>
                </div>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="overflow-hidden shadow sm:rounded-md">
                  <div className="px-4 py-5 bg-white dark:bg-gray-900 sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
                      <p className="col-span-6 text-sm font-medium text-gray-400">
                        <b>NB:</b> Les individus sous 21 années d'âge, en
                        situation de handicap, souffrantes, ou présentant
                        d'autres circonstances, ont plus de risques d'être
                        dépendant d'un adulte responsable. Ledit préjudice
                        présente ainsi une situation d'atténuation.
                      </p>
                      <div className="col-span-6">
                        <label
                          htmlFor="reason"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                        >
                          Motif de l'arrestation{' '}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="reason"
                            id="reason"
                            className="block w-full border-gray-300 rounded-md shadow-sm dark:text-white dark:border-gray-600 dark:bg-gray-800 focus:ring-primary focus:border-primary sm:text-sm"
                            placeholder="Donnez les raisons de l'arrrestation du suspect"
                            {...register('reason', { required: true })}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-span-6">
                        <label
                          htmlFor="comment"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                        >
                          Remarque
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="comment"
                            id="comment"
                            className="block w-full border-gray-300 rounded-md shadow-sm dark:text-white dark:border-gray-600 dark:bg-gray-800 focus:ring-primary focus:border-primary sm:text-sm"
                            placeholder="Spécifiez une remarque si nécessaire"
                            {...register('comment')}
                          />
                        </div>
                      </div>
                      <div className="col-span-6">
                        <label
                          htmlFor="confidentiality"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                        >
                          Niveau de confidentialité du rapport{' '}
                          <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="confidentiality"
                          id="confidentiality"
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm dark:text-white dark:border-gray-600 dark:bg-gray-800 focus:ring-primary focus:border-primary sm:text-sm"
                          {...register('confidentiality', { required: true })}
                          required
                        >
                          <option>Public</option>
                          <option selected>Interne</option>
                          <option>Confidentiel</option>
                        </select>
                      </div>
                      <div className="col-span-6">
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-400"
                        >
                          Description détaillée de l'infraction{' '}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1">
                          <textarea
                            name="description"
                            id="description"
                            rows={6}
                            className="block w-full border-gray-300 rounded-md shadow-sm dark:text-white dark:border-gray-600 dark:bg-gray-800 focus:ring-primary focus:border-primary sm:text-sm"
                            placeholder="Donnez une description détaillée de l'infraction commise par le suspect"
                            {...register('description', { required: true })}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="hidden sm:block" aria-hidden="true">
            <div className="py-5">
              <div className="border-t border-gray-300 dark:border-gray-600" />
            </div>
          </div>
          <div className="float-right">
            <button
              type="submit"
              className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-white transition duration-100 ease-in-out rounded-md shadow-sm bg-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-gray-800 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              disabled={loading}
            >
              {!loading ? (
                'Générer le BBCode'
              ) : (
                <span className="mx-12">
                  <Spinner />
                </span>
              )}
            </button>
          </div>
        </div>

        {result && (
          <div className="flex flex-col w-full mt-16">
            <textarea
              disabled
              className="w-full mt-2 text-xs font-light text-gray-400 bg-gray-200 border-gray-400 dark:text-white dark:bg-gray-700"
              rows={30}
              ref={textAreaRef}
            />
          </div>
        )}

        {result && (
          <div>
            <div className="hidden sm:block" aria-hidden="true">
              <div className="py-5">
                <div className="border-t border-gray-300 dark:border-gray-600" />
              </div>
            </div>
            {copied ? (
              <button
                className="inline-flex justify-center float-right px-4 py-2 mt-3 text-base font-medium text-white transition duration-100 ease-in-out rounded-md shadow-sm bg-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-gray-800 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                disabled
              >
                Copié!
              </button>
            ) : (
              <CopyToClipboard text={result}>
                <button
                  onClick={() => setCopied(true)}
                  className="inline-flex justify-center float-right w-full px-4 py-2 mt-3 text-base font-medium text-white transition duration-100 ease-in-out rounded-md shadow-sm bg-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-gray-800 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Copier
                </button>
              </CopyToClipboard>
            )}
          </div>
        )}
      </form>
    </main>
  )
}

export default Arrestation

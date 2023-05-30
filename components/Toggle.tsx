import { useEffect, useState, useContext } from 'react'
import { Switch } from '@headlessui/react'
import { classNames } from 'lib'
import { Theme } from 'utils'

import { SunIcon, MoonIcon } from '@heroicons/react/solid'

export const Toggle = () => {
  const [enabled, setEnabled] = useState(false)

  // Theme context
  const [theme, setTheme] = useContext(Theme)

  // Set initial theme
  useEffect(() => {
    if (
      !('theme' in sessionStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    )
      setEnabled(true)
  }, [])

  // Set theme on toggle
  useEffect(() => {
    setTheme(enabled ? 'dark' : 'light')
  }, [enabled])

  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={classNames(
        enabled ? 'bg-primary' : 'bg-gray-200',
        'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
      )}
    >
      <span className="sr-only">Use setting</span>
      <span
        className={classNames(
          enabled ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
        )}
      >
        <span
          className={classNames(
            enabled
              ? 'opacity-0 ease-out duration-100'
              : 'opacity-100 ease-in duration-200',
            'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
          )}
          aria-hidden="true"
        >
          <SunIcon className="w-3 h-3 text-gray-400" />
        </span>
        <span
          className={classNames(
            enabled
              ? 'opacity-100 ease-in duration-200'
              : 'opacity-0 ease-out duration-100',
            'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
          )}
          aria-hidden="true"
        >
          <MoonIcon className="w-3 h-3 text-primary" />
        </span>
      </span>
    </Switch>
  )
}

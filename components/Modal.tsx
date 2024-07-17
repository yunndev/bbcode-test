import type { Dispatch, SetStateAction } from 'react'

import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationIcon } from '@heroicons/react/outline'
import { classNames } from 'lib'

export const Modal = ({
  children,
  actions,
  state,
  theme,
}: {
  children: React.ReactElement<any, any>
  actions: {
    name: string
    onClick?: () => any
    primary?: boolean
    warning?: boolean
    cancel?: boolean
  }[]
  state: [boolean, Dispatch<SetStateAction<boolean>>]
  theme: 'light' | 'dark'
}) => {
  const [open, setOpen] = state
  const cancelButtonRef = useRef(null)

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className={classNames(
          theme === 'dark' ? 'dark' : '',
          'fixed inset-0 z-10 w-screen h-screen overflow-y-auto'
        )}
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 blur-xl" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 bg-white dark:bg-gray-900 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">{children}</div>
              </div>
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 sm:px-6 sm:flex sm:flex-row-reverse">
                {actions.map((action) => (
                  <button
                    type="button"
                    key={action.name}
                    className={classNames(
                      action.primary
                        ? 'bg-primary hover:bg-primary/80 text-white'
                        : action.warning
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'text-gray-700 dark:text-gray-400 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-900/80 hover:bg-gray-50 dark:hover:bg-gray-900/50',
                      'inline-flex justify-center transition duration-100 ease-in-out w-full px-4 py-2 mt-3 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-gray-800 focus:ring-primary text-base font-medium rounded-md shadow-sm sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
                    )}
                    onClick={(e) => {
                      e.preventDefault()
                      if (action.onClick) action.onClick()
                      setOpen(false)
                    }}
                    ref={action.cancel ? cancelButtonRef : null}
                  >
                    {action.name}
                  </button>
                ))}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

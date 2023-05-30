import { classNames } from 'lib'

// Selection card
export const Card = (props: {
  title: string
  description: string
  icon?: (props: React.ComponentProps<'svg'>) => JSX.Element
  onClick?: () => any
  disabled?: boolean
}) => (
  <a
    onClick={props.onClick ?? null}
    className={classNames(
      props.disabled
        ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
        : 'bg-white dark:bg-gray-900',
      props.onClick
        ? 'cursor-pointer transition hover:shadow-2xl duration-250 ease-in-out'
        : '',
      'px-6 py-8 rounded-lg shadow-lg ring-1 ring-gray-900/5'
    )}
  >
    <div>
      {props.icon && (
        <span className="inline-flex items-center justify-center p-4 rounded-lg shadow-lg bg-primary">
          <props.icon className="w-6 h-6 text-white" aria-hidden="true" />
        </span>
      )}
    </div>
    <h3 className="mt-5 text-base font-medium tracking-tight text-gray-900 dark:text-white">
      {props.title}
    </h3>
    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
      {props.description}
    </p>
  </a>
)

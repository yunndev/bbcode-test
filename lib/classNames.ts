// Utility to collate HTML class names
export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

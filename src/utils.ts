export function classNames(...classes: (string | number | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

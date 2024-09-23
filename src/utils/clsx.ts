export const clsx = (...classNames: (string | boolean | null | undefined)[]) =>
  classNames.filter((c) => typeof c === 'string').join(' ');

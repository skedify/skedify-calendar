import { unique } from './unique';

export function classNames(...classes) {
  return (
    unique(
      classes
        // Filter out falsey values
        .filter(Boolean)

        // Sort classNames
        .sort((a, b) => a.localeCompare(b))
    )
      // Join them
      .join(' ')
  );
}

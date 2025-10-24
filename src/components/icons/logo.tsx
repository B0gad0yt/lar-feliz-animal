import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      <path
        d="M12 12.5a2.5 2.5 0 00-2.5 2.5c0 .97.56 1.83 1.39 2.24.2.1.4.16.61.16s.41-.06.61-.16c.83-.41 1.39-1.27 1.39-2.24a2.5 2.5 0 00-2.5-2.5zm-3.5-2.5a1 1 0 00-1 1c0 .55.45 1 1 1s1-.45 1-1-.45-1-1-1zm7 0a1 1 0 00-1 1c0 .55.45 1 1 1s1-.45 1-1-.45-1-1-1zm-4.5-2a1.5 1.5 0 00-1.5 1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5S11.83 8 11 8zm2 0a1.5 1.5 0 000 3 1.5 1.5 0 000-3z"
        fill="hsl(var(--background))"
        stroke="hsl(var(--background))"
      />
    </svg>
  );
}

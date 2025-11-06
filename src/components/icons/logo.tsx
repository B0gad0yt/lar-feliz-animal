import type { ImgHTMLAttributes } from 'react';

type LogoProps = ImgHTMLAttributes<HTMLImageElement> & {
  width?: number;
  height?: number;
};

export function Logo({ alt = 'Lar Feliz Animal', width = 40, height = 40, ...rest }: LogoProps) {
  return (
    <img
      src="/images/logo.png"
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      {...rest}
    />
  );
}

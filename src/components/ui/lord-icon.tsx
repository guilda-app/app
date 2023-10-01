import React from 'react'
import lottie from 'lottie-web';
import {defineElement as defineLordIconElement} from 'lord-icon-element';
import { cn } from '@/lib/utils';

// register lottie and define custom element
defineLordIconElement(lottie.loadAnimation);

export type LordiconTrigger =
  | 'hover'
  | 'click'
  | 'loop'
  | 'loop-on-hover'
  | 'morph'
  | 'morph-two-way'

export type LordiconProps = {
  icon: string
  trigger?: LordiconTrigger

  delay?: number | string
  size?: number | string
  target?: string
} & React.HtmlHTMLAttributes<HTMLDivElement>

export type LordiconElement = HTMLElement & {
  src?: string
  trigger?: LordiconTrigger
  delay?: string | number
  target?: string
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
      interface IntrinsicElements {
        'lord-icon': LordiconElement;
      }
    }
  }

export const LordIcon: React.FC<LordiconProps> = ({
  icon,
  delay = 1000,
  trigger = 'hover',
  target,
  size = 20,
  className,
  ...rest
}) => {
  const cdnLordiconBaseUrl = 'https://cdn.lordicon.com/';

  const lordicon = (
    <lord-icon
      {...rest}
      src={`${cdnLordiconBaseUrl}${icon}.json`}
      trigger={trigger}
      delay={delay}
      target={target}
      className={cn('current-color', className || '')}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  )

  return lordicon
}

export default LordIcon;
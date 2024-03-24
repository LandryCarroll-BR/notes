import * as React from 'react'
import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const headingVariants = cva('font-bold tracking-tight m-0', {
  variants: {
    as: {
      h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
    },
  },
  defaultVariants: {
    as: 'h1',
  },
})

interface HeadingProps extends React.HtmlHTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariants> {
  as: 'h1' | 'h2' | 'h3' | 'h4'
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(({ as, children, className, ...props }, ref) => {
  const Comp = as

  return (
    <Comp ref={ref} className={cn(headingVariants({ as, className }))} {...props}>
      {children}
    </Comp>
  )
})
Heading.displayName = 'Heading'

const Paragraph = React.forwardRef<HTMLParagraphElement, React.HtmlHTMLAttributes<HTMLParagraphElement>>(
  ({ children, className, ...props }, ref) => (
    <p ref={ref} className={cn('leading-7 [&:not(:first-child)]:mt-6', className)} {...props}>
      {children}
    </p>
  )
)
Paragraph.displayName = 'Paragraph'

const Blockquote = React.forwardRef<HTMLQuoteElement, React.HtmlHTMLAttributes<HTMLQuoteElement>>(
  ({ children, className, ...props }, ref) => (
    <blockquote ref={ref} className={cn('mt-6 border-l-2 pl-6 italic', className)} {...props}>
      {children}
    </blockquote>
  )
)
Blockquote.displayName = 'Blockquote'

const UnorderedList = React.forwardRef<HTMLUListElement, React.HtmlHTMLAttributes<HTMLUListElement>>(
  ({ children, className, ...props }, ref) => (
    <ul ref={ref} className={cn('my-6 ml-6 list-disc [&>li]:mt-2', className)} {...props}>
      {children}
    </ul>
  )
)
UnorderedList.displayName = 'UnorderedList'

const Listitem = React.forwardRef<HTMLLIElement, React.HtmlHTMLAttributes<HTMLLIElement>>(
  ({ children, className, ...props }, ref) => (
    <li ref={ref} className={cn(className)} {...props}>
      {children}
    </li>
  )
)
Listitem.displayName = 'Listitem'

const InlineCode = React.forwardRef<HTMLElement, React.HtmlHTMLAttributes<HTMLElement>>(
  ({ children, className, ...props }, ref) => (
    <code
      ref={ref}
      className={cn('relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold', className)}
      {...props}
    >
      {children}
    </code>
  )
)
InlineCode.displayName = 'InlineCode'

const Lead = React.forwardRef<HTMLParagraphElement, React.HtmlHTMLAttributes<HTMLParagraphElement>>(
  ({ children, className, ...props }, ref) => (
    <p ref={ref} className={cn('text-xl text-muted-foreground', className)} {...props}>
      {children}
    </p>
  )
)
Lead.displayName = 'Lead'

export { Heading, Paragraph, Blockquote, UnorderedList, Listitem, InlineCode, Lead }

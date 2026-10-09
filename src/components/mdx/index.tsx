import type { MDXComponents } from 'mdx/types';
import type { ComponentPropsWithoutRef } from 'react';
import { Callout } from '@/components/articles/Callout';
import { CodeBlock } from '@/components/articles/CodeBlock';
import { DataTable } from '@/components/articles/DataTable';
import { Figure } from '@/components/articles/Figure';

function headingLink(id: string | undefined) {
  return id ? <a className="heading-link" href={`#${id}`} aria-label="Link to section">#</a> : null;
}

export const mdxComponents: MDXComponents = {
  Callout,
  Figure,
  pre: (props: ComponentPropsWithoutRef<'pre'>) => <CodeBlock {...props} />,
  table: (props: ComponentPropsWithoutRef<'table'>) => <DataTable {...props} />,
  h2: ({ children, ...props }: ComponentPropsWithoutRef<'h2'>) => <h2 {...props}>{children}{headingLink(props.id)}</h2>,
  h3: ({ children, ...props }: ComponentPropsWithoutRef<'h3'>) => <h3 {...props}>{children}{headingLink(props.id)}</h3>,
  h4: ({ children, ...props }: ComponentPropsWithoutRef<'h4'>) => <h4 {...props}>{children}{headingLink(props.id)}</h4>,
};

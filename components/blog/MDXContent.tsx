import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

const components = {
  h1: ({ children }: any) => (
    <h1 className="mb-6 mt-8 text-4xl font-bold text-gray-900 dark:text-white">{children}</h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="mb-4 mt-8 text-3xl font-bold text-gray-900 dark:text-white">{children}</h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="mb-3 mt-6 text-2xl font-semibold text-gray-900 dark:text-white">{children}</h3>
  ),
  p: ({ children }: any) => (
    <p className="mb-4 leading-7 text-gray-700 dark:text-gray-300">{children}</p>
  ),
  a: ({ href, children }: any) => (
    <a
      href={href}
      className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
    >
      {children}
    </a>
  ),
  ul: ({ children }: any) => (
    <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700 dark:text-gray-300">{children}</ul>
  ),
  ol: ({ children }: any) => (
    <ol className="mb-4 ml-6 list-decimal space-y-2 text-gray-700 dark:text-gray-300">{children}</ol>
  ),
  li: ({ children }: any) => (
    <li className="leading-7">{children}</li>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className="mb-4 border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400">
      {children}
    </blockquote>
  ),
  code: ({ className, children }: any) => {
    if (className) {
      return (
        <code className={`rounded-md px-2 py-1 text-sm font-mono ${className}`}>{children}</code>
      );
    }
    return (
      <code className="rounded-md bg-gray-200 px-2 py-1 text-sm font-mono dark:bg-gray-800">
        {children}
      </code>
    );
  },
  pre: ({ children }: any) => (
    <pre className="mb-4 overflow-x-auto rounded-lg bg-gray-900 p-4 dark:bg-gray-950">
      {children}
    </pre>
  ),
};

interface MDXContentProps {
  source: string;
}

export default function MDXContent({ source }: MDXContentProps) {
  return (
    <MDXRemote
      source={source}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug, rehypeHighlight],
        },
      }}
      components={components}
    />
  );
}

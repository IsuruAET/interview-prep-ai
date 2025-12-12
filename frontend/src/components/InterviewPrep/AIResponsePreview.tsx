import { LuCopy, LuCheck, LuCode } from "react-icons/lu";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";

const AIResponsePreview = ({ content }: { content: string }) => {
  if (!content) return null;
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-xs sm:text-sm md:text-[14px] prose prose-slate dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "";

              const isInline = !className;

              return !isInline ? (
                <CodeBlock code={String(children).trim()} language={language} />
              ) : (
                <code
                  className="px-1 py-0.5 bg-gray-100 rounded text-xs sm:text-sm wrap-break-word"
                  {...props}
                >
                  {children}
                </code>
              );
            },
            p: ({ children }) => (
              <p className="mb-3 sm:mb-4 leading-relaxed sm:leading-5 wrap-break-word">
                {children}
              </p>
            ),
            strong: ({ children }) => <strong className="">{children}</strong>,
            em: ({ children }) => <em className="">{children}</em>,
            ul: ({ children }) => (
              <ul className="list-disc pl-4 sm:pl-6 space-y-1 sm:space-y-2 my-3 sm:my-4">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-4 sm:pl-6 space-y-1 sm:space-y-2 my-3 sm:my-4">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="mb-1 wrap-break-word">{children}</li>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-gray-200 pl-3 sm:pl-4 italic my-3 sm:my-4 wrap-break-word">
                {children}
              </blockquote>
            ),
            h1: ({ children }) => (
              <h1 className="text-xl sm:text-2xl font-bold mt-4 sm:mt-6 mb-3 sm:mb-4 wrap-break-word">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-lg sm:text-xl font-bold mt-4 sm:mt-6 mb-2 sm:mb-3 wrap-break-word">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-base sm:text-lg font-bold mt-3 sm:mt-5 mb-2 wrap-break-word">
                {children}
              </h3>
            ),
            h4: ({ children }) => (
              <h4 className="text-sm sm:text-base font-bold mt-3 sm:mt-4 mb-2 wrap-break-word">
                {children}
              </h4>
            ),
            a: ({ children, href }) => (
              <a href={href} className="text-blue-600 hover:underline">
                {children}
              </a>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-3 sm:my-4 -mx-2 sm:mx-0">
                <table className="min-w-full divide-y divide-gray-300 border border-gray-200 text-xs sm:text-sm">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-gray-50">{children}</thead>
            ),
            tbody: ({ children }) => (
              <tbody className="divide-y divide-gray-200">{children}</tbody>
            ),
            tr: ({ children }) => <tr className="">{children}</tr>,
            th: ({ children }) => (
              <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-2 sm:px-3 py-1.5 sm:py-2 wrap-break-word sm:whitespace-nowrap text-xs sm:text-sm">
                {children}
              </td>
            ),
            hr: () => <hr className="my-6 border-gray-200" />,
            img: ({ src, alt }) => (
              <img src={src} alt={alt} className="my-4 max-w-full rounded" />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

interface CodeBlockProps {
  code: string;
  language: string;
}

function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 sm:my-6 rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
      <div className="flex items-center justify-between px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 border-b border-gray-200">
        <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0">
          <LuCode size={14} className="text-gray-500 shrink-0 sm:w-4 sm:h-4" />
          <span className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wide truncate">
            {language || "Code"}
          </span>
        </div>
        <button
          onClick={copyCode}
          className="text-gray-500 hover:text-gray-700 focus:outline-none relative group shrink-0 p-1"
          aria-label="Copy code"
        >
          {copied ? (
            <LuCheck size={14} className="text-green-600 sm:w-4 sm:h-4" />
          ) : (
            <LuCopy size={14} className="sm:w-4 sm:h-4" />
          )}
          {copied && (
            <span className="absolute -top-8 right-0 bg-black text-white text-[10px] sm:text-xs rounded-md px-1.5 sm:px-2 py-0.5 sm:py-1 opacity-80 group-hover:opacity-100 transition whitespace-nowrap">
              Copied
            </span>
          )}
        </button>
      </div>

      <SyntaxHighlighter
        language={language}
        style={oneLight}
        customStyle={{
          fontSize: "11px",
          margin: 0,
          padding: "0.75rem",
          background: "transparent",
        }}
        PreTag="div"
        className="overflow-x-auto"
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default AIResponsePreview;


import React, { useState } from 'react';
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ 
  code, 
  language = "javascript", 
  showLineNumbers = true 
}) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Simple syntax highlighting classes
  const getTokenClass = (token: string): string => {
    if (/^(import|export|from|const|let|var|function|return|await|async|class|extends|if|else|for|while)$/.test(token)) {
      return "text-purple-500"; // Keywords
    } else if (/^(true|false|null|undefined|this)$/.test(token)) {
      return "text-amber-500"; // Constants
    } else if (/["'`].*?["'`]/.test(token)) {
      return "text-green-500"; // Strings
    } else if (/\d+/.test(token)) {
      return "text-blue-400"; // Numbers
    } else if (/[{}()[\]]/.test(token)) {
      return "text-gray-400"; // Braces
    } else if (/\/\/.*|\/\*[\s\S]*?\*\//.test(token)) {
      return "text-gray-500"; // Comments
    }
    return "";
  };
  
  const highlightCode = (code: string) => {
    // Basic syntax highlighting
    const lines = code.split('\n');
    
    return lines.map((line, lineIndex) => {
      // Simple tokenizer for basic highlighting
      const tokens = line.split(/([{}()[\]]|".*?"|'.*?'|`.*?`|\s+|\/\/.*|\/\*[\s\S]*?\*\/|\b\w+\b)/g).filter(Boolean);
      
      return (
        <div key={lineIndex} className="flex">
          {showLineNumbers && (
            <span className="text-gray-500 inline-block w-8 text-right mr-4 select-none">
              {lineIndex + 1}
            </span>
          )}
          <span>
            {tokens.map((token, tokenIndex) => (
              <span key={tokenIndex} className={getTokenClass(token)}>
                {token}
              </span>
            ))}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="relative group">
      <button 
        onClick={handleCopy}
        className="absolute right-2 top-2 p-1.5 rounded-md bg-primary/10 hover:bg-primary/20 transition-colors"
        aria-label="Copy code"
      >
        {copied ? (
          <Check size={18} className="text-green-500" />
        ) : (
          <Copy size={18} className="text-primary" />
        )}
      </button>
      <pre className="p-4 rounded-lg bg-black/90 text-white overflow-x-auto font-mono text-sm my-2 max-h-[500px] overflow-y-auto">
        <code>{highlightCode(code)}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;

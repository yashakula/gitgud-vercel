"use client";

import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  placeholder?: string;
  height?: string;
  className?: string;
}

export function CodeEditor({
  value,
  onChange,
  language = "python",
  placeholder = "# Start coding here...",
  height = "300px",
  className = "",
}: CodeEditorProps) {
  const editorRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Detect dark mode
    const checkDarkMode = () => {
      const darkMode = document.documentElement.classList.contains('dark') || 
                       window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(darkMode);
    };

    checkDarkMode();
    
    // Listen for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkDarkMode);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', checkDarkMode);
    };
  }, []);

  const handleEditorDidMount = (editor: any, monaco: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    editorRef.current = editor;

    // Define custom monochrome theme
    monaco.editor.defineTheme("monochrome-light", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6b7280", fontStyle: "italic" },
        { token: "keyword", foreground: "1f2937", fontStyle: "bold" },
        { token: "string", foreground: "374151" },
        { token: "number", foreground: "1f2937" },
        { token: "regexp", foreground: "374151" },
        { token: "type", foreground: "1f2937" },
        { token: "class", foreground: "1f2937", fontStyle: "bold" },
        { token: "function", foreground: "1f2937" },
        { token: "variable", foreground: "1f2937" },
        { token: "constant", foreground: "1f2937" },
        { token: "operator", foreground: "4b5563" },
        { token: "delimiter", foreground: "6b7280" },
      ],
      colors: {
        "editor.background": "#fefefe",
        "editor.foreground": "#1f2937",
        "editor.lineHighlightBackground": "#f9fafb",
        "editor.selectionBackground": "#e5e7eb",
        "editor.selectionHighlightBackground": "#f3f4f6",
        "editor.wordHighlightBackground": "#f3f4f6",
        "editor.wordHighlightStrongBackground": "#e5e7eb",
        "editorCursor.foreground": "#1f2937",
        "editorWhitespace.foreground": "#d1d5db",
        "editorIndentGuide.background": "#e5e7eb",
        "editorIndentGuide.activeBackground": "#d1d5db",
        "editorLineNumber.foreground": "#9ca3af",
        "editorLineNumber.activeForeground": "#4b5563",
        "editorGutter.background": "#f9fafb",
        "editorBracketMatch.background": "#e5e7eb",
        "editorBracketMatch.border": "#9ca3af",
      },
    });

    monaco.editor.defineTheme("monochrome-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6b7280", fontStyle: "italic" },
        { token: "keyword", foreground: "e5e7eb", fontStyle: "bold" },
        { token: "string", foreground: "d1d5db" },
        { token: "number", foreground: "f3f4f6" },
        { token: "regexp", foreground: "d1d5db" },
        { token: "type", foreground: "e5e7eb", fontStyle: "bold" },
        { token: "class", foreground: "f9fafb", fontStyle: "bold" },
        { token: "function", foreground: "e5e7eb" },
        { token: "variable", foreground: "e5e7eb" },
        { token: "constant", foreground: "f3f4f6" },
        { token: "operator", foreground: "9ca3af" },
        { token: "delimiter", foreground: "6b7280" },
      ],
      colors: {
        "editor.background": "#1f2937",
        "editor.foreground": "#e5e7eb",
        "editor.lineHighlightBackground": "#374151",
        "editor.selectionBackground": "#4b5563",
        "editor.selectionHighlightBackground": "#374151",
        "editor.wordHighlightBackground": "#374151",
        "editor.wordHighlightStrongBackground": "#4b5563",
        "editorCursor.foreground": "#e5e7eb",
        "editorWhitespace.foreground": "#4b5563",
        "editorIndentGuide.background": "#374151",
        "editorIndentGuide.activeBackground": "#4b5563",
        "editorLineNumber.foreground": "#6b7280",
        "editorLineNumber.activeForeground": "#9ca3af",
        "editorGutter.background": "#1f2937",
        "editorBracketMatch.background": "#4b5563",
        "editorBracketMatch.border": "#6b7280",
      },
    });

    // Set the theme based on current theme
    const currentTheme = isDark ? "monochrome-dark" : "monochrome-light";
    monaco.editor.setTheme(currentTheme);

    // Python-specific configuration
    if (language === "python") {
      monaco.languages.registerCompletionItemProvider("python", {
        provideCompletionItems: () => {
          const suggestions = [
            {
              label: "def",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "def ${1:function_name}(${2:args}):\n    ${3:pass}",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Define a function",
            },
            {
              label: "class",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "class ${1:ClassName}:\n    def __init__(self${2:, args}):\n        ${3:pass}",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Define a class",
            },
            {
              label: "if",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "if ${1:condition}:\n    ${2:pass}",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "If statement",
            },
            {
              label: "for",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "for ${1:item} in ${2:iterable}:\n    ${3:pass}",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "For loop",
            },
            {
              label: "while",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "while ${1:condition}:\n    ${2:pass}",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "While loop",
            },
            {
              label: "try",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "try:\n    ${1:pass}\nexcept ${2:Exception} as ${3:e}:\n    ${4:pass}",
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: "Try-except block",
            },
          ];
          return { suggestions };
        },
      });
    }

    // Add placeholder if value is empty
    if (!value && placeholder) {
      const placeholderDecoration = editor.deltaDecorations([], [
        {
          range: new monaco.Range(1, 1, 1, 1),
          options: {
            after: {
              content: placeholder,
              inlineClassName: "editor-placeholder",
            },
          },
        },
      ]);

      // Remove placeholder when user starts typing
      editor.onDidChangeModelContent(() => {
        if (editor.getValue()) {
          editor.deltaDecorations(placeholderDecoration, []);
        }
      });
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || "");
  };

  useEffect(() => {
    if (editorRef.current) {
      const monaco = editorRef.current.getModel()?.monaco;
      if (monaco) {
        const currentTheme = isDark ? "monochrome-dark" : "monochrome-light";
        monaco.editor.setTheme(currentTheme);
      }
    }
  }, [isDark]);

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 14,
          fontFamily: "var(--font-geist-mono), 'Courier New', monospace",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          lineNumbers: "on",
          folding: true,
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 3,
          renderWhitespace: "selection",
          tabSize: 4,
          insertSpaces: true,
          automaticLayout: true,
          suggestOnTriggerCharacters: true,
          quickSuggestions: {
            other: true,
            comments: false,
            strings: false,
          },
          parameterHints: {
            enabled: true,
          },
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
      <style jsx global>{`
        .editor-placeholder {
          color: #9ca3af;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
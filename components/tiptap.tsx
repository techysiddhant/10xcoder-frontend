"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";

import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { EditorHeader } from "./editor-header";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  debounceTime?: number;
}

export const Tiptap = ({
  content,
  onChange,
  debounceTime = 300,
}: TiptapEditorProps) => {
  const [debouncedContent, setDebouncedContent] = useState(content);

  // Implement debouncing mechanism
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(debouncedContent);
    }, debounceTime);

    return () => {
      clearTimeout(timer);
    };
  }, [debouncedContent, onChange, debounceTime]);

  const handleUpdate = useCallback(({ editor }: { editor: any }) => {
    setDebouncedContent(editor.getHTML());
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          "min-h-[156px] max-h-[300px] overflow-y-auto bg-card border rounded-md py-2 px-3 prose  prose-sm md:prose-base lg:prose-lg  dark:prose-invert prose-headings:font-bold  prose-headings:text-secondary-foreground prose-headings:dark:text-secondary-foreground prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-base prose-a:text-amber-500 prose-img:rounded-md prose-p:text-secondary-foreground prose-p:dark:text-secondary-foreground",
      },
    },
    immediatelyRender: false,
    onUpdate: handleUpdate,
  });

  return (
    <div className="tiptap-editor-container">
      <EditorHeader editor={editor} />
      <EditorContent editor={editor} className="prose-container" />
    </div>
  );
};

import "katex/dist/katex.min.css";
import React from "react";
import { Mathematics } from "@tiptap/extension-mathematics";
import { StarterKit } from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";

const TiptapInput = ({
  value,
  placeholder,
  onChange,
}: {
  value?: string;
  placeholder?: string;
  onChange: (richText: string) => void;
}) => {
  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit,
      Mathematics,
      Placeholder.configure({ placeholder }),
    ],
    content: value,

    editorProps: {
      attributes: {
        class:
          "rounded-md border min-h-[150px] border-input bg-white focus:ring-offset-2 disabled:cursor-not-allows disabled:opacity-50 p-2",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });
  return <EditorContent editor={editor} />;
};

export default TiptapInput;

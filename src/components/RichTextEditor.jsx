import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';

export default function RichTextEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        // Replaced bg-white and text colors with semantic tokens.
        // prose-invert ensures Tiptap's default typography styles
        // flip in dark mode.
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[150px] p-4 bg-background text-body rounded-b-lg border border-border',
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-background">
      {/* Toolbar */}
      <div className="bg-surface-alt border-b border-border p-2 flex gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-surface transition-colors ${
            editor.isActive('bold') ? 'bg-primary-light text-primary' : 'text-muted'
          }`}
          title="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-surface transition-colors ${
            editor.isActive('italic') ? 'bg-primary-light text-primary' : 'text-muted'
          }`}
          title="Italic"
        >
          <Italic size={18} />
        </button>
        <div className="w-px h-6 bg-border mx-1 self-center" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-surface transition-colors ${
            editor.isActive('bulletList') ? 'bg-primary-light text-primary' : 'text-muted'
          }`}
          title="Bullet List"
        >
          <List size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-surface transition-colors ${
            editor.isActive('orderedList') ? 'bg-primary-light text-primary' : 'text-muted'
          }`}
          title="Numbered List"
        >
          <ListOrdered size={18} />
        </button>
      </div>
      
      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}
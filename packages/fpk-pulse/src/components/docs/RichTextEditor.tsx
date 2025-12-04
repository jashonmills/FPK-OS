import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Mention from '@tiptap/extension-mention';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  AtSign,
  User,
  FileText,
  CheckSquare,
  Briefcase,
  File,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { renderToString } from 'react-dom/server';
import './editor-styles.css';

interface RichTextEditorProps {
  content: any;
  onChange: (content: any) => void;
}

const getEntityIcon = (type: string) => {
  switch (type) {
    case 'user': return renderToString(<User className="h-3 w-3 inline" />);
    case 'page': return renderToString(<FileText className="h-3 w-3 inline" />);
    case 'task': return renderToString(<CheckSquare className="h-3 w-3 inline" />);
    case 'project': return renderToString(<Briefcase className="h-3 w-3 inline" />);
    case 'file': return renderToString(<File className="h-3 w-3 inline" />);
    default: return '';
  }
};

export const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const navigate = useNavigate();
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        renderHTML({ node }) {
          const type = node.attrs.entityType || 'user';
          const icon = getEntityIcon(type);
          return [
            'span',
            {
              'data-type': type,
              'data-id': node.attrs.id,
              class: `mention mention-${type}`,
            },
            icon,
            node.attrs.label || '@unknown',
          ];
        },
        suggestion: {
          items: async ({ query }) => {
            if (!query || query.length < 2) return [];
            
            try {
              const { data, error } = await supabase.functions.invoke('search-mentions', {
                body: { query }
              });

              if (error) {
                console.error('Search error:', error);
                return [];
              }

              return data?.results || [];
            } catch (error) {
              console.error('Failed to search mentions:', error);
              return [];
            }
          },
          render: () => {
            let component: any;
            let popup: any;

            return {
              onStart: (props: any) => {
                component = new MentionList(props);
                
                if (!props.clientRect) {
                  return;
                }

                popup = document.createElement('div');
                popup.className = 'mention-suggestions';
                document.body.appendChild(popup);
                component.render(popup);
              },

              onUpdate(props: any) {
                component.updateProps(props);

                if (!props.clientRect) {
                  return;
                }

                const rect = props.clientRect();
                if (rect) {
                  popup.style.top = `${rect.bottom + window.scrollY}px`;
                  popup.style.left = `${rect.left + window.scrollX}px`;
                }
              },

              onKeyDown(props: any) {
                if (props.event.key === 'Escape') {
                  popup?.remove();
                  return true;
                }
                return component.onKeyDown(props);
              },

              onExit() {
                popup?.remove();
                component?.destroy();
              },
            };
          },
        },
      }),
    ],
    content: content || { type: 'doc', content: [] },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  // Update editor content when prop changes
  useEffect(() => {
    if (!editor) return;
    
    const currentContent = editor.getJSON();
    const newContent = content || { type: 'doc', content: [] };
    
    // Only update if content has actually changed (prevent infinite loops)
    if (JSON.stringify(currentContent) !== JSON.stringify(newContent)) {
      editor.commands.setContent(newContent);
    }
  }, [editor, content]);

  // Handle mention clicks with navigation and hover cards
  useEffect(() => {
    if (!editor) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const mentionEl = target.closest('.mention');
      
      if (mentionEl) {
        const entityId = mentionEl.getAttribute('data-entity-id');
        const entityType = mentionEl.getAttribute('data-entity-type');
        
        if (entityId && entityType) {
          event.preventDefault();
          
          // Navigate based on entity type
          if (entityType === 'task') {
            navigate(`/kanban?task=${entityId}`);
          } else if (entityType === 'page') {
            navigate(`/docs?page=${entityId}`);
          } else if (entityType === 'project') {
            navigate(`/kanban?project=${entityId}`);
          } else if (entityType === 'file') {
            navigate(`/files?file=${entityId}`);
          } else if (entityType === 'user') {
            navigate(`/profile/${entityId}`);
          }
        }
      }
    };

    const editorElement = editor.view.dom;
    editorElement.addEventListener('click', handleClick);

    return () => {
      editorElement.removeEventListener('click', handleClick);
    };
  }, [editor, navigate]);

  if (!editor) {
    return null;
  }

  const MenuButton = ({ onClick, active, children }: any) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn('h-8 w-8 p-0', active && 'bg-accent')}
    >
      {children}
    </Button>
  );

  const insertMention = () => {
    const query = window.prompt('Type to search (@user, @task, @page, etc.)');
    if (query) {
      editor?.commands.insertContent('@');
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-muted p-2 border-b flex items-center gap-1 flex-wrap">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
        >
          <Bold className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
        >
          <Italic className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
        >
          <Strikethrough className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive('code')}
        >
          <Code className="h-4 w-4" />
        </MenuButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
        >
          <Heading1 className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
        >
          <Heading2 className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
        >
          <Heading3 className="h-4 w-4" />
        </MenuButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
        >
          <List className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
        >
          <ListOrdered className="h-4 w-4" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
        >
          <Quote className="h-4 w-4" />
        </MenuButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <MenuButton
          onClick={() => {
            const url = window.prompt('Enter URL');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          active={editor.isActive('link')}
        >
          <LinkIcon className="h-4 w-4" />
        </MenuButton>

        <MenuButton
          onClick={insertMention}
          active={false}
        >
          <AtSign className="h-4 w-4" />
        </MenuButton>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <MenuButton onClick={() => editor.chain().focus().undo().run()}>
          <Undo className="h-4 w-4" />
        </MenuButton>
        <MenuButton onClick={() => editor.chain().focus().redo().run()}>
          <Redo className="h-4 w-4" />
        </MenuButton>
      </div>

      {/* Editor Content */}
      <div className="bg-background">
        <EditorContent editor={editor} className="prose dark:prose-invert max-w-none p-6 text-foreground" />
      </div>
    </div>
  );
};

// Mention suggestion list component
class MentionList {
  items: any[];
  selectedIndex: number;
  command: any;
  element: HTMLDivElement | null = null;

  constructor({ items, command }: any) {
    this.items = items;
    this.selectedIndex = 0;
    this.command = command;
  }

  onKeyDown({ event }: any) {
    if (event.key === 'ArrowUp') {
      this.upHandler();
      return true;
    }

    if (event.key === 'ArrowDown') {
      this.downHandler();
      return true;
    }

    if (event.key === 'Enter') {
      this.enterHandler();
      return true;
    }

    return false;
  }

  upHandler() {
    this.selectedIndex = ((this.selectedIndex + this.items.length) - 1) % this.items.length;
    this.render(this.element!);
  }

  downHandler() {
    this.selectedIndex = (this.selectedIndex + 1) % this.items.length;
    this.render(this.element!);
  }

  enterHandler() {
    this.selectItem(this.selectedIndex);
  }

  selectItem(index: number) {
    const item = this.items[index];
    if (item) {
      this.command({ 
        id: item.id, 
        label: item.label,
        entityType: item.type,
        metadata: item.metadata
      });
    }
  }

  updateProps(props: any) {
    this.items = props.items;
    this.command = props.command;
    this.render(this.element!);
  }

  render(element: HTMLDivElement) {
    this.element = element;
    
    if (!this.items || this.items.length === 0) {
      element.innerHTML = '<div class="mention-item text-muted-foreground px-3 py-2">No results found</div>';
      return;
    }

    element.innerHTML = this.items
      .map((item, index) => {
        const icon = this.getIcon(item.type);
        const isSelected = index === this.selectedIndex;
        
        return `
          <button
            class="mention-item ${isSelected ? 'selected' : ''} flex items-center gap-2 w-full px-3 py-2 hover:bg-accent"
            data-index="${index}"
          >
            <span class="mention-icon">${icon}</span>
            <span class="flex-1 text-left">
              <div class="font-medium">${item.label}</div>
              ${this.getSubtext(item)}
            </span>
            ${this.getBadge(item)}
          </button>
        `;
      })
      .join('');

    element.querySelectorAll('.mention-item').forEach((el, index) => {
      el.addEventListener('click', () => this.selectItem(index));
    });
  }

  getIcon(type: string) {
    switch (type) {
      case 'user': return '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>';
      case 'page': return '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>';
      case 'task': return '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>';
      case 'project': return '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>';
      case 'file': return '<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>';
      default: return '';
    }
  }

  getSubtext(item: any) {
    if (item.type === 'user' && item.metadata?.email) {
      return `<div class="text-xs text-muted-foreground">${item.metadata.email}</div>`;
    }
    if (item.type === 'page' && item.metadata?.space_name) {
      return `<div class="text-xs text-muted-foreground">${item.metadata.space_name}</div>`;
    }
    if (item.type === 'task' && item.metadata?.project_name) {
      return `<div class="text-xs text-muted-foreground">${item.metadata.project_name}</div>`;
    }
    return '';
  }

  getBadge(item: any) {
    if (item.type === 'task' && item.metadata?.status) {
      const status = item.metadata.status;
      const colors: any = {
        backlog: 'bg-gray-500',
        todo: 'bg-blue-500',
        in_progress: 'bg-yellow-500',
        done: 'bg-green-500'
      };
      return `<span class="text-xs px-2 py-0.5 rounded ${colors[status] || 'bg-gray-500'} text-white">${status}</span>`;
    }
    return '';
  }

  destroy() {
    this.element = null;
  }
}

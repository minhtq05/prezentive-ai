import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEditorStore } from "@/stores/editor-store";
import { SceneElement } from "@/types/editor";
import { useEditorState } from "@tiptap/react";
import { Plus } from "lucide-react";
import { CSSProperties } from "react";

const EditorToolbar = () => {
  const addScene = useEditorStore((state) => state.addScene);
  const editor = useEditorStore((state) => state.richTextEditor);
  const overlay = useEditorStore((state) => state.overlay);
  const setOverlay = useEditorStore((state) => state.setOverlay);

  const setTab = useEditorStore((state) => state.setTab);

  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) {
        return null;
      }
      return {
        isBold: ctx.editor.isActive("bold") ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive("italic") ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive("strike") ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
        isParagraph: ctx.editor.isActive("paragraph") ?? false,
        isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
        isHeading4: ctx.editor.isActive("heading", { level: 4 }) ?? false,
        isHeading5: ctx.editor.isActive("heading", { level: 5 }) ?? false,
        isHeading6: ctx.editor.isActive("heading", { level: 6 }) ?? false,
        isBulletList: ctx.editor.isActive("bulletList") ?? false,
        isOrderedList: ctx.editor.isActive("orderedList") ?? false,
        isBlockquote: ctx.editor.isActive("blockquote") ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
      };
    },
  });

  const updateOverlay = (updates: Partial<SceneElement>) => {
    if (overlay) {
      setOverlay({ ...overlay, ...updates });
    }
  };

  const updateOverlayStyles = (updates: Partial<CSSProperties>) => {
    updateOverlay({
      ...overlay,
      elementData: {
        ...overlay.elementData,
        style: {
          ...overlay.elementData.style,
          ...updates,
        },
      },
    });
  };

  const isTextElement = overlay?.elementData?.type === "text";

  const { style } = overlay?.elementData || {};

  return (
    <div className="bg-sidebar m-2 p-2 rounded-md">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => addScene({ durationInSeconds: 5, sceneElements: [] })}
        >
          <Plus />
        </Button>

        {editor !== null && editorState !== null && isTextElement && (
          <>
            <div className="w-px h-6 bg-border mx-1" />

            <Button
              size="sm"
              variant={editorState.isBold ? "outline" : "ghost"}
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editorState.canBold}
            >
              Bold
            </Button>
            <Button
              size="sm"
              variant={editorState.isItalic ? "outline" : "ghost"}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editorState.canItalic}
            >
              Italic
            </Button>
            <Button
              size="sm"
              variant={editorState.isStrike ? "outline" : "ghost"}
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={!editorState.canStrike}
            >
              Strike
            </Button>
            {/* <Button
              size="sm"
              variant={editorState.isCode ? "outline" : "ghost"}
              onClick={() => editor.chain().focus().toggleCode().run()}
              disabled={!editorState.canCode}
            >
              Code
            </Button> */}

            <Select
              value={style.fontFamily}
              onValueChange={(value) => {
                updateOverlayStyles({ fontFamily: value });
              }}
            >
              <SelectTrigger className="w-32 !h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Georgia">Georgia</SelectItem>
                <SelectItem value="Times New Roman">Times</SelectItem>
                <SelectItem value="Helvetica">Helvetica</SelectItem>
                <SelectItem value="monospace">Monospace</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="number"
              value={style.fontSize}
              onChange={(e) => {
                updateOverlayStyles({ fontSize: parseInt(e.target.value) });
              }}
              className="w-16 !h-8"
              min="8"
              max="200"
            />

            <Input
              type="color"
              value={style.color}
              onChange={(e) => {
                updateOverlayStyles({ color: e.target.value });
              }}
              className="w-12 !h-8 p-1"
            />

            {/* <Select
              value={style.align}
              onValueChange={(value) => {
                updateOverlayStyles({ align: value });
              }}
            >
              <SelectTrigger className="w-20 !h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select> */}
            <div className="w-px h-6 bg-border mx-1" />

            <Button
              size="sm"
              variant="ghost"
              onClick={() => setTab("Animations")}
            >
              Animations
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default EditorToolbar;

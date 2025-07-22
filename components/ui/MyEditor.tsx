import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import styles from "./MyEditor.module.css";
import { useRef } from "react";
import httpRequest from "@/lib/httpRequest";
import type QuillType from "quill";

interface ReactQuillWithGetEditor {
  getEditor: () => QuillType;
}

function MyEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const quillRef = useRef<ReactQuill | null>(null);

  // Handler upload ảnh lên server
  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        // 1. Upload file lên server
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "editor");
        try {
          const res = await httpRequest.post("/image/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          const imageUrl = res.data?.secure_url || res.data?.url;
          // 2. Chèn URL ảnh vào editor
          const quill = (
            quillRef.current as unknown as ReactQuillWithGetEditor
          )?.getEditor();
          const range = quill?.getSelection();
          quill?.insertEmbed(range?.index || 0, "image", imageUrl);
        } catch {
          alert("Upload ảnh thất bại!");
        }
      }
    };
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        [{ indent: "-1" }, { indent: "+1" }],
        ["blockquote", "code-block"],
        ["link", "image", "video"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  };

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      value={value}
      onChange={onChange}
      className={styles.editorWrapper}
      modules={modules}
    />
  );
}

export default MyEditor;

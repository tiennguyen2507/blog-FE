import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import styles from "./MyEditor.module.css";

function MyEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      className={styles.editorWrapper}
    />
  );
}

export default MyEditor;

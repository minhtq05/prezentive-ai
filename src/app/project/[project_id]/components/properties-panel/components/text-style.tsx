import FontStyle from "./font-style";
import FontWeight from "./font-weight";
import TextStrikethrough from "./text-strikethrough";
import TextUnderline from "./text-underline";

export default function TextStyle() {
  return (
    <div className="grid grid-cols-4 gap-1">
      <FontWeight />
      <FontStyle />
      <TextUnderline />
      <TextStrikethrough />
    </div>
  );
}

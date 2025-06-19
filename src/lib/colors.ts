import { RgbaColor } from "react-colorful";

export function rgbaColorToString(color: RgbaColor): string {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
}

export function rgbaColorToHex(color: RgbaColor): string {
  const r = Math.round(color.r).toString(16).padStart(2, "0");
  const g = Math.round(color.g).toString(16).padStart(2, "0");
  const b = Math.round(color.b).toString(16).padStart(2, "0");
  // const a = Math.round(color.a * 255)
  //   .toString(16)
  //   .padStart(2, "0");
  // return `#${r}${g}${b}${a}`;
  // remove alpha channel for hex representation
  return `#${r}${g}${b}`;
}

export function rgbaStringToColor(
  colorString: string,
  defaultColor: RgbaColor = { r: 0, g: 0, b: 0, a: 1 }
): RgbaColor {
  if (colorString.length !== 7 && colorString.length !== 9) {
    return defaultColor;
  }
  const r = parseInt(colorString.slice(1, 3), 16);
  const g = parseInt(colorString.slice(3, 5), 16);
  const b = parseInt(colorString.slice(5, 7), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return defaultColor;
  }
  const a =
    colorString.length === 9 ? parseInt(colorString.slice(7, 9), 16) / 255 : 1;
  return { r, g, b, a };
}

export function isColor(strColor: string): boolean {
  return /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(strColor);
}

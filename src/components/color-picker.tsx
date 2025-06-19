"use client";

import { rgbaColorToString } from "@/lib/colors";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { RgbaColor, RgbaColorPicker } from "react-colorful";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface ColorPickerProps {
  value: RgbaColor;
  onChange: (value: RgbaColor) => void;
  onBlur?: () => void;
}

export default function ColorPicker({
  disabled,
  value,
  onChange,
  onBlur,
  name,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "value" | "onChange" | "onBlur"> &
  ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const colorRef = useRef<RgbaColor>(value);
  const buttonRef = useRef<HTMLButtonElement>(null!);

  const parsedValue = rgbaColorToString(value) || "#FFFFFF";

  const handleColorChange = (newColor: RgbaColor) => {
    colorRef.current = newColor;
    buttonRef.current.style.backgroundColor = rgbaColorToString(newColor);
  };

  const handleCommitColorChange = () => {
    onChange(colorRef.current);
  };

  return (
    <Popover
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          handleCommitColorChange();
        }
      }}
      open={open}
    >
      <PopoverTrigger asChild disabled={disabled} onBlur={onBlur}>
        <Button
          {...props}
          ref={buttonRef}
          className={cn("block transition-none", className)}
          name={name}
          onClick={() => {
            setOpen(true);
          }}
          size="icon"
          style={{
            backgroundColor: parsedValue,
          }}
          variant="outline"
        />
      </PopoverTrigger>
      <PopoverContent className="w-full flex flex-col gap-2">
        <RgbaColorPicker
          color={colorRef.current}
          onChange={handleColorChange}
        />
      </PopoverContent>
    </Popover>
  );
}

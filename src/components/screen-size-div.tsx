import { cn } from "@/lib/utils";
import { useMeasure } from "@uidotdev/usehooks";
import { useMemo } from "react";

export default function ScreenSizeDiv({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const [ref, { width }] = useMeasure();
  const scale = useMemo(() => {
    return (width ?? 0) / 1920;
  }, [width]);

  return (
    <div
      ref={ref}
      className={cn("size-full aspect-video relative", className)}
      {...props}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transformOrigin: "top left",
          transform: `scale(${scale})`,
          width: 1920,
          height: 1080,
        }}
      >
        {children}
      </div>
    </div>
  );
}

interface ResizeProps {
  onResize: (deltaWidth: number, deltaHeight: number) => void;
}
import { LucideScaling } from "lucide-react";

import React from "react";

export default function Resize({ onResize }: ResizeProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const startPosRef = React.useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleGlobalPointerUp = () => {
      setIsDragging(false);
      document.body.style.cursor = "default";
    };

    const handleGlobalPointerMove = (event: PointerEvent) => {
      if (!isDragging) return;

      const deltaX = event.clientX - startPosRef.current.x;
      const deltaY = event.clientY - startPosRef.current.y;

      onResize(deltaX, deltaY);
      startPosRef.current = { x: event.clientX, y: event.clientY };
    };

    if (isDragging) {
      window.addEventListener("pointermove", handleGlobalPointerMove);
      window.addEventListener("pointerup", handleGlobalPointerUp);
    }

    return () => {
      window.removeEventListener("pointermove", handleGlobalPointerMove);
      window.removeEventListener("pointerup", handleGlobalPointerUp);
    };
  }, [isDragging, onResize]);

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsDragging(true);
    startPosRef.current = { x: event.clientX, y: event.clientY };
    document.body.style.cursor = "se-resize";
  };

  return (
    <button
      onPointerDown={handlePointerDown}
      className="absolute right-0 bottom-0 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    >
      <LucideScaling className="size-5 shadow bg-black/40 backdrop-filter" />
    </button>
  );
}

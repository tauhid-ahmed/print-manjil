"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";

interface Coords {
  x: string | number;
  y: string | number;
  width: number;
  height: number;
}

interface InteractionState {
  isPointerDown: boolean;
  isLogoInteracting: boolean;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
}

import Resize from "./resize";
import Upload from "./upload";

export default function TShirt() {
  // eslint-disable-next-line
  const [objectUrl, setObjectUrl] = React.useState<string>("");
  const [config, setConfig] = useState<{
    coords: Coords;
  }>({
    coords: {
      x: "65%",
      y: "25%",
      width: 100,
      height: 62,
    },
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  const [interactionState, setInteractionState] = useState<InteractionState>({
    isPointerDown: false,
    isLogoInteracting: false,
    startX: 0,
    startY: 0,
    startWidth: 100,
    startHeight: 50,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.style.setProperty("--w", `${config.coords.width}px`);
      container.style.setProperty("--h", `${config.coords.height}px`);
      container.style.setProperty(
        "--x",
        typeof config.coords.x === "string"
          ? config.coords.x
          : `${config.coords.x}px`
      );
      container.style.setProperty(
        "--y",
        typeof config.coords.y === "string"
          ? config.coords.y
          : `${config.coords.y}px`
      );
    }
  }, [config.coords]);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!interactionState.isPointerDown || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const { left, top, width, height } = canvas.getBoundingClientRect();

    if (interactionState.isLogoInteracting) {
      const moveX = ((event.clientX - left) / width) * 100;
      const moveY = ((event.clientY - top) / height) * 100;

      const clampedX = Math.max(0, Math.min(100, moveX));
      const clampedY = Math.max(0, Math.min(100, moveY));

      setConfig((prev) => ({
        ...prev,
        coords: {
          ...prev.coords,
          x: `${clampedX}%`,
          y: `${clampedY}%`,
        },
      }));
    }
  };

  const handlePointerUp = () => {
    setInteractionState((prev) => ({
      ...prev,
      isPointerDown: false,
      isLogoInteracting: false,
    }));
    document.body.style.cursor = "default";
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const isLogoInteracting = (event.target as HTMLElement).id === "logo";
    if (isLogoInteracting) {
      document.body.style.cursor = "grabbing";
    }

    setInteractionState((prev) => ({
      ...prev,
      isPointerDown: true,
      isLogoInteracting,
      startX: event.clientX,
      startY: event.clientY,
      startWidth: config.coords.width,
      startHeight: config.coords.height,
    }));
  };

  const handleDimensionsChange = (deltaWidth: number, deltaHeight: number) => {
    setConfig((prev) => ({
      ...prev,
      coords: {
        ...prev.coords,
        width: Math.max(60, Math.min(400, prev.coords.width + deltaWidth)),
        height: Math.max(20, Math.min(250, prev.coords.height + deltaHeight)),
      },
    }));
  };

  const dragOverHandler = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    const container = logoRef.current;
    container?.style.setProperty("border", "1px solid white");
    console.log(container);
  };

  const dropHandler = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("id");
    const main = document.getElementById(id);
    if (logoRef.current && main) {
      logoRef.current.appendChild(main);
    }
  };

  return (
    <div ref={containerRef} className="grid place-items-center">
      <div className=" flex flex-col md:flex-row gap-4 justify-center items-center max-w-3xl w-full">
        <div>
          <div
            ref={canvasRef}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerDown={handlePointerDown}
            className="relative flex-1 min-w-72 aspect-square rounded-lg overflow-hidden bg-red-200"
          >
            <Image
              className="size-full object-cover"
              src="/images/tshirt.png"
              fill
              alt="tshirt"
            />
            <div
              ref={logoRef}
              onDrop={dropHandler}
              onDragOver={dragOverHandler}
              id="logo"
              className="[&>[^id]]:pointer-events-none absolute cursor-grab active:cursor-grabbing transition-colors -translate-x-1/2 -translate-y-1/2 before:absolute before:-inset-[400px] group"
              style={{
                left: config.coords.x,
                top: config.coords.y,
                width: `${config.coords.width}px`,
                height: `${config.coords.height}px`,
              }}
            >
              <Resize onResize={handleDimensionsChange} />
            </div>
          </div>
          {/* image preview */}
          {/* <div className="relative size-96 border-2 bg-red-200">
            {objectUrl && (
              <>
                <Image
                  src="/images/tshirt.png"
                  className="size-full object-cover"
                  alt="image"
                  width="400"
                  height="400"
                />
                <div
                  className="absolute border -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: "var(--w)",
                    height: "var(--h)",
                    left: "var(--x)",
                    top: "var(--y)",
                  }}
                >
                  <Image
                    width="400"
                    height="400"
                    className="block size-full object-cover"
                    src={objectUrl}
                    alt="Uploaded content"
                  />
                </div>
              </>
            )}
          </div> */}
        </div>

        <div className="md:self-start flex relative">
          <Upload rootObjectUrl={(url: string) => setObjectUrl(url)} />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { frameCache, getFrameLoadProgress, FRAME_COUNT as CACHE_FRAME_COUNT } from "@/lib/heroFrameCache";

interface ImageSequencePlayerProps {
  frameCount: number;
  baseUrl: string;
  extension: string;
  className?: string;
  onFrameUpdate?: (frameIndex: number) => void;
  progress?: number;
}

export default function ImageSequencePlayer({
  frameCount,
  baseUrl,
  extension,
  className,
  onFrameUpdate,
  progress,
}: ImageSequencePlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  // Use cache progress if this is the hero sequence, otherwise count from scratch
  const useCache = frameCount === CACHE_FRAME_COUNT;
  // Initialize to 0 for hydration safety. We update this in useEffect.
  const [imagesLoaded, setImagesLoaded] = useState(0);

  useEffect(() => {
    if (useCache) {
      // Pull already-started images from the module-level cache
      const cached: HTMLImageElement[] = [];
      let resolved = 0;

      for (let i = 1; i <= frameCount; i++) {
        const img = frameCache.get(i)!;
        cached.push(img);
        if (img.complete) {
          resolved++;
        } else {
          const done = () => setImagesLoaded((n) => n + 1);
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
        }
      }

      imagesRef.current = cached;
      setImagesLoaded(resolved);
      return;
    }

    // Fallback: original fresh-load path for non-hero sequences
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = `${baseUrl}${String(i).padStart(3, "0")}${extension}`;
      img.onload = img.onerror = () => {
        loadedCount++;
        setImagesLoaded(loadedCount);
      };
      loadedImages.push(img);
    }
    imagesRef.current = loadedImages;
  }, [frameCount, baseUrl, extension, useCache]);

  // Handle rendering
  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const img = imagesRef.current[index];
    if (!img || !img.complete) return;

    // Use physical pixels for drawing
    const dpr = window.devicePixelRatio || 1;
    const logicalWidth = window.innerWidth;
    const logicalHeight = window.innerHeight;
    const physicalWidth = logicalWidth * dpr;
    const physicalHeight = logicalHeight * dpr;

    // Object-fit: cover logic
    const imgRatio = img.width / img.height;
    const canvasRatio = physicalWidth / physicalHeight;
    let drawWidth, drawHeight, drawX, drawY;

    if (imgRatio > canvasRatio) {
      drawHeight = physicalHeight;
      drawWidth = physicalHeight * imgRatio;
      drawX = (physicalWidth - drawWidth) / 2;
      drawY = 0;
    } else {
      drawWidth = physicalWidth;
      drawHeight = physicalWidth / imgRatio;
      drawX = 0;
      drawY = (physicalHeight - drawHeight) / 2;
    }

    ctx.clearRect(0, 0, physicalWidth, physicalHeight);
    // Disable smoothing for sharp industrial look if needed, or leave on for cinematic
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

    onFrameUpdate?.(index);
  };

  useGSAP(
    () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const setCanvasSize = () => {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        renderFrame(0);
      };

      window.addEventListener("resize", setCanvasSize);
      setCanvasSize();

      // If parent passes progress, use it
      if (progress !== undefined) {
        const frameIndex = Math.floor(progress * (frameCount - 1));
        renderFrame(frameIndex);
      }

      // Fallback ScrollTrigger if no progress prop
      if (progress === undefined && imagesLoaded >= frameCount) {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            const frameIndex = Math.floor(self.progress * (frameCount - 1));
            renderFrame(frameIndex);
          },
        });
      }

      return () => window.removeEventListener("resize", setCanvasSize);
    },
    { scope: containerRef, dependencies: [imagesLoaded, progress] }
  );

  return (
    <div ref={containerRef} className={className}>
      <canvas ref={canvasRef} className="block h-full w-full" />

      {/* Loading State Beat */}
      {imagesLoaded < frameCount && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-50">
          <div className="w-64 h-px bg-foreground/10 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-accent transition-all duration-300"
              style={{ width: `${(imagesLoaded / frameCount) * 100}%` }}
            />
          </div>
          <div className="mt-8 font-mono text-[9px] uppercase tracking-[0.4em] text-accent">
            Initializing High-Fidelity Sequence: {Math.floor((imagesLoaded / frameCount) * 100)}%
          </div>
        </div>
      )}
    </div>
  );
}


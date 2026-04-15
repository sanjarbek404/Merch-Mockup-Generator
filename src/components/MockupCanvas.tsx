import React, { useEffect, useRef, useState } from 'react';
import { MockupTemplate, UserLogo } from '../types';

interface MockupCanvasProps {
  template: MockupTemplate;
  logo: UserLogo | null;
  className?: string;
  onExport?: (dataUrl: string) => void;
  logoScale?: number;
  logoOpacity?: number;
  logoPosition?: { x: number; y: number };
}

export const MockupCanvas: React.FC<MockupCanvasProps> = ({
  template,
  logo,
  className = '',
  onExport,
  logoScale = 1,
  logoOpacity = 0.9,
  logoPosition = { x: 0, y: 0 }
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const productImgRef = useRef<HTMLImageElement | null>(null);
  const logoImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const productImg = new Image();
    productImg.crossOrigin = 'anonymous';
    productImg.src = template.imageUrl;
    productImg.onload = () => {
      productImgRef.current = productImg;
      if (!logo) {
        setImagesLoaded(true);
        draw();
      }
    };

    if (logo) {
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.src = logo.url;
      logoImg.onload = () => {
        logoImgRef.current = logoImg;
        if (productImgRef.current) {
          setImagesLoaded(true);
          draw();
        }
      };
    } else {
      logoImgRef.current = null;
    }
  }, [template, logo]);

  useEffect(() => {
    if (imagesLoaded) {
      draw();
    }
  }, [imagesLoaded, logoScale, logoOpacity, logoPosition]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas || !productImgRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match product image
    canvas.width = productImgRef.current.width;
    canvas.height = productImgRef.current.height;

    // Draw product
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(productImgRef.current, 0, 0);

    // Draw logo if exists
    if (logo && logoImgRef.current) {
      const { x, y, width, height, rotation = 0 } = template.placement;
      
      const centerX = (x + logoPosition.x) * canvas.width;
      const centerY = (y + logoPosition.y) * canvas.height;
      const drawWidth = width * canvas.width * logoScale;
      const drawHeight = (logo.height / logo.width) * drawWidth;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.globalAlpha = logoOpacity;
      
      // Simple blending for realism
      // For white products, 'multiply' works great
      // For dark products, 'screen' or 'overlay'
      if (template.id.includes('white') || template.id.includes('grey') || template.id.includes('tote')) {
        ctx.globalCompositeOperation = 'multiply';
      } else if (template.id.includes('black')) {
        // ctx.globalCompositeOperation = 'screen';
      }

      ctx.drawImage(
        logoImgRef.current,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight
      );
      
      ctx.restore();
    }

    if (onExport) {
      onExport(canvas.toDataURL('image/png'));
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-lg bg-[var(--bg-color)] ${className}`}>
      <canvas
        ref={canvasRef}
        className="h-full w-full object-contain"
        style={{ maxHeight: '70vh' }}
      />
      {!imagesLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm font-medium">Preparing Mockup...</p>
          </div>
        </div>
      )}
    </div>
  );
};

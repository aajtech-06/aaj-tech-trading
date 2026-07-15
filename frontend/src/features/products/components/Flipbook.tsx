'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Loader2, ChevronLeft, ChevronRight, Maximize, Minimize } from 'lucide-react';
import { motion } from 'framer-motion';

// Dynamic import for libraries that require browser environment
let HTMLFlipBook: any;
let pdfjsLib: any;

interface FlipbookProps {
  pdfUrl: string;
}

const Flipbook: React.FC<FlipbookProps> = ({ pdfUrl }) => {
  const [pages, setPages] = useState<(string | null)[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [libsLoaded, setLibsLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const flipBookRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const [dimensions, setDimensions] = useState({ width: 550, height: 733 });

  useEffect(() => {
    const handleResize = () => {
      if (isFullscreen) {
        // Calculate fullscreen dimensions
        const fitHeight = window.innerHeight - 140; // Leave space for controls & page indicator
        const fitWidth = fitHeight * 0.75; // Aspect ratio of 550 / 733 is ~0.75
        
        // Double page width is 2 * fitWidth. Must fit in window.innerWidth - 100
        const maxSinglePageWidth = (window.innerWidth - 160) / 2;
        const pageWidth = Math.min(fitWidth, maxSinglePageWidth);
        const pageHeight = pageWidth / 0.75;
        
        setDimensions({ width: Math.floor(pageWidth), height: Math.floor(pageHeight) });
      } else {
        // Handle responsive page sizes for standard layout
        const screenWidth = window.innerWidth;
        if (screenWidth < 640) {
          // Mobile screen: Single page width fits container
          const pageWidth = screenWidth - 40;
          setDimensions({ width: pageWidth, height: pageWidth / 0.75 });
        } else if (screenWidth < 1024) {
          // Tablet screen: Split width
          const pageWidth = (screenWidth - 80) / 2;
          setDimensions({ width: pageWidth, height: pageWidth / 0.75 });
        } else {
          // Desktop screen
          setDimensions({ width: 550, height: 733 });
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const loadLibs = async () => {
      if (typeof window !== 'undefined') {
        const pageFlipMod = await import('react-pageflip');
        const pdfjsMod = await import('pdfjs-dist');
        HTMLFlipBook = pageFlipMod.default;
        pdfjsLib = pdfjsMod;
        
        // Set worker path - Using unpkg for better reliability with v5.x
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@5.6.205/build/pdf.worker.min.mjs';
        
        setLibsLoaded(true);
      }
    };
    loadLibs();
  }, []);

  useEffect(() => {
    let active = true;
    const loadPdf = async () => {
      if (!libsLoaded || !pdfUrl) return;
      
      setLoading(true);
      try {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        if (!active) return;
        
        const totalPages = pdf.numPages;
        
        // Initialize pages array with placeholders
        setPages(new Array(totalPages).fill(null));
        setLoading(false); // Hide the main loader immediately!

        // Load pages in the background progressively
        for (let i = 1; i <= totalPages; i++) {
          if (!active) break;
          
          try {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            if (context && active) {
              await page.render({ canvasContext: context, viewport }).promise;
              if (active) {
                const imgData = canvas.toDataURL('image/jpeg', 0.8);
                setPages(prev => {
                  const updated = [...prev];
                  updated[i - 1] = imgData;
                  return updated;
                });
              }
            }
          } catch (err) {
            console.error(`Error rendering page ${i}:`, err);
          }
          
          // Yield to browser thread to keep UX smooth
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      } catch (error) {
        console.error('Error loading PDF:', error);
        if (active) {
          setLoading(false);
        }
      }
    };

    loadPdf();
    return () => {
      active = false;
    };
  }, [pdfUrl, libsLoaded]);

  if (!libsLoaded || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] bg-gray-50 rounded-[3rem] border border-gray-100">
        <Loader2 className="w-12 h-12 text-brand-red animate-spin mb-4" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Preparing Your Catalog...</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`flex flex-col items-center justify-center relative ${isFullscreen ? 'bg-gray-100 p-6 overflow-hidden w-full h-full' : ''}`}>
      {/* Fullscreen Toggle */}
      <button
        onClick={toggleFullscreen}
        className={`absolute z-50 w-12 h-12 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center text-brand-dark hover:text-brand-red transition-all ${isFullscreen ? 'top-8 right-8' : 'top-0 right-0 -translate-y-12 md:-translate-y-0 md:top-0 md:-right-16'}`}
        title="Toggle Fullscreen"
      >
        {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
      </button>

      <div className="relative group max-w-full overflow-hidden px-4 md:px-0 flex-grow flex items-center justify-center">
        <HTMLFlipBook
          key={`${dimensions.width}-${dimensions.height}`}
          width={dimensions.width}
          height={dimensions.height}
          size="fixed"
          minWidth={315}
          maxWidth={1000}
          minHeight={420}
          maxHeight={1533}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          onFlip={(e: any) => setCurrentPage(e.data)}
          className="shadow-2xl rounded-lg"
          ref={flipBookRef}
          startPage={0}
          drawShadow={true}
          flippingTime={1000}
          usePortrait={false}
          startZIndex={0}
          autoSize={true}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={30}
          showPageCorners={true}
          disableFlipByClick={false}
        >
          {pages.map((image, index) => (
            <div key={index} className="bg-white w-full h-full flex items-center justify-center relative">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt={`Page ${index + 1}`} className="w-full h-full object-contain shadow-inner" />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full bg-gray-50 border border-gray-100 p-8 min-h-[500px] aspect-[0.75]">
                  <Loader2 className="w-8 h-8 text-brand-red animate-spin mb-2" />
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] text-center">Loading page {index + 1}...</p>
                </div>
              )}
            </div>
          ))}
        </HTMLFlipBook>

        {/* Controls */}
        <div className="absolute top-1/2 -left-4 -translate-y-1/2 hidden md:block z-10">
           <button 
             onClick={() => flipBookRef.current?.pageFlip().flipPrev()}
             className="w-14 h-14 bg-white rounded-full shadow-xl flex items-center justify-center text-brand-dark hover:text-brand-red transition-all"
           >
             <ChevronLeft size={32} />
           </button>
        </div>
        <div className="absolute top-1/2 -right-4 -translate-y-1/2 hidden md:block z-10">
           <button 
             onClick={() => flipBookRef.current?.pageFlip().flipNext()}
             className="w-14 h-14 bg-white rounded-full shadow-xl flex items-center justify-center text-brand-dark hover:text-brand-red transition-all"
           >
             <ChevronRight size={32} />
           </button>
        </div>
      </div>

      <div className={`${isFullscreen ? 'mt-6' : 'mt-12'} flex items-center gap-8`}>
        <div className="text-sm font-black text-brand-dark uppercase tracking-widest">
          Page <span className="text-brand-red">{currentPage + 1}</span> of {pages.length}
        </div>
        <div className="h-1 w-32 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-brand-red"
            initial={{ width: 0 }}
            animate={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Flipbook;


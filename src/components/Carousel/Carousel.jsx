

import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

const Carousel = ({ children, itemsToShow = 1 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const carouselRef = useRef(null);
  const containerRef = useRef(null);
  const [itemWidth, setItemWidth] = useState(0);
  const [visibleItems, setVisibleItems] = useState(itemsToShow);
  const [totalWidth, setTotalWidth] = useState(0);

  useEffect(() => {
    const updateVisibleItems = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        setVisibleItems(Math.min(6, itemsToShow));
      } else if (width >= 1024) {
        setVisibleItems(Math.min(5, itemsToShow));
      } else if (width >= 768) {
        setVisibleItems(Math.min(4, itemsToShow));
      } else if (width >= 640) {
        setVisibleItems(Math.min(3, itemsToShow));
      } else {
        setVisibleItems(Math.min(2, itemsToShow));
      }
    };

    updateVisibleItems();
    window.addEventListener('resize', updateVisibleItems);
    return () => window.removeEventListener('resize', updateVisibleItems);
  }, [itemsToShow]);

  useEffect(() => {
    if (containerRef.current && carouselRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const gap = 16; 
      const calculatedWidth = (containerWidth - (gap * (visibleItems - 1))) / visibleItems;
      setItemWidth(calculatedWidth);
      
      const totalChildren = React.Children.count(children);
      setTotalWidth(totalChildren * (calculatedWidth + gap) - gap);
    }
  }, [visibleItems, children]);

  const totalItems = React.Children.count(children);
  const gap = 16; 
  const itemWidthWithGap = itemWidth + gap;

  const next = () => {
    setCurrentIndex(prev => {
      const maxIndex = Math.max(0, totalItems - visibleItems);
      return Math.min(prev + 1, maxIndex);
    });
  };

  const prev = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) next();
    if (isRightSwipe) prev();
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  const showPrevArrow = currentIndex > 0;
  const showNextArrow = (currentIndex + visibleItems) < totalItems;

  return (
    <div className="relative w-full group" ref={containerRef}>
      <div className="overflow-hidden">
        <div
          ref={carouselRef}
          className="flex transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] gap-4 will-change-transform"
          style={{
            transform: `translateX(-${currentIndex * itemWidthWithGap}px)`,
            width: `${totalWidth}px`
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {React.Children.map(children, (child, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{ width: `${itemWidth}px` }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {showPrevArrow && (
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {showNextArrow && (
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default Carousel;
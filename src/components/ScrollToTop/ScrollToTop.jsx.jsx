import { useEffect } from "react";
import { useLocation } from "react-router-dom";


const smoothScrollToTop = () => {
  if ('scrollBehavior' in document.documentElement.style) {
 
    window.scrollTo({ top: 0, left: 0 });
  } else {
  
    let scrollStep = -window.scrollY / (500 / 15);
    const scrollInterval = setInterval(() => {
      if (window.scrollY !== 0) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  }
};

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    smoothScrollToTop();
  }, [pathname]);

  return null;
};

export default ScrollToTop;

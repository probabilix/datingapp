import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // This ensures the window scrolls to the top whenever the path changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // Added smooth animation as requested
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
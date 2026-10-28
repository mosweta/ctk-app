// this component is used to scroll to the top of the page when navigating to a new route. It is used in the App component to ensure that when a user navigates to a new page, they start at the top of that page rather than staying at the same scroll position they were on the previous page.

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTopOnNavigate() {
  // We only need the pathname. If we used the whole location object,
  // it would scroll to top every time a query string changed (like ?page=2).
  const { pathname } = useLocation();

  useEffect(() => {
    // 'instant' ensures the user doesn't see a smooth scrolling animation
    // from the bottom of the old page to the top of the new page.
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant', 
    });
  }, [pathname]);

  return null; // This component doesn't render anything visually
}
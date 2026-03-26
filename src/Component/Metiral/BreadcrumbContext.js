import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const BreadcrumbContext = createContext();

export const useBreadcrumb = () => useContext(BreadcrumbContext);

export const BreadcrumbProvider = ({ children }) => {
  const [trail, setTrail] = useState([{ label: 'Home', path: '/' }]);
  const location = useLocation();

  useEffect(() => {
    let rawLabel = location.pathname.split('/').pop() || 'Home';
    let label = rawLabel === '' ? 'Home' : rawLabel.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const path = location.pathname + location.search;
    setTrail(prev => {
      // Remove all previous of this path
      const filtered = prev.filter(item => item.path !== path);
      return [...filtered, { label, path }];
    });
  }, [location.pathname, location.search]);

  return (
    <BreadcrumbContext.Provider value={{ trail, setTrail }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

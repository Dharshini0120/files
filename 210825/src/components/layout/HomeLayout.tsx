import React from 'react';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';

const HomeLayout = ({ children }) => {
  return (
    <div>
      <AppHeader />
      {children}
      <AppFooter />
    </div>
  );
};

export default HomeLayout;
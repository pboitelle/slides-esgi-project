import React from 'react';
import { Navbar } from "/src/components/Navbar";
import { Outlet } from 'react-router-dom';

export default () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

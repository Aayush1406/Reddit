import React from "react";
import Navbar from "../Navbar";

const Layout = ({ children }) => {
  // useAuth(); // will implement later at end of tutorial

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default Layout;

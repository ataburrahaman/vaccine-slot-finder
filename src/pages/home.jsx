import React from "react";
import logo from "../logo.svg";
import { motion } from "framer-motion";

const LoaderContainer = ({ children }) => {
  return (
    <motion.div
      initial={{
        y: 0,
      }}
      animate={{
        y: "-100vh",
      }}
      transition={{
        delay: 4.2,
        duration: 0.3,
      }}
    >
      {/* <div>{children}</div> */}
      <img
        src={logo} 
        className="App-logo"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10000
        }}
        alt="logo"
      />
    </motion.div>
  );
};

export default LoaderContainer;

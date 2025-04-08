import React from "react";
import Image from "next/image";

const Logo = ({ width = 40, height = 41, className }) => {
  return (
    <Image
      width={width}
      height={height}
      priority
      src="/neo-pod-logo.svg"
      alt="NEO POD Logo"
      className={className}
    />
  );
};

export default Logo;

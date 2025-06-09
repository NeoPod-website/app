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

export const LogoWithText = ({ width = 56, height = 56, className }) => {
  return (
    <div className="flex gap-3 text-white">
      <Image
        width={width}
        height={height}
        priority
        src="/neo-pod-logo.svg"
        alt="NEO POD Logo"
        className={className}
      />

      <div>
        <h2 className="text-2xl font-bold text-white">NeoPod</h2>
        <p>Ambassador Program</p>
      </div>
    </div>
  );
};

export default Logo;

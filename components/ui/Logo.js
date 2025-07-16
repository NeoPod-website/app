import React from "react";
import Image from "next/image";

const Logo = ({ width = 40, height = 41, className }) => {
  return (
    <Image
      width={width}
      height={height}
      priority
      src="/neo-pod-logo.svg"
      alt="NeoPod Logo"
      className={className}
    />
  );
};

export const LogoWithText = ({ width = 56, height = 56, className }) => {
  return (
    <div className="flex gap-3 text-white">
      <Image
        priority
        width={width}
        height={height}
        alt="NeoPod Logo"
        className={className}
        src="/neo-pod-logo.svg"
      />

      <div className="hidden xl:block">
        <h2 className="3xl:text-2xl text-xl font-bold text-white">NeoPod</h2>
        <p className="3xl:text-base text-sm">Ambassador Program</p>
      </div>
    </div>
  );
};

export default Logo;

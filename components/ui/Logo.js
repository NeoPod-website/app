import React from "react";
import Image from "next/image";

const Logo = ({ width = 40, height = 41, className }) => {
  return (
    <Image
      priority
      width={width}
      height={height}
      alt="NeoPod Logo"
      className={className}
      src="/neo-pod-logo.svg"
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
        <h2 className="text-xl font-bold text-white 3xl:text-2xl">NeoPod</h2>
        <p className="text-sm 3xl:text-base">Ambassador Program</p>
      </div>
    </div>
  );
};

export default Logo;

import React from "react";

const WrapperContainer = ({ scrollable = false, children, className }) => {
  return (
    <section
      className={`backdrop-blur-xs flex-1 rounded-2.5xl bg-black/50 ${scrollable ? "flex flex-col overflow-hidden" : ""} ${className}`}
    >
      {children}
    </section>
  );
};

export default WrapperContainer;

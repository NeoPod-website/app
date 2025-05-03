import React from "react";

const WrapperContainer = ({ scrollable = false, children, className }) => {
  return (
    <section
      className={`relative flex-1 rounded-2.5xl border-t border-gray-400 bg-black/50 backdrop-blur-xs ${scrollable ? "flex flex-col overflow-hidden" : ""} ${className}`}
    >
      {children}
    </section>
  );
};

export default WrapperContainer;

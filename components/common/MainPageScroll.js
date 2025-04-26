import React from "react";

const MainPageScroll = ({ children, scrollable = true }) => {
  return (
    <section
      className={`flex-1 space-y-5 px-7 pb-7 ${scrollable ? "overflow-auto" : "flex flex-col overflow-hidden"}`}
    >
      {children}
    </section>
  );
};

export default MainPageScroll;

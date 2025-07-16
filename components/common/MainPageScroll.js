import React from "react";

const MainPageScroll = ({ children, scrollable = true }) => {
  return (
    <section
      className={`flex-1 space-y-5 px-3 pb-3 lg:px-5 lg:pb-4 3xl:px-7 3xl:pb-5 ${scrollable ? "overflow-auto" : "flex flex-col overflow-hidden"}`}
    >
      {children}
    </section>
  );
};

export default MainPageScroll;

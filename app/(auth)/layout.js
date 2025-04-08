import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <main className="flex gap-9 p-3">
      <section className="bg-black flex items-center justify-center gap-20">
        {children}
      </section>
      <section className="bg-black"></section>
    </main>
  );
};

export default AuthLayout;

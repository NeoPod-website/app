import React from "react";

import Logo from "@/components/ui/Logo";
import LoginMarquee from "@/components/layout/auth/LoginMarquee";

const AuthLayout = ({ children }) => {
  return (
    <main className="flex gap-8 p-3 w-screen h-screen overflow-hidden bg-dark">
      <section className="bg-black flex items-center justify-center gap-20 flex-1 max-w-[640px] px-16 flex-col rounded-3xl">
        <Logo />

        {children}
      </section>

      <section className="bg-black rounded-3xl flex-[2] overflow-hidden relative">
        <LoginMarquee />

        <div className="absolute rounded-full bg-pink/20 blur-3xl h-[1000px] w-[1000px] top-1/2 -left-1/2 z-0"></div>
        <div className="absolute rounded-full bg-blue/30 blur-3xl h-[1000px] w-[1000px] -top-1/2 left-1/2 z-0"></div>
      </section>
    </main>
  );
};

export default AuthLayout;

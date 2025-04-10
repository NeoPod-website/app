import React from "react";

import Logo from "@/components/ui/Logo";
import LoginMarquee from "@/components/layout/auth/LoginMarquee";

const AuthLayout = ({ children }) => {
  return (
    <main className="flex h-screen w-screen gap-8 overflow-hidden bg-dark p-3">
      <section className="hide-scroll flex w-full flex-1 flex-col items-center justify-start gap-20 overflow-y-scroll rounded-3xl bg-black px-8 py-16 sm:min-h-0 sm:min-w-96 md:max-w-[640px] md:py-20 lg:gap-32 lg:px-12 lg:py-24 xl:gap-40 xl:px-16 xl:py-28 2xl:py-32">
        <Logo />

        {children}
      </section>

      <section className="relative hidden flex-[2] overflow-hidden rounded-3xl bg-black md:block">
        <LoginMarquee />

        <div className="absolute -left-1/2 top-1/2 z-0 h-[1000px] w-[1000px] rounded-full bg-pink/20 blur-3xl"></div>
        <div className="absolute -top-1/2 left-1/2 z-0 h-[1000px] w-[1000px] rounded-full bg-blue/30 blur-3xl"></div>
      </section>
    </main>
  );
};

export default AuthLayout;

"use client";

import React from "react";
import Image from "next/image";
import { Link, Button } from "@heroui/react";

const ContinueWithSocial = () => {
  return (
    <>
      {/* <a
        href="/auth/login?connection=github"
        className="bg-dark text-white p-4"
      >
        Github
      </a>

      <a
        href="/auth/login?connection=google-oauth2"
        className="bg-dark text-white p-4"
      >
        Google
      </a>

      <a
        href="/auth/login?screen_hint=signup"
        className="bg-dark text-white p-4"
      >
        Signup
      </a>

      <Link href="" className="bg-dark text-white p-4">
        Login
      </Link> */}

      <Button
        size="lg"
        as={Link}
        href="/auth/login"
        fullWidth
        variant="bordered"
        className=" bg-dark border-gray-300 gap-2.5"
        startContent={
          <Image width={32} height={32} src="/auth/google.svg" alt="Google" />
        }
      >
        Continue With Social
      </Button>
    </>
  );
};

export default ContinueWithSocial;

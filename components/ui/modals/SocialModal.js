"use client";

import React from "react";
import Image from "next/image";
import { Link, Button } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";

import MainModal from "./MainModal";

import { toggleSocialModal } from "@/redux/slice/modalsSlice";

const SocialModal = () => {
  const dispatch = useDispatch();

  const isOpen = useSelector((state) => state.modals.isSocialModalOpen);

  const handleOnClose = () => {
    dispatch(toggleSocialModal());
  };

  return (
    <MainModal
      title="Continue with Social Login"
      description="Use Google, GitHub, or other providers to quickly access your account — no passwords needed."
      isOpen={isOpen}
      handleOnClose={handleOnClose}
    >
      <Button
        size="lg"
        as={Link}
        href="/auth/login?connection=google-oauth2"
        fullWidth
        variant="bordered"
        className="gap-2.5 border-gray-300 bg-dark"
        startContent={
          <Image
            width={26}
            height={26}
            src="/auth/social/google.svg"
            alt="Google Logo"
          />
        }
      >
        Login with Google
      </Button>

      <Button
        size="lg"
        as={Link}
        href="/auth/login?connection=twitter"
        fullWidth
        variant="bordered"
        className="gap-2.5 border-gray-300 bg-dark"
        startContent={
          <Image
            width={26}
            height={26}
            src="/auth/social/x.svg"
            alt="X (Formally Twitter) Logo"
          />
        }
      >
        Login with Twitter
      </Button>

      <Button
        size="lg"
        as={Link}
        href="/auth/login?connection=discord"
        fullWidth
        variant="bordered"
        className="gap-2.5 border-gray-300 bg-dark"
        startContent={
          <Image
            width={26}
            height={26}
            src="/auth/social/discord.svg"
            alt="Discord Logo"
          />
        }
      >
        Login with Discord
      </Button>

      <Button
        size="lg"
        as={Link}
        href="/auth/login?connection=github"
        fullWidth
        variant="bordered"
        className="gap-2.5 border-gray-300 bg-dark"
        startContent={
          <Image
            width={26}
            height={26}
            src="/auth/social/github.svg"
            alt="Github Logo"
          />
        }
      >
        Login with Github
      </Button>
    </MainModal>
  );
};

export default SocialModal;

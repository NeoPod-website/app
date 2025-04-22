// "use client";

// import {
//   Link,
//   Modal,
//   Button,
//   ModalBody,
//   ModalHeader,
//   ModalContent,
// } from "@heroui/react";
// import React from "react";
// import Image from "next/image";
// import { useDispatch, useSelector } from "react-redux";

// import { toggleSocialModal } from "@/redux/slice/modalsSlice";

// const SocialModal = () => {
//   const dispatch = useDispatch();

//   const isOpen = useSelector((state) => state.modals.isSocialModalOpen);

//   const handleOnClose = () => {
//     dispatch(toggleSocialModal());
//   };

//   return (
//     <>
//       <Modal
//         backdrop="blur"
//         classNames={{
//           body: "p-6",
//           base: "border border-gray-400 bg-black text-white",
//           closeButton: "hover:bg-white/20 p-2 mt-3 mr-3 rounded text-xl",
//         }}
//         isOpen={isOpen}
//         size="2xl"
//         onClose={handleOnClose}
//       >
//         <ModalContent>
//           {(onClose) => (
//             <>
//               <ModalHeader className="flex items-start justify-between">
//                 <div className="max-w-md space-y-2">
//                   <h3 className="text-2xl">Continue with Social Login</h3>

//                   <p className="text-sm font-normal text-gray-100">
//                     Use Google, GitHub, or other providers to quickly access
//                     your account — no passwords needed.
//                   </p>
//                 </div>
//               </ModalHeader>

//               <ModalBody className="mx-auto w-full max-w-md pb-6">
//                 <Button
//                   size="lg"
//                   as={Link}
//                   href="/auth/login?connection=google-oauth2"
//                   fullWidth
//                   variant="bordered"
//                   className="gap-2.5 border-gray-300 bg-dark"
//                   startContent={
//                     <Image
//                       width={26}
//                       height={26}
//                       src="/auth/social/google.svg"
//                       alt="Google Logo"
//                     />
//                   }
//                 >
//                   Login with Google
//                 </Button>

//                 <Button
//                   size="lg"
//                   as={Link}
//                   href="/auth/login?connection=twitter"
//                   fullWidth
//                   variant="bordered"
//                   className="gap-2.5 border-gray-300 bg-dark"
//                   startContent={
//                     <Image
//                       width={26}
//                       height={26}
//                       src="/auth/social/x.svg"
//                       alt="X (Formally Twitter) Logo"
//                     />
//                   }
//                 >
//                   Login with Twitter
//                 </Button>

//                 <Button
//                   size="lg"
//                   as={Link}
//                   href="/auth/login?connection=discord"
//                   fullWidth
//                   variant="bordered"
//                   className="gap-2.5 border-gray-300 bg-dark"
//                   startContent={
//                     <Image
//                       width={26}
//                       height={26}
//                       src="/auth/social/discord.svg"
//                       alt="Discord Logo"
//                     />
//                   }
//                 >
//                   Login with Discord
//                 </Button>

//                 <Button
//                   size="lg"
//                   as={Link}
//                   href="/auth/login?connection=github"
//                   fullWidth
//                   variant="bordered"
//                   className="gap-2.5 border-gray-300 bg-dark"
//                   startContent={
//                     <Image
//                       width={26}
//                       height={26}
//                       src="/auth/social/github.svg"
//                       alt="Github Logo"
//                     />
//                   }
//                 >
//                   Login with Github
//                 </Button>
//               </ModalBody>
//             </>
//           )}
//         </ModalContent>
//       </Modal>
//     </>
//   );
// };

// export default SocialModal;

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

"use client";

import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalContent,
} from "@heroui/react";
import React from "react";

const MainModal = ({
  title,
  isOpen,
  footer,
  children,
  description,
  size = "2xl",
  handleOnClose,
  showFooter = false,
}) => {
  return (
    <>
      <Modal
        size={size}
        isOpen={isOpen}
        backdrop="blur"
        onClose={handleOnClose}
        classNames={{
          body: "p-4 2xl:p-6",
          base: "border border-gray-400 bg-black/80 text-white",
          closeButton: "hover:bg-white/20 p-2 mt-3 mr-3 rounded text-xl",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-start justify-between">
                <div className="max-w-md space-y-2">
                  <h3 className="text-2xl">{title}</h3>

                  <p className="text-sm font-normal text-gray-100">
                    {description}
                  </p>
                </div>
              </ModalHeader>

              <ModalBody className="mx-auto w-full pb-6 pt-2">
                {children}
              </ModalBody>

              {showFooter && (
                <ModalFooter className="flex items-center justify-end gap-2.5 pt-0">
                  {footer}
                </ModalFooter>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default MainModal;

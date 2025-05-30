"use client";

import { Button, Input } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { AlertTriangleIcon, TrashIcon } from "lucide-react";
import React, { useState, useCallback, useEffect } from "react";

import MainModal from "./MainModal";

import {
  clearDeleteModalData,
  toggleDeleteConfirmationModal,
} from "@/redux/slice/modalsSlice";

const DeleteConfirmationModal = () => {
  const dispatch = useDispatch();

  const { isDeleteConfirmationModalOpen, deleteModalData } = useSelector(
    (state) => state.modals,
  );

  const [confirmText, setConfirmText] = useState("");
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const {
    itemName = "",
    itemType = "item",
    isDeleting = false,
    onConfirmDelete = () => {},
  } = deleteModalData || {};

  const expectedConfirmText = "confirm";
  const isConfirmTextValid = confirmText.toLowerCase() === expectedConfirmText;

  const handleOnClose = useCallback(() => {
    if (!isDeleting) {
      dispatch(toggleDeleteConfirmationModal());
      dispatch(clearDeleteModalData());

      setConfirmText("");
      setHasAttemptedSubmit(false);
    }
  }, [dispatch, isDeleting]);

  const handleConfirmDelete = useCallback(
    async (e) => {
      e.preventDefault();

      setHasAttemptedSubmit(true);

      if (isConfirmTextValid && onConfirmDelete) {
        await onConfirmDelete();

        dispatch(toggleDeleteConfirmationModal());
        dispatch(clearDeleteModalData());

        setConfirmText("");
        setHasAttemptedSubmit(false);
      }
    },
    [isConfirmTextValid, onConfirmDelete, dispatch],
  );

  const handleInputChange = useCallback(
    (e) => {
      setConfirmText(e.target.value);
      if (hasAttemptedSubmit) {
        setHasAttemptedSubmit(false);
      }
    },
    [hasAttemptedSubmit],
  );

  // Reset form when modal opens
  useEffect(() => {
    if (isDeleteConfirmationModalOpen) {
      setConfirmText("");
      setHasAttemptedSubmit(false);
    }
  }, [isDeleteConfirmationModalOpen]);

  // Dynamic content based on item type
  const getWarningContent = () => {
    switch (itemType) {
      case "pod":
        return {
          title: `Delete Pod: ${itemName}`,
          warning:
            "This action will permanently delete this pod and ALL associated data:",
          consequences: [
            "All categories within this pod",
            "All quests within this pod",
            "All submissions and user progress",
            "All rewards and points earned",
            "All analytics and historical data",
          ],
          description:
            "This pod and everything inside it will be completely removed from the system.",
        };
      case "category":
        return {
          title: `Delete Category: ${itemName}`,
          warning:
            "This action will permanently delete this category and ALL associated data:",
          consequences: [
            "All quests within this category",
            "All submissions and user progress for these quests",
            "All rewards and points earned from these quests",
            "All analytics and historical data for this category",
          ],
          description:
            "This category and all its quests will be completely removed from the system.",
        };
      case "quest":
        return {
          title: `Delete Quest: ${itemName}`,
          warning:
            "This action will permanently delete this quest and ALL associated data:",
          consequences: [
            "All user submissions for this quest",
            "All user progress and completion status",
            "All rewards and points earned from this quest",
            "All analytics and historical data for this quest",
          ],
          description:
            "This quest and all related user data will be completely removed from the system.",
        };
      default:
        return {
          title: `Delete ${itemName}`,
          warning:
            "This action will permanently delete this item and its associated data.",
          consequences: [],
          description: "This action cannot be undone.",
        };
    }
  };

  const content = getWarningContent();

  return (
    <MainModal
      size="2xl"
      description=""
      title={content.title}
      hideCloseButton={isDeleting}
      handleOnClose={handleOnClose}
      isOpen={isDeleteConfirmationModalOpen}
    >
      <form onSubmit={handleConfirmDelete} className="space-y-6">
        <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
          <AlertTriangleIcon
            size={24}
            className="mt-0.5 flex-shrink-0 text-red-500"
          />
          <div className="space-y-3">
            <p className="text-sm font-medium text-red-400">
              {content.warning}
            </p>

            {content.consequences.length > 0 && (
              <ul className="ml-4 space-y-1 text-sm text-red-300">
                {content.consequences.map((consequence, index) => (
                  <li key={index} className="list-disc">
                    {consequence}
                  </li>
                ))}
              </ul>
            )}

            <p className="text-sm font-medium text-red-300">
              {content.description}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="mb-2 text-sm text-gray-300">
              To confirm deletion, type{" "}
              <span className="font-mono font-bold text-red-400">confirm</span>{" "}
              below:
            </p>

            <Input
              size="lg"
              type="text"
              variant="bordered"
              value={confirmText}
              className="bg-dark"
              disabled={isDeleting}
              onChange={handleInputChange}
              placeholder="Type 'confirm' to proceed"
              classNames={{
                inputWrapper: `border-gray-300 rounded-lg focus-within:!border-gray-300 focus-within:!ring-gray-300 focus-within:!ring-1 hover:!bg-black data-[hover=true]:!bg-black ${
                  hasAttemptedSubmit && !isConfirmTextValid
                    ? "!border-red-500 focus-within:!border-red-500"
                    : ""
                }`,
                input: "placeholder:text-gray-400",
              }}
            />

            {hasAttemptedSubmit && !isConfirmTextValid && (
              <p className="mt-1 text-xs text-red-400">
                Please type "confirm" exactly as shown to proceed with deletion.
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            size="lg"
            type="button"
            variant="bordered"
            disabled={isDeleting}
            onPress={handleOnClose}
            className="flex-1 border-gray-300 bg-transparent text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </Button>

          <Button
            size="lg"
            type="submit"
            color="danger"
            isLoading={isDeleting}
            disabled={!isConfirmTextValid || isDeleting}
            startContent={!isDeleting ? <TrashIcon size={16} /> : null}
            className="flex-1 bg-red-600 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting
              ? "Deleting..."
              : `Delete ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}`}
          </Button>
        </div>
      </form>
    </MainModal>
  );
};

export default DeleteConfirmationModal;

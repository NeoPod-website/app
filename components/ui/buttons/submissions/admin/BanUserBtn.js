"use client";

import React, { useState } from "react";
import { Ban, CheckCircle } from "lucide-react";
import { Button, Tooltip } from "@heroui/react";

import SuspendAmbassadorModal from "@/components/ui/modals/SuspendAmbassadorModal";
import UnsuspendAmbassadorModal from "@/components/ui/modals/UnsuspendAmbassadorModal";

const BanSubmissionBtn = ({ submission, onSubmissionUpdate }) => {
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showUnsuspendModal, setShowUnsuspendModal] = useState(false);

  // Check if ambassador is already suspended
  const isSuspended = submission?.ambassador_data?.status === "suspended";

  const handleSuspendSuccess = (updatedAmbassador) => {
    setShowSuspendModal(false);

    // Update submission with suspended ambassador
    if (onSubmissionUpdate && typeof onSubmissionUpdate === "function") {
      const updatedSubmission = {
        ...submission,
        ambassador_data: updatedAmbassador,
      };
      onSubmissionUpdate(updatedSubmission);
    }
  };

  const handleUnsuspendSuccess = (updatedAmbassador) => {
    setShowUnsuspendModal(false);

    // Update submission with unsuspended ambassador
    if (onSubmissionUpdate && typeof onSubmissionUpdate === "function") {
      const updatedSubmission = {
        ...submission,
        ambassador_data: updatedAmbassador,
      };
      onSubmissionUpdate(updatedSubmission);
    }
  };

  if (isSuspended) {
    return (
      <>
        <Tooltip content="Unsuspend Ambassador">
          <Button
            variant="flat"
            onPress={() => setShowUnsuspendModal(true)}
            className="flex h-8 items-center gap-1 rounded-lg bg-green-500/10 !px-3 !py-1 text-sm text-green-400 transition-colors hover:bg-green-500/20 hover:text-green-300"
          >
            <CheckCircle size={16} />
            Unban
          </Button>
        </Tooltip>

        <UnsuspendAmbassadorModal
          isOpen={showUnsuspendModal}
          podId={submission?.pod_id}
          onSuccess={handleUnsuspendSuccess}
          ambassador={submission?.ambassador_data}
          onClose={() => setShowUnsuspendModal(false)}
        />
      </>
    );
  }

  return (
    <>
      <Tooltip content="Suspend Ambassador">
        <Button
          variant="flat"
          onPress={() => setShowSuspendModal(true)}
          className="flex h-8 items-center gap-1 rounded-lg bg-red-500/10 !px-3 !py-1 text-sm text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300"
        >
          <Ban size={16} />
          Ban
        </Button>
      </Tooltip>

      <SuspendAmbassadorModal
        isOpen={showSuspendModal}
        podId={submission?.pod_id}
        onSuccess={handleSuspendSuccess}
        ambassador={submission?.ambassador_data}
        onClose={() => setShowSuspendModal(false)}
      />
    </>
  );
};

export default BanSubmissionBtn;

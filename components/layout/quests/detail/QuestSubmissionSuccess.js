"use client";

import React from "react";
import { Button } from "@heroui/react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { CheckCircleIcon, ArrowRightIcon } from "lucide-react";
import { clearQuestSubmitted } from "@/redux/slice/submissionSlice";

import WrapperContainer from "@/components/common/WrapperContainer";

const QuestSubmissionSuccess = ({ quest }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const onContinueExploring = () => {
    router.push(`/quests/${quest.category_id}`);
    dispatch(clearQuestSubmitted({ questId: quest.quest_id }));
  };

  return (
    <WrapperContainer scrollable className="max-w-4.5xl flex-[2] p-6 3xl:p-10">
      <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-green-500/30 bg-green-500/20">
          <CheckCircleIcon size={40} className="text-green-400" />
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white">
            "{quest.name}" Submitted Successfully!
          </h2>

          <p className="max-w-lg text-base text-gray-200">
            Your quest submission is now being reviewed. You'll receive a
            notification once it's processed.
          </p>

          <div className="bg-blue-500/10 rounded-lg border border-blue-500/30 p-4">
            <p className="text-sm text-blue-200">
              💡 Continue exploring other quests while we review your
              submission!
            </p>
          </div>
        </div>

        <Button
          size="lg"
          radius="full"
          onPress={onContinueExploring}
          endContent={<ArrowRightIcon size={16} />}
          className="flex items-center gap-2 rounded-full border border-white bg-gradient-primary px-8 py-3 text-white"
        >
          Continue Exploring
        </Button>

        <div className="mt-4 space-y-1 text-sm text-gray-200">
          <p>
            Quest: <span className="text-gray-100">{quest.name}</span>
          </p>

          <p>
            Submitted:{" "}
            <span className="text-gray-100">{new Date().toDateString()}</span>
          </p>
        </div>
      </div>
    </WrapperContainer>
  );
};

export default QuestSubmissionSuccess;

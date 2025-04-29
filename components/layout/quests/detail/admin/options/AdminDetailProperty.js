"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import AdminQuestCooldown from "./AdminQuestCooldown";
import AdminSelectRewards from "./AdminSelectRewards";
import AdminSelectCategory from "./AdminSelectCategory";
import AdminDetailCondition from "./AdminDetailCondition";
import AdminQuestRecurrence from "./AdminQuestRecurrence";
import AdminDetailClaimLimit from "./AdminDetailClaimLimit";

import { setCurrentQuest } from "@/redux/slice/questSlice";

const AdminDetailProperty = ({
  quest = {
    limit: 100,
  },
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (quest) {
      dispatch(setCurrentQuest(quest));
    }
  }, [quest, dispatch]);

  return (
    <section className="hide-scroll space-y-8 overflow-auto">
      <AdminSelectCategory />

      <section className="space-y-6">
        <h3 className="text-2xl font-bold">Properties</h3>

        <div className="space-y-6">
          <AdminQuestRecurrence />
          <AdminQuestCooldown />
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-2xl font-bold">Additional Properties</h3>

        <div className="space-y-4">
          <AdminDetailClaimLimit />
          <AdminSelectRewards />
          <AdminDetailCondition />
        </div>
      </section>
    </section>
  );
};

export default AdminDetailProperty;

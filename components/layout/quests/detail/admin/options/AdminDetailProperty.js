"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import AdminQuestStatus from "./properties/AdminQuestStatus";
import AdminQuestDueDate from "./properties/AdminQuestDueDate";
import AdminQuestCooldown from "./properties/AdminQuestCooldown";
import AdminSelectRewards from "./properties/AdminSelectRewards";
import AdminSelectCategory from "./properties/AdminSelectCategory";
import AdminSelectCondition from "./properties/AdminSelectCondition";
import AdminQuestRecurrence from "./properties/AdminQuestRecurrence";
import AdminQuestClaimLimit from "./properties/AdminQuestClaimLimit";

import { setCurrentQuest } from "@/redux/slice/questSlice";

const AdminDetailProperty = ({ podId, categoryId, quest }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (quest) {
      dispatch(setCurrentQuest(quest));
    }
  }, []);

  return (
    <section className="hide-scroll space-y-8 overflow-auto">
      <AdminSelectCategory podId={podId} categoryId={categoryId} />

      <section className="space-y-6">
        <h3 className="text-2xl font-bold">Properties</h3>

        <div className="space-y-6">
          <AdminQuestRecurrence />
          <AdminQuestCooldown />
          <AdminQuestStatus />
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-2xl font-bold">Additional Properties</h3>

        <div className="space-y-4">
          <AdminQuestDueDate />
          <AdminQuestClaimLimit />
          <AdminSelectRewards />
          <AdminSelectCondition />
        </div>
      </section>
    </section>
  );
};

export default AdminDetailProperty;

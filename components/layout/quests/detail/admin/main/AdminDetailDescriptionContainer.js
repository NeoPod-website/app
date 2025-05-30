import React from "react";

import AdminTasksList from "../tasks/AdminTasksList";
import AdminDetailHeading from "./AdminDetailHeading";
import AdminDetailDescriptionEditor from "./AdminDetailDescriptionEditor";

import AdminAddTasks from "@/components/ui/buttons/quest/admin/AdminAddTasks";

const AdminDetailDescriptionContainer = ({
  name,
  isNew,
  tasks,
  description,
}) => {
  return (
    <>
      <div className="hide-scroll relative flex-1 overflow-auto">
        <AdminDetailHeading isNew={isNew} name={name} />

        <AdminDetailDescriptionEditor description={description} />

        <h2 className="mb-4 text-2xl font-bold">Tasks</h2>
        <div className="relative">
          <AdminTasksList tasks={tasks} />
        </div>
      </div>

      <AdminAddTasks />
    </>
  );
};

export default AdminDetailDescriptionContainer;

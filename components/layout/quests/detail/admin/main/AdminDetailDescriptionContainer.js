import AdminTasksList from "../tasks/AdminTasksList";
import AdminDetailDescriptionEditor from "./AdminDetailDescriptionEditor";

import AdminAddTasks from "@/components/ui/buttons/quest/admin/AdminAddTasks";

const AdminDetailDescriptionContainer = ({ title, tasks }) => {
  return (
    <>
      <div className="hide-scroll relative flex-1 overflow-auto">
        <h1 className="mb-6 text-3xl font-bold">{title}</h1>

        <h2 className="mb-4 text-2xl font-bold">Description</h2>
        <AdminDetailDescriptionEditor />

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

import { redirect } from "next/navigation";

const ManagePage = () => {
  redirect("/admin/manage/admins");
};

export default ManagePage;

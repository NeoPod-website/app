import { redirect } from "next/navigation";

const ManagePage = () => {
  redirect("/admin/manage/pods");
};

export default ManagePage;

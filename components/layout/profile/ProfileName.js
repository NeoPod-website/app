import React from "react";

const ProfileName = ({ user }) => {
  return (
    <div>
      <h1 className="text-xl font-bold capitalize leading-tight text-white lg:text-2xl 2xl:text-3xl">
        {user?.username || "Anonymous User"}
      </h1>

      <p className="text-sm lowercase text-gray-400 lg:text-base">
        {user?.email || "No email provided"}
      </p>
    </div>
  );
};

export default ProfileName;

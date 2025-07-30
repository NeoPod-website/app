import React from "react";

const ProfileName = ({ user }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold leading-tight text-white sm:text-2xl md:text-3xl">
        {user?.username || "Anonymous User"}
      </h1>

      <p className="text-base text-gray-400 sm:text-base">
        {user?.email || "No email provided"}
      </p>
    </div>
  );
};

export default ProfileName;

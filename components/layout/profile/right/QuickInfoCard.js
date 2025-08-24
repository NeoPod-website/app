import React from "react";

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-200">{label}</span>
    <span className="font-medium text-white">{value}</span>
  </div>
);

const QuickInfoCard = ({ user }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";

    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const formatLastActive = (dateString) => {
    if (!dateString) return "No activity";
    return new Date(dateString).toLocaleDateString();
  };

  const infoItems = [
    { label: "Valid Invites", value: user?.valid_invite_count || 0 },
    { label: "Member Since", value: formatDate(user?.joining_date) },
    {
      label: "Last Active",
      value: formatLastActive(user?.last_quest_completed),
    },
  ];

  return (
    <div className="rounded-lg border border-gray-400 bg-gradient-dark p-6">
      <h3 className="mb-4 font-semibold text-white">Quick Info</h3>

      <div className="space-y-3">
        {infoItems.map((item, index) => (
          <InfoRow key={index} label={item.label} value={item.value} />
        ))}
      </div>
    </div>
  );
};

export default QuickInfoCard;

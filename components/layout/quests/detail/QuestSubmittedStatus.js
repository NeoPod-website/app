const QuestSubmittedStatus = ({ submission }) => {
  const getStatusConfig = () => {
    switch (submission.review_status) {
      case "pending":
        return {
          title: "Quest Submitted Successfully! 🎯",
          message:
            "Your submission is being reviewed by our team. You'll receive a notification once it's processed.",
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-500/30",
          iconColor: "text-yellow-400",
          icon: "⏳",
        };

      case "approved":
        return {
          title: "Quest Completed! 🎉",
          message:
            "Congratulations! Your submission has been approved and you've earned your rewards.",
          bgColor: "bg-green-500/10",
          borderColor: "border-green-500/30",
          iconColor: "text-green-400",
          icon: "✅",
        };

      case "rejected":
        return {
          title: "Quest Needs Revision 📝",
          message:
            "Your submission was reviewed but needs some improvements. Check your feedback and try again!",
          bgColor: "bg-red-500/10",
          borderColor: "border-red-500/30",
          iconColor: "text-red-400",
          icon: "❌",
        };

      case "highlighted":
        return {
          title: "Outstanding Work! ⭐",
          message:
            "Amazing! Your submission has been highlighted as exceptional work. Great job!",
          bgColor: "bg-orange-500/10",
          borderColor: "border-orange-500/30",
          iconColor: "text-orange-400",
          icon: "🌟",
        };

      case "in_progress":
        return {
          title: "Under Review 👀",
          message:
            "Your submission is currently being reviewed. We'll notify you once the review is complete.",
          bgColor: "bg-purple-500/10",
          borderColor: "border-purple-500/30",
          iconColor: "text-purple-400",
          icon: "🔍",
        };

      default:
        return {
          title: "Quest Submitted ✓",
          message:
            "Your submission has been received and is in our review queue.",
          bgColor: "bg-gray-500/10",
          borderColor: "border-gray-500/30",
          iconColor: "text-gray-400",
          icon: "📋",
        };
    }
  };

  const config = getStatusConfig();

  const submittedDate = new Date(submission.submitted_at).toLocaleDateString();
  const reviewedDate = submission.reviewed_at
    ? new Date(submission.reviewed_at).toLocaleDateString()
    : null;

  return (
    <div
      className={`rounded-2xl border p-8 ${config.bgColor} ${config.borderColor}`}
    >
      <div className="space-y-4 text-center">
        <div className="text-6xl">{config.icon}</div>

        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white">{config.title}</h3>
          <p className="mx-auto max-w-md text-gray-200">{config.message}</p>
        </div>

        <div className="space-y-3 pt-4">
          <div className="flex justify-center gap-8 text-sm">
            <div className="text-center">
              <p className="text-gray-300">Submitted</p>
              <p className="font-medium text-white">{submittedDate}</p>
            </div>

            {reviewedDate && (
              <div className="text-center">
                <p className="text-gray-300">Reviewed</p>
                <p className="font-medium text-white">{reviewedDate}</p>
              </div>
            )}
          </div>

          {submission.review_comment && (
            <div className="mt-4 rounded-lg border border-gray-600 bg-gray-800/50 p-4">
              <p className="mb-1 text-sm text-gray-400">Feedback:</p>

              <p className="text-sm italic text-white">
                "{submission.review_comment}"
              </p>
            </div>
          )}

          {submission.rewards && submission.rewards.length > 0 && (
            <div className="mt-4 rounded-lg border border-green-500/20 bg-green-500/5 p-4">
              <p className="mb-2 text-sm text-green-400">🎁 Rewards Earned:</p>

              <div className="flex flex-wrap justify-center gap-2">
                {submission.rewards.map((reward, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-300"
                  >
                    {reward.amount} {reward.type?.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestSubmittedStatus;

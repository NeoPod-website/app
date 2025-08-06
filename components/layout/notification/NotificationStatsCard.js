const NotificationStatsCard = ({ label, value, icon, color }) => (
  <div className="relative overflow-hidden rounded-2xl border border-gray-400 bg-gradient-dark p-6 backdrop-blur-sm transition-transform duration-300">
    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5`} />

    <div className="relative flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-200">{label}</p>
        <p className="mt-1 text-2xl font-bold text-white">{value}</p>
      </div>

      <div className="text-2xl">{icon}</div>
    </div>
  </div>
);

export default NotificationStatsCard;

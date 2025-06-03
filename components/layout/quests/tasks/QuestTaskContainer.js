import React from "react";
import { GripVertical } from "lucide-react";

const QuestTaskContainer = ({
  icon,
  color,
  text,
  children,
  isAdmin = true,
}) => {
  return (
    <section className="task-item">
      <div className="flex items-center gap-2">
        {isAdmin && (
          <div className="ml-12">
            <GripVertical className="task-drag-indicator hidden" size={16} />
          </div>
        )}

        <section className="relative flex-1">
          <div
            style={{ backgroundColor: color }}
            className="flex w-fit items-center gap-1 rounded-t-lg px-3 py-1 text-xs uppercase"
          >
            {icon} {text}
          </div>

          {children}
        </section>
      </div>
    </section>
  );
};

export default QuestTaskContainer;

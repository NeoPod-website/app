"use client";

import { v4 as uuidv4 } from "uuid";
import { Reorder, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback, useRef } from "react";
import { GripVertical, ChevronUp, ChevronDown } from "lucide-react";

import AdminMainTask from "./AdminMainTask";
import AdminVisitLinkTask from "./AdminVisitLinkTask";
import AdminFileUploadTask from "./AdminFileUploadTask";

import AdminTwitterTask from "./social/AdminTwitterTask";
import AdminDiscordTask from "./social/AdminDiscordTask";
import AdminTelegramTask from "./social/AdminTelegramTask";

import AdminNFTTokenTask from "./onChain/AdminNFTTokenTask";

import {
  setCurrentQuest,
  reorderCurrentQuestTasks,
} from "@/redux/slice/questSlice";

import { useAutoScroll } from "@/hooks/useAutoScroll";

import styles from "./admin-tasks-list.module.css";

const AdminTasksList = ({ tasks: initialTasks = [] }) => {
  const dispatch = useDispatch();

  const containerRef = useRef(null);

  const [draggedItem, setDraggedItem] = useState(null);
  const [tasksWithIds, setTasksWithIds] = useState([]);
  const [initialized, setInitialized] = useState(false);

  useAutoScroll({ scrollContainer: containerRef });

  const currentTasks = useSelector((state) => state.quest.currentQuest.tasks);

  useEffect(() => {
    if (initialTasks.length > 0) {
      const processedTasks = initialTasks.map((task) =>
        task.id
          ? task
          : {
              ...task,
              id: uuidv4(),
              instruction: task.instruction || "",
              description: task.description || "",
              answer: task.answer || "",
            },
      );

      setTasksWithIds(processedTasks);

      if (!initialized) {
        dispatch(setCurrentQuest({ tasks: processedTasks }));
        setInitialized(true);
      }
    }
  }, [initialTasks, initialized, dispatch]);

  const handleReorder = useCallback(
    (newOrder) => {
      for (let i = 0; i < newOrder.length; i++) {
        const originalIndex = currentTasks.findIndex(
          (t) => t.id === newOrder[i].id,
        );

        if (originalIndex !== i) {
          dispatch(
            reorderCurrentQuestTasks({
              sourceIndex: originalIndex,
              destinationIndex: i,
            }),
          );

          break;
        }
      }
    },
    [currentTasks, dispatch],
  );

  const handleMoveUp = useCallback(
    (index) => {
      if (index > 0) {
        dispatch(
          reorderCurrentQuestTasks({
            sourceIndex: index,
            destinationIndex: index - 1,
          }),
        );
      }
    },
    [dispatch],
  );

  const handleMoveDown = useCallback(
    (index) => {
      if (index < currentTasks.length - 1) {
        dispatch(
          reorderCurrentQuestTasks({
            sourceIndex: index,
            destinationIndex: index + 1,
          }),
        );
      }
    },
    [dispatch, currentTasks.length],
  );

  const renderTaskComponent = useCallback((task, index) => {
    switch (task.name) {
      case "url":
        return <AdminMainTask index={index} task={task} />;
      case "text":
        return <AdminMainTask index={index} task={task} />;
      case "number":
        return <AdminMainTask index={index} task={task} />;
      case "file-upload":
        return <AdminFileUploadTask index={index} task={task} />;
      case "link":
        return <AdminVisitLinkTask index={index} task={task} />;
      case "nft":
        return <AdminNFTTokenTask index={index} task={task} />;
      case "token":
        return <AdminNFTTokenTask index={index} task={task} />;
      case "x":
        return <AdminTwitterTask index={index} task={task} />;
      case "discord":
        return <AdminDiscordTask index={index} task={task} />;
      case "telegram":
        return <AdminTelegramTask index={index} task={task} />;
      default:
        return <AdminMainTask index={index} task={task} />;
    }
  }, []);

  const getTaskTypeName = (task) => {
    switch (task.name) {
      case "url":
        return "URL Task";
      case "text":
        return "Text Task";
      case "number":
        return "Number Task";
      case "file-upload":
        return "File Upload";
      case "link":
        return "Visit Link";
      case "nft":
        return "NFT Task";
      case "token":
        return "Token Task";
      case "x":
        return "Twitter Task";
      case "discord":
        return "Discord Task";
      case "telegram":
        return "Telegram Task";
      default:
        return "Task";
    }
  };

  const tasksToRender = initialized ? [...currentTasks] : tasksWithIds;

  return (
    <div className="mb-4">
      <div
        ref={containerRef}
        className="hide-scroll relative flex-1 overflow-auto"
      >
        {tasksToRender.length > 0 ? (
          <Reorder.Group
            as="div"
            axis="y"
            values={tasksToRender}
            onReorder={handleReorder}
            className="space-y-4"
          >
            {tasksToRender.map((task, index) => {
              const isBeingDragged = draggedItem?.id === task.id;
              const isFirstTask = index === 0;
              const isLastTask = index === tasksToRender.length - 1;

              return (
                <Reorder.Item
                  as="div"
                  key={index}
                  value={task}
                  className={styles.taskItem}
                  data-dragging={isBeingDragged}
                  onDragStart={() => setDraggedItem({ id: task.id, index })}
                  onDragEnd={() => setDraggedItem(null)}
                  layoutId={task.id}
                >
                  <div
                    className={`${styles.dropIndicator} ${styles.dropIndicatorTop} ${
                      draggedItem && draggedItem.index > index
                        ? styles.dropIndicatorVisible
                        : ""
                    }`}
                  />

                  <div className="relative">
                    <div className={styles.dragHandle}>
                      <GripVertical size={18} />
                    </div>

                    <div className={styles.chevronControls}>
                      <button
                        type="button"
                        onClick={() => handleMoveUp(index)}
                        disabled={isFirstTask}
                        className={`text-gray-100 hover:text-white ${isFirstTask ? "cursor-not-allowed text-gray-400" : ""}`}
                        title="Move task up"
                      >
                        <ChevronUp size={20} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMoveDown(index)}
                        disabled={isLastTask}
                        className={`text-gray-100 hover:text-white ${isLastTask && "cursor-not-allowed text-gray-400"}`}
                        title="Move task down"
                      >
                        <ChevronDown size={20} />
                      </button>
                    </div>

                    {isBeingDragged ? (
                      <motion.div
                        className={styles.dragPreview}
                        initial={{ opacity: 0.9 }}
                        animate={{ opacity: 1 }}
                      >
                        <div className="font-medium">
                          {getTaskTypeName(task)}
                        </div>
                        <div className="truncate text-sm">
                          {task.instruction || "No instruction"}
                        </div>
                      </motion.div>
                    ) : (
                      renderTaskComponent(task, index)
                    )}
                  </div>

                  <div
                    className={`${styles.dropIndicator} ${styles.dropIndicatorBottom} ${
                      draggedItem && draggedItem.index < index
                        ? styles.dropIndicatorVisible
                        : ""
                    }`}
                  />
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        ) : (
          <div className={styles.emptyState}>
            <p className="text-gray-300">
              No tasks available. Add tasks to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTasksList;

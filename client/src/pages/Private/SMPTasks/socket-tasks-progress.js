import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { SOCKET_IO_CONNECTION } from "../../../constants";
import { getDocumentId } from "../../../utils/toTitleCase";

// Single socket connection
const socket = io(SOCKET_IO_CONNECTION, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 3,
  reconnectionDelay: 1000,
});

export const useTaskProgressSocket = (
  { tasks = [], userId },
  updateTaskProgress
) => {
  const taskIntervalsRef = useRef({});

  useEffect(() => {
    if (!tasks.length || !userId) return;

    const handleTaskProgress = (data) => {
      const { taskId, progress, status } = data;

      updateTaskProgress(taskId, { progress, status });

      // 🛑 If completed, clear polling for that task
      if (progress === 100 || status === "completed") {
        if (taskIntervalsRef.current[taskId]) {
          clearInterval(taskIntervalsRef.current[taskId]);
          delete taskIntervalsRef.current[taskId];
        }
      }
    };

    socket.on("task-progress", handleTaskProgress);

    tasks.forEach((task) => {
      const taskId = getDocumentId(task);
      if (task?.status === "processing" && taskId) {
        if (!taskIntervalsRef.current[taskId]) {
          // ✅ Poll the backend every 3 seconds
          const interval = setInterval(() => {
            socket.emit("check-task-progress", { taskId, userId });
          }, 3000); // 🔥 Fixed 3000 ms

          taskIntervalsRef.current[taskId] = interval;
        }
      }
    });

    // Cleanup on unmount
    return () => {
      socket.off("task-progress", handleTaskProgress);

      // Clear all active intervals
      Object.values(taskIntervalsRef.current).forEach(clearInterval);
      taskIntervalsRef.current = {};
    };
  }, [tasks, userId, updateTaskProgress]);
};

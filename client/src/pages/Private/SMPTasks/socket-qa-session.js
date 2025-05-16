import { io } from "socket.io-client";
import { SOCKET_IO_CONNECTION } from "../../../constants";

// Initialize socket connection and handle session data
export const handleSessionData = (taskId, userId, socketRef, setState) => {
  setState((prevState) => ({
    ...prevState,
    isLoading: true,
    error: null,
  }));

  const socketInstance = io(SOCKET_IO_CONNECTION, {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 3,
    reconnectionDelay: 1000,
  });

  // Event handler for when room is joined
  const handleRoomJoined = () => {
    socketInstance.emit("start-smp-qa-session", { taskId, userId });
  };

  // Event handler for receiving QA session data
  const handleQASession = (data) => {
    setState((prevState) => ({
      ...prevState,
      isLoading: false,
    }));

    if (data.status === "completed") {
      setState((prevState) => ({
        ...prevState,
        sessionStatus: "completed",
      }));
      return;
    }

    if (data.question) {
      setState((prevState) => ({
        ...prevState,
        question: data.question,
        sessionStatus: "active",
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        error: "Question not found. Please retry.",
      }));
    }
  };

  // Error handler for socket issues
  const handleError = (error) => {
    setState((prevState) => ({
      ...prevState,
      error:
        "We're having trouble connecting. Please check your internet connection and try again.",
      isLoading: false,
    }));
    console.error(error);
  };

  // Disconnect handler
  const handleDisconnect = () => {
    setState((prevState) => ({
      ...prevState,
      error: "Connection lost. Please retry.",
      isLoading: false,
    }));
  };

  // Register socket events
  socketInstance.on("room-joined", handleRoomJoined);
  socketInstance.on("smp-qa-session", handleQASession);
  socketInstance.on("smp-qa-session-error", handleError);
  socketInstance.on("disconnect", handleDisconnect);

  socketInstance.emit("join-task-room", { taskId, userId });

  socketRef.current = socketInstance;

  return socketInstance;
};

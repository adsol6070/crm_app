import React, { createContext, useContext } from "react";
import SocketManager from "../../socket";

const socketUrl = "http://192.168.1.9:8000";
const socketManager = SocketManager.getInstance(socketUrl);

const SocketContext = createContext<SocketManager | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <SocketContext.Provider value={socketManager}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

import { io, Socket } from "socket.io-client";

class SocketManager {
  private static instance: SocketManager;
  private socket: Socket | null = null;
  private token: string | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor(private url: string) {
    this.connect();
  }

  public static getInstance(url: string): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager(url);
    }
    return SocketManager.instance;
  }

  private connect() {
    if (!this.socket) {
      this.socket = io(this.url, {
        transports: ["websocket"],
        autoConnect: false,
        auth: {
          token: this.token,
        },
      });

      this.socket.on("connect", () => {
        console.log("Socket connected:", this.socket?.id);
        this.socket?.emit("authenticate");
        this.startHeartbeat();
      });

      this.socket.on("disconnect", () => {
        console.log("Socket disconnected");
        this.stopHeartbeat();
      });

      this.socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      this.socket.on("ping", () => {
        console.log("Ping received from server");
      });

      this.socket.on("pong", (latency) => {
        console.log("Pong received from server, latency:", latency);
      });
    }
  }

  public connectSocket() {
    if (this.socket) {
      this.socket.connect();
    }
  }

  public disconnectSocket() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  public updateToken(token: string) {
    this.token = token;
    if (this.socket) {
      this.socket.auth = { token };
      this.socket.disconnect();
      this.socket.connect();
    }
  }

  public on(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  public off(event: string, callback?: (data: any) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  public emit(event: string, data?: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  public getSocket() {
    return this.socket;
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.socket && !this.socket.connected) {
        console.log("Socket not connected, attempting to reconnect...");
        this.socket.connect();
      }
    }, 5000);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
}

export default SocketManager;

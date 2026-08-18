import { Client } from "@stomp/stompjs";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

let client: Client | null = null;

function buildWebSocketUrl(): string {
  return `${API_BASE_URL?.replace(/^http/, "ws")}/ws/websocket`;
}

export function connectChatSocket(
  userId: number,
  onMessage: (body: string) => void,
  onStatusChange?: (connected: boolean) => void,
): void {
  if (client) {
    client.deactivate();
  }

  client = new Client({
    webSocketFactory: () => new WebSocket(buildWebSocketUrl()),
    reconnectDelay: 5000,
    heartbeatIncoming: 0,
    heartbeatOutgoing: 0,
    onConnect: () => {
      client?.subscribe(`/topic/users/${userId}`, (frame) => {
        onMessage(frame.body);
      });
      onStatusChange?.(true);
    },
    onWebSocketClose: () => {
      onStatusChange?.(false);
    },
    onStompError: (frame) => {
      console.warn("STOMP error:", frame.headers["message"]);
    },
  });

  client.activate();
}

export function disconnectChatSocket(): void {
  client?.deactivate();
  client = null;
}
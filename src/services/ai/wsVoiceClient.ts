type VoiceEvents = {
  onMessage?: (text: string) => void;
  onClose?: () => void;
  onError?: (err: unknown) => void;
};

export class WsVoiceClient {
  private socket: WebSocket | null = null;

  connect(url: string, events: VoiceEvents = {}) {
    this.socket?.close();
    this.socket = new WebSocket(url);

    this.socket.onmessage = (evt) => events.onMessage?.(String(evt.data));
    this.socket.onerror = (err) => events.onError?.(err);
    this.socket.onclose = () => events.onClose?.();
  }

  send(text: string) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    this.socket.send(text);
  }

  close() {
    this.socket?.close();
  }
}

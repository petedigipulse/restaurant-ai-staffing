export interface RealtimePort {
  publish<T>(channel: string, event: string, payload: T): Promise<void>;
}



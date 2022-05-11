import { EventType } from "../enums";

export interface MessageData {
  type?: EventType,
  options?: Record<string, any>
};

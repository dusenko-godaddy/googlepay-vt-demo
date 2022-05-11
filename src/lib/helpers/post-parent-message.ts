import { EventType } from "../enums";

/**
 * Posts a message to the parent window.
 * @param payload
 */
export function postParentMessage(eventType: EventType, data?: any, port?: MessagePort | null) {
  // console.log("postParentMessage", eventType, data);
  // must convert everything to string when postMessaging if not you'll
  // get DataCloneError https://stackoverflow.com/questions/27558398/datacloneerror-the-object-could-not-be-cloned-in-firefox-34

  const message = JSON.stringify({
    type: eventType,
    data: data || {},
  });

  if (port) {
    port.postMessage(message);
  } else {
    window.parent.postMessage(message, "*");
  }
}

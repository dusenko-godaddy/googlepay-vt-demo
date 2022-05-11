import { postParentMessage } from "../../lib/helpers/post-parent-message";
import { EventType } from "../../lib/enums";

describe("PostParentMessage Helper Test Suite", () => {
  jest.spyOn(window, "postMessage");

  it("postParentMessage calls postMessage method with event type and empty data object if data not passed in", () => {
    const message = JSON.stringify({
      type: EventType.GetNonce,
      data: {},
    });

    postParentMessage(EventType.GetNonce);
    expect(window.postMessage).toBeCalledWith(message, "*");
  });

  it("postParentMessage calls postMessage method with event type and data if data has primitive value type", () => {
    const message = JSON.stringify({
      type: EventType.GetNonce,
      data: "test",
    });

    postParentMessage(EventType.GetNonce, "test");
    expect(window.postMessage).toBeCalledWith(message, "*");
  });

  it("postParentMessage calls postMessage method with event type and data if data is an array", () => {
    const message = JSON.stringify({
      type: EventType.GetNonce,
      data: ["a", "b", "c"],
    });

    postParentMessage(EventType.GetNonce, ["a", "b", "c"]);
    expect(window.postMessage).toBeCalledWith(message, "*");
  });

  it("postParentMessage calls postMessage method with event type and data if data is an object", () => {
    const message = JSON.stringify({
      type: EventType.GetNonce,
      data: {a: "a", b: "b"},
    });

    postParentMessage(EventType.GetNonce, {a: "a", b: "b"});
    expect(window.postMessage).toBeCalledWith(message, "*");
  });

  it("postParentMessage calls port postMessage method with event type and data if data is an object and port is passed in", () => {
    const messagePort: MessagePort = {
      postMessage: jest.fn(),
      onmessage: jest.fn(),
      onmessageerror: jest.fn(),
      close: jest.fn(),
      start: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };

    const messageChannel: MessageChannel = {
      port1: messagePort,
      port2: messagePort
    };

    const portSpy = jest.spyOn(messageChannel.port2, "postMessage");

    const message = JSON.stringify({
      type: EventType.GetNonce,
      data: {a: "a", b: "b"},
    });

    postParentMessage(EventType.GetNonce, {a: "a", b: "b"}, messageChannel.port2);
    expect(portSpy).toBeCalledWith(message);
  });
});

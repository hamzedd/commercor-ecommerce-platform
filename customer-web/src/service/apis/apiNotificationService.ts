export type ApiErrorNotice = {
  title?: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export type ApiNotificationHandler = {
  success: (description: string) => unknown;
  error: (notice: ApiErrorNotice) => unknown;
};

let registration:
  | { token: symbol; handler: ApiNotificationHandler }
  | undefined;

function safelyNotify(action: (handler: ApiNotificationHandler) => unknown) {
  const activeHandler = registration?.handler;
  if (!activeHandler) return;

  try {
    const result = action(activeHandler);
    if (
      result &&
      typeof result === "object" &&
      "then" in result &&
      typeof result.then === "function"
    ) {
      void Promise.resolve(result).catch(() => undefined);
    }
  } catch {
    // Reporting an API result must never replace the original request outcome.
  }
}

export function registerApiNotificationHandler(
  handler: ApiNotificationHandler,
) {
  const token = Symbol("api-notification-handler");
  registration = { token, handler };

  return () => {
    if (registration?.token === token) registration = undefined;
  };
}

export const apiNotifications = {
  success(description: string) {
    safelyNotify((handler) => handler.success(description));
  },
  error(notice: ApiErrorNotice) {
    safelyNotify((handler) => handler.error(notice));
  },
};

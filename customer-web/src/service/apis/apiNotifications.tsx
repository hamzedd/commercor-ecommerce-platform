"use client";

import { App, Button } from "antd";
import { useEffect } from "react";
import { registerApiNotificationHandler } from "./apiNotificationService";

export function ApiNotificationBridge({
  children,
}: {
  children: React.ReactNode;
}) {
  const { message, notification } = App.useApp();

  useEffect(() => {
    return registerApiNotificationHandler({
      success: (description) => message.success(description),
      error: ({ title, description, actionLabel, onAction }) =>
        notification.error({
          message: title ?? "Something went wrong",
          description,
          placement: "topRight",
          duration: actionLabel ? 8 : 4.5,
          btn:
            actionLabel && onAction ? (
              <Button type="primary" size="small" onClick={onAction}>
                {actionLabel}
              </Button>
            ) : undefined,
        }),
    });
  }, [message, notification]);

  return children;
}

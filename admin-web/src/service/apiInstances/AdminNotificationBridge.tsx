import { App } from "antd";
import { useEffect } from "react";
import { registerAdminNotificationHandler } from "./adminNotificationService";

export default function AdminNotificationBridge() {
  const { notification } = App.useApp();

  useEffect(
    () =>
      registerAdminNotificationHandler({
        error: (description) =>
          notification.error({
            message: "Request failed",
            description,
            placement: "topRight",
          }),
      }),
    [notification],
  );

  return null;
}

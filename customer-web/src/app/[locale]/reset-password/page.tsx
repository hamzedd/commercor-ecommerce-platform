"use client";

import { Button, Form, Input } from "antd";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { resetPasswordService } from "@/src/service/apiServices/auth.service";
import { Link } from "@/src/i18n/navigation";

export default function ResetPasswordPage() {
  const t = useTranslations();
  const token = useSearchParams().get("token") || "";
  const [state, setState] = useState<"form" | "success" | "error">(
    token ? "form" : "error",
  );

  if (state !== "form")
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-16">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            {state === "success"
              ? t("passwordResetSuccessful")
              : t("invalidResetLink")}
          </h1>
          <Link
            href="/"
            className="mt-4 inline-block font-semibold text-violet-700 hover:text-violet-900 hover:underline"
          >
            {t("backToLogin")}
          </Link>
        </div>
      </main>
    );

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold tracking-tight text-slate-950">
          {t("resetPassword")}
        </h1>
        <Form
          layout="vertical"
          onFinish={async (v) => {
            try {
              await resetPasswordService(token, v.password);
              setState("success");
            } catch {
              setState("error");
            }
          }}
        >
          <Form.Item
            name="password"
            label={t("newPassword")}
            rules={[{ required: true, min: 8, max: 128 }]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Form.Item
            name="confirm"
            label={t("confirmPassword")}
            dependencies={["password"]}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  return !value || getFieldValue("password") === value
                    ? Promise.resolve()
                    : Promise.reject(new Error(t("passwordsDoNotMatch")));
                },
              }),
            ]}
          >
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Button
            htmlType="submit"
            block
            className="!h-11 !rounded-xl !border-0 !bg-gradient-to-r !from-blue-600 !via-violet-600 !to-pink-600 !font-bold !text-white !shadow-md !shadow-violet-900/20 transition-transform duration-200 hover:!scale-[1.02] focus-visible:!ring-2 focus-visible:!ring-violet-500 focus-visible:!ring-offset-2"
          >
            {t("resetPassword")}
          </Button>
        </Form>
      </div>
    </main>
  );
}

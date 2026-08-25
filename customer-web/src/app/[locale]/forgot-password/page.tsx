"use client";

import { Button, Form, Input } from "antd";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { forgotPasswordService } from "@/src/service/apiServices/auth.service";
import { Link } from "@/src/i18n/navigation";

export default function ForgotPasswordPage() {
  const t = useTranslations();
  const [sent, setSent] = useState(false);

  if (sent)
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-16">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            {t("checkYourEmail")}
          </h1>
          <p className="my-4 text-sm leading-6 text-slate-600">
            {t("resetGenericMessage")}
          </p>
          <Link
            href="/"
            className="font-semibold text-violet-700 hover:text-violet-900 hover:underline"
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
          {t("forgotPassword")}
        </h1>
        <Form
          layout="vertical"
          onFinish={async (v) => {
            await forgotPasswordService(v.email);
            setSent(true);
          }}
        >
          <Form.Item
            name="email"
            label={t("emailAddress")}
            rules={[{ required: true, type: "email" }]}
          >
            <Input autoComplete="email" />
          </Form.Item>
          <Button
            htmlType="submit"
            block
            className="!h-11 !rounded-xl !border-0 !bg-gradient-to-r !from-blue-600 !via-violet-600 !to-pink-600 !font-bold !text-white !shadow-md !shadow-violet-900/20 transition-transform duration-200 hover:!scale-[1.02] focus-visible:!ring-2 focus-visible:!ring-violet-500 focus-visible:!ring-offset-2"
          >
            {t("sendResetLink")}
          </Button>
        </Form>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import {
  capturePayPalService,
  PaymentInitialization,
} from "@/src/service/apiServices/payment.service";

declare global {
  interface Window {
    paypal?: {
      Buttons: (options: Record<string, unknown>) => {
        render: (element: HTMLElement) => Promise<void>;
        close?: () => void;
      };
    };
  }
}

export default function PayPalPaymentButton({
  paymentId,
  initialization,
  onCompleted,
  onError,
}: {
  paymentId: string;
  initialization: PaymentInitialization;
  onCompleted: () => void;
  onError: (message: string) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!initialization.publicClientId || !container.current) {
      onError("PayPal client configuration is unavailable.");
      return;
    }
    let cancelled = false;
    const scriptId = "commercor-paypal-sdk";
    const render = async () => {
      if (cancelled || !window.paypal || !container.current) return;
      container.current.replaceChildren();
      const buttons = window.paypal.Buttons({
        createOrder: () => initialization.providerPaymentId,
        onApprove: async (data: { orderID: string }) => {
          try {
            await capturePayPalService(paymentId, data.orderID);
            onCompleted();
          } catch (error: any) {
            onError(
              error?.response?.data?.message ||
                "PayPal capture could not be verified.",
            );
          }
        },
        onCancel: () =>
          onError(
            "PayPal checkout was closed. Your pending order remains available until it expires.",
          ),
        onError: () => onError("PayPal checkout could not be loaded."),
      });
      await buttons.render(container.current);
      if (!cancelled) setLoading(false);
    };
    const existing = document.getElementById(
      scriptId,
    ) as HTMLScriptElement | null;
    if (existing) {
      if (window.paypal) void render();
      else existing.addEventListener("load", render, { once: true });
    } else {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(initialization.publicClientId)}&currency=${encodeURIComponent(initialization.currencyCode)}&intent=capture&components=buttons`;
      script.async = true;
      script.addEventListener("load", render, { once: true });
      script.addEventListener(
        "error",
        () => onError("PayPal checkout could not be loaded."),
        { once: true },
      );
      document.head.appendChild(script);
    }
    return () => {
      cancelled = true;
    };
  }, [initialization, onCompleted, onError, paymentId]);

  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="mb-3 text-sm font-semibold text-slate-800">
        Complete payment securely with PayPal
      </p>
      {loading && <p className="text-sm text-slate-500">Loading PayPal…</p>}
      <div ref={container} />
    </div>
  );
}

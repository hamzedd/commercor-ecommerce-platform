"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button, Input, Spin } from "antd";
import {
  CloseOutlined,
  MessageOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { assistantChatService } from "@/src/service/apiServices/assistant.service";
import {
  AssistantContentBlock,
  AssistantMessage,
  AssistantToolUseBlock,
} from "@/src/utils/types/assistant.type";
import { addToCart } from "@/src/utils/cart/cartStorage";
import { useRouter } from "@/src/i18n/navigation";

const CLIENT_TOOL_NAMES = new Set([
  "add_to_cart",
  "view_product",
  "view_category",
]);
const MAX_TURNS = 6;

type DisplayMessage = {
  role: "user" | "assistant" | "system";
  text: string;
};

function extractText(content: AssistantMessage["content"]): string {
  if (typeof content === "string") return content;
  return content
    .filter(
      (block): block is Extract<AssistantContentBlock, { type: "text" }> =>
        block.type === "text",
    )
    .map((block) => block.text)
    .join("\n")
    .trim();
}

function AssistantWidget() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [conversation, setConversation] = useState<AssistantMessage[]>([]);
  const [displayMessages, setDisplayMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [displayMessages, loading]);

  const executeClientTool = (block: AssistantToolUseBlock): string => {
    const toolInput = block.input;
    switch (block.name) {
      case "add_to_cart": {
        const productId = toolInput.productId as string;
        const quantity = Number(toolInput.quantity) || 1;
        addToCart(productId, quantity);
        setDisplayMessages((prev) => [
          ...prev,
          { role: "system", text: t("assistantAddedToCart") },
        ]);
        return JSON.stringify({ success: true });
      }
      case "view_product":
        router.push({
          pathname: "/products/[slug]",
          params: { slug: toolInput.slug as string },
        });
        return JSON.stringify({ success: true });
      case "view_category":
        router.push({
          pathname: "/categories/[slug]",
          params: { slug: toolInput.slug as string },
        });
        return JSON.stringify({ success: true });
      default:
        return JSON.stringify({ success: false });
    }
  };

  const runConversation = async (initialMessages: AssistantMessage[]) => {
    setLoading(true);
    try {
      let current = initialMessages;
      for (let turn = 0; turn < MAX_TURNS; turn++) {
        const response = await assistantChatService(current, locale);
        const assistantMessage: AssistantMessage = {
          role: "assistant",
          content: response.content,
        };
        const text = extractText(response.content);
        if (text) {
          setDisplayMessages((prev) => [...prev, { role: "assistant", text }]);
        }

        if (response.stopReason !== "tool_use") {
          current = [...current, assistantMessage];
          break;
        }

        const clientToolBlocks = response.content.filter(
          (block): block is AssistantToolUseBlock =>
            block.type === "tool_use" &&
            CLIENT_TOOL_NAMES.has((block as AssistantToolUseBlock).name),
        );

        if (clientToolBlocks.length === 0) {
          current = [...current, assistantMessage];
          break;
        }

        const toolResults = clientToolBlocks.map((block) => ({
          type: "tool_result" as const,
          tool_use_id: block.id,
          content: executeClientTool(block),
        }));

        current = [
          ...current,
          assistantMessage,
          { role: "user", content: toolResults },
        ];
      }
      setConversation(current);
    } catch {
      setDisplayMessages((prev) => [
        ...prev,
        { role: "assistant", text: t("assistantErrorMessage") },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    setInput("");
    setDisplayMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    const nextMessages: AssistantMessage[] = [
      ...conversation,
      { role: "user", content: trimmed },
    ];
    setConversation(nextMessages);
    void runConversation(nextMessages);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? t("assistantCloseLabel") : t("assistantOpenLabel")}
        className="fixed right-5 bottom-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-stone-950 text-white shadow-lg transition-transform hover:scale-105 hover:bg-amber-600 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {open ? (
          <CloseOutlined className="text-xl" />
        ) : (
          <MessageOutlined className="text-xl" />
        )}
      </button>

      {open && (
        <div className="fixed right-5 bottom-24 z-50 flex h-[32rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl">
          <div className="border-b border-stone-200 bg-stone-950 px-4 py-3 text-white">
            <p className="text-sm font-bold">{t("assistantWidgetTitle")}</p>
          </div>
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-3"
          >
            {displayMessages.length === 0 && (
              <p className="rounded-xl bg-stone-100 px-3 py-2 text-sm text-stone-700">
                {t("assistantWidgetGreeting")}
              </p>
            )}
            {displayMessages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm whitespace-pre-line ${
                  message.role === "user"
                    ? "ml-auto bg-amber-600 text-white"
                    : message.role === "system"
                      ? "mx-auto bg-emerald-50 text-emerald-700"
                      : "bg-stone-100 text-stone-800"
                }`}
              >
                {message.text}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-stone-500">
                <Spin size="small" /> {t("assistantThinking")}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 border-t border-stone-200 p-3">
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onPressEnter={handleSend}
              placeholder={t("assistantInputPlaceholder")}
              disabled={loading}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              disabled={loading || !input.trim()}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default AssistantWidget;

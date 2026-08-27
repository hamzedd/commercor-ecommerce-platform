import { useEffect, useRef, useState } from "react";
import { Button, Input, Spin } from "antd";
import {
  CloseOutlined,
  MessageOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { assistantChatService } from "../../../service/apiServices/assistantServices.ts";
import type {
  AssistantContentBlock,
  AssistantMessage,
} from "../../../utils/types/assistant.type.ts";

type DisplayMessage = {
  role: "user" | "assistant";
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

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    setInput("");
    setDisplayMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    const nextMessages: AssistantMessage[] = [
      ...conversation,
      { role: "user", content: trimmed },
    ];
    setConversation(nextMessages);
    setLoading(true);
    try {
      const response = await assistantChatService(nextMessages);
      const text = extractText(response.content);
      setDisplayMessages((prev) => [
        ...prev,
        { role: "assistant", text: text || "…" },
      ]);
      setConversation([
        ...nextMessages,
        { role: "assistant", content: response.content },
      ]);
    } catch {
      setDisplayMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close assistant" : "Chat with assistant"}
        className="fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--admin-sidebar)] text-white shadow-lg transition-transform hover:scale-105"
      >
        {open ? (
          <CloseOutlined className="text-xl" />
        ) : (
          <MessageOutlined className="text-xl" />
        )}
      </button>

      {open && (
        <div className="fixed right-6 bottom-24 z-50 flex h-[32rem] w-[24rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-[var(--admin-line)] bg-[var(--admin-surface)] shadow-2xl">
          <div className="border-b border-[var(--admin-line)] bg-[var(--admin-sidebar)] px-4 py-3 text-white">
            <p className="text-sm font-bold">Commercor Assistant</p>
          </div>
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-3"
          >
            {displayMessages.length === 0 && (
              <p className="rounded-xl bg-[var(--admin-accent-soft)] px-3 py-2 text-sm text-[var(--admin-ink)]">
                Hi! Ask me about products, orders, customers, or sales figures.
              </p>
            )}
            {displayMessages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm whitespace-pre-line ${
                  message.role === "user"
                    ? "ml-auto bg-[var(--admin-accent)] text-white"
                    : "bg-[var(--admin-canvas)] text-[var(--admin-ink)]"
                }`}
              >
                {message.text}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-[var(--admin-muted)]">
                <Spin size="small" /> Thinking...
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 border-t border-[var(--admin-line)] p-3">
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onPressEnter={() => void handleSend()}
              placeholder="Ask about products, orders..."
              disabled={loading}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={() => void handleSend()}
              disabled={loading || !input.trim()}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default AssistantWidget;

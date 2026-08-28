export type AssistantTextBlock = {
  type: "text";
  text: string;
};

export type AssistantToolUseBlock = {
  type: "tool_use";
  id: string;
  name: string;
  input: Record<string, unknown>;
};

export type AssistantToolResultBlock = {
  type: "tool_result";
  tool_use_id: string;
  content: string;
};

export type AssistantContentBlock =
  | AssistantTextBlock
  | AssistantToolUseBlock
  | AssistantToolResultBlock
  | { type: string };

export type AssistantMessage = {
  role: "user" | "assistant";
  content: string | AssistantContentBlock[];
};

export type AssistantChatResponse = {
  content: AssistantContentBlock[];
  stopReason: string | null;
};

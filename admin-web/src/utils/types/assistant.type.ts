export type AssistantTextBlock = {
  type: "text";
  text: string;
};

export type AssistantContentBlock = AssistantTextBlock | { type: string };

export type AssistantMessage = {
  role: "user" | "assistant";
  content: string | AssistantContentBlock[];
};

export type AssistantChatResponse = {
  content: AssistantContentBlock[];
};

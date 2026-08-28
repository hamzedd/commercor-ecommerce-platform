import api from "@/src/service/apis/api";
import {
  AssistantChatResponse,
  AssistantMessage,
} from "@/src/utils/types/assistant.type";

export async function assistantChatService(
  messages: AssistantMessage[],
  locale?: string,
): Promise<AssistantChatResponse> {
  return api
    .post("/assistant/chat", { messages, locale })
    .then((res) => res.data);
}

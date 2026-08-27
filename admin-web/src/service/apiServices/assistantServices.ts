import adminApi from "../apiInstances/adminApi.ts";
import type {
  AssistantChatResponse,
  AssistantMessage,
} from "../../utils/types/assistant.type.ts";

export async function assistantChatService(
  messages: AssistantMessage[],
): Promise<AssistantChatResponse> {
  return adminApi
    .post("/assistant/chat", { messages })
    .then((response) => response.data);
}

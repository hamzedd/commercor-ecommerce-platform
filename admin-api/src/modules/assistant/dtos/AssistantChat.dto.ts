import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import type { AssistantMessage } from '../assistant.types';

export class AssistantChatDto {
  @ApiProperty({
    description:
      'Full conversation history (role + content blocks). ' +
      'The client should resend the entire history on every call and append the previous response before the next turn.',
  })
  @IsArray()
  messages: AssistantMessage[];
}

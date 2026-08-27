import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import type Anthropic from '@anthropic-ai/sdk';

export class AssistantChatDto {
  @ApiProperty({
    description:
      'Full conversation history, in Anthropic Messages API format (role + content blocks). ' +
      'The client should resend the entire history on every call and append the previous response before the next turn.',
  })
  @IsArray()
  messages: Anthropic.MessageParam[];
}

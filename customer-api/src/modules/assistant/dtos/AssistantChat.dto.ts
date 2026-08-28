import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import type { AssistantMessage } from '../assistant.types';

export class AssistantChatDto {
  @ApiProperty({
    description:
      'Full conversation history (role + content blocks). ' +
      'The client should resend the entire history on every call and append the previous response before the next turn.',
  })
  @IsArray()
  messages: AssistantMessage[];

  @ApiProperty({
    required: false,
    description:
      'BCP-47 locale the assistant should reply in, e.g. "en" or "ar"',
  })
  @IsOptional()
  @IsString()
  locale?: string;
}

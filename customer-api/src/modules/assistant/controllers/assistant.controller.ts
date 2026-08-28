import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { AssistantService } from '@/src/modules/assistant/services/assistant.service';
import { AssistantChatDto } from '@/src/modules/assistant/dtos/AssistantChat.dto';
import { OptionalAuthGuard } from '@/src/libs/guards/optionalAuth.guard';
import type { OptionallyGuardedApiResponse } from '@/src/utils/types/api.type';

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @ApiOperation({
    description:
      'Chat with the Commercor shopping assistant. Works for guests; personalizes order lookups when a bearer token is provided.',
  })
  @ApiBody({ type: AssistantChatDto })
  @UseGuards(OptionalAuthGuard)
  @Post('chat')
  chat(
    @Req() req: OptionallyGuardedApiResponse,
    @Body() data: AssistantChatDto,
  ) {
    return this.assistantService.chat({
      messages: data.messages,
      locale: data.locale,
      customerId: req?.user?.id,
    });
  }
}

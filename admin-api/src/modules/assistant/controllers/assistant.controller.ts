import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { AssistantService } from '@/src/modules/assistant/services/assistant.service';
import { AssistantChatDto } from '@/src/modules/assistant/dtos/AssistantChat.dto';
import { AuthGuard } from '@/src/libs/guards/auth.guard';

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @ApiOperation({
    description: 'Chat with the Commercor admin assistant.',
  })
  @ApiBody({ type: AssistantChatDto })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('chat')
  chat(@Request() req: any, @Body() data: AssistantChatDto) {
    return this.assistantService.chat({
      messages: data.messages,
      userRole: req?.user?.role,
    });
  }
}

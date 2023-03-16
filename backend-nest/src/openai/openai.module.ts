import { Module } from '@nestjs/common';
import { MessagesModule } from 'src/messages/messages.module';
import { OpenaiResolver } from './openai.resolver';
import { OpenaiService } from './openai.service';

@Module({
  imports: [MessagesModule],
  providers: [OpenaiResolver, OpenaiService],
})
export class OpenaiModule {}

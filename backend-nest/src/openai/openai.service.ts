import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApolloError } from 'apollo-server-express';
import { getSession } from 'next-auth/react';
import {
  Configuration,
  CreateCompletionRequest,
  CreateCompletionResponseChoicesInner,
  OpenAIApi,
} from 'openai';
import { MessagesService } from 'src/messages/messages.service';
import { GraphQLContextExtended } from 'src/utils/types';
import { GenerateResponseDto } from './dto/generate-response.dto';

@Injectable()
export class OpenaiService {
  private readonly openAi: OpenAIApi;
  constructor(
    private readonly configService: ConfigService,
    private readonly messagesService: MessagesService,
  ) {
    const configuration = new Configuration({
      organization: configService.get<string>('OPENAI_ORG_ID'),
      apiKey: configService.get<string>('OPENAI_API_KEY'),
    });
    this.openAi = new OpenAIApi(configuration);
  }

  async generateAiResponse(
    generateResponseParams: GenerateResponseDto,
    context: GraphQLContextExtended,
  ): Promise<string> {
    const { prompt, conversationId, senderId } = generateResponseParams;
    const { req } = context;
    const session = await getSession({ req });

    if (!session?.user) {
      throw new ApolloError('Not Authorized');
    }
    try {
      const params: CreateCompletionRequest = {
        model: 'text-davinci-003',
        prompt: `${prompt}`,
        max_tokens: 2000,
        temperature: 0.5,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      };
      const response = await this.openAi.createCompletion(params);
      const newMessage = await this.messagesService.sendMessage(
        { body: response.data.choices[0].text, conversationId, senderId },
        context,
      );
      return response.data.choices[0].text;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

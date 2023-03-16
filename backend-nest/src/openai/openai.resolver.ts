import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { CreateCompletionResponseChoicesInner } from 'openai';
import { GraphQLContextExtended } from 'src/utils/types';
import { GenerateResponseDto } from './dto/generate-response.dto';
import { OpenaiService } from './openai.service';

@Resolver()
export class OpenaiResolver {
  constructor(private readonly openaiService: OpenaiService) {}

  @Mutation()
  async generateAiResponse(
    @Args() generateResponseParams: GenerateResponseDto,
    @Context() context: GraphQLContextExtended,
  ): Promise<string> {
    return this.openaiService.generateAiResponse(
      generateResponseParams,
      context,
    );
  }
}

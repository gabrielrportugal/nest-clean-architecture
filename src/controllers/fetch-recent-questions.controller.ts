import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { z } from 'zod'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1).default(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type QueryParamsSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: QueryParamsSchema) {
    const itemsPerPage = 10

    const questions = await this.prisma.question.findMany({
      take: itemsPerPage,
      skip: (page - 1) * itemsPerPage,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { questions }
  }
}

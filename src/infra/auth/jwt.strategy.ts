import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt'
import { z } from 'zod'
import { EnvService } from '../env/env.service'

const tokenPayloadSchema = z.object({
  sub: z.string().uuid(),
})

export type UserPayload = z.infer<typeof tokenPayloadSchema>

@Injectable() // PassportStrategy by default is 'jwt'
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(envService: EnvService) {
    const publicKeyBase64 = envService.get('JWT_PUBLIC_KEY')

    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      algorithms: ['RS256'],
      secretOrKey: Buffer.from(publicKeyBase64, 'base64'),
    }

    super(options)
  }

  async validate(payload: UserPayload) {
    return tokenPayloadSchema.parse(payload)
  }
}

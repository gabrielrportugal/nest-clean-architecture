import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Env } from 'src/env'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory(configService: ConfigService<Env, true>) {
        const privateKeyBase64 = configService.get('JWT_PRIVATE_KEY', {
          infer: true,
        })
        const publicKeyBase64 = configService.get('JWT_PUBLIC_KEY', {
          infer: true,
        })

        return {
          signOptions: {
            algorithm: 'RS256',
          },
          privateKey: Buffer.from(privateKeyBase64, 'base64'),
          publicKey: Buffer.from(publicKeyBase64, 'base64'),
        }
      },
    }),
  ],
})
export class AuthModule {}

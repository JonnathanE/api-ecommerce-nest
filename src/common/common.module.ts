import { Module } from '@nestjs/common';
import { BcryptAdapter } from './adapters/crypto/bcrypt.adapter';

@Module({
  providers: [
    {
      provide: 'ICryptoAdapter',
      useClass: BcryptAdapter,
    },
  ],
  exports: ['ICryptoAdapter'],
})
export class CommonModule {}

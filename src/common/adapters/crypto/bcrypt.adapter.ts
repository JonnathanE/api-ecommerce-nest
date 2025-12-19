import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ICryptoAdapter } from './crypto-adapter.interface';

@Injectable()
export class BcryptAdapter implements ICryptoAdapter {
  private readonly defaultRounds = 10;

  async hash(
    data: string,
    rounds: number = this.defaultRounds,
  ): Promise<string> {
    return bcrypt.hash(data, rounds);
  }

  async compare(data: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}

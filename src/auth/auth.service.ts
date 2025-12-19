import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';
import { DatabaseError } from 'pg-protocol';

import type { ICryptoAdapter } from '../common/adapters/crypto/crypto-adapter.interface';
import type { JwtPayload } from './interfaces/jwt-payload.interface';

import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @Inject('ICryptoAdapter') private readonly cryptoAdapter: ICryptoAdapter,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userDetails } = createUserDto;
      const hashedPassword = await this.cryptoAdapter.hash(password);

      const user = this.userRepository.create({
        ...userDetails,
        password: hashedPassword,
      });

      await this.userRepository.save(user);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user;

      return {
        ...userWithoutPassword,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { password: true, email: true, id: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!(await this.cryptoAdapter.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    return {
      ...userWithoutPassword,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBExceptions(error: any): never {
    // Verificar si es un error de base de datos
    if (
      error instanceof DatabaseError ||
      (error && typeof error === 'object' && 'code' in error)
    ) {
      const dbError = error as DatabaseError & {
        code: string;
        detail?: string;
      };

      if (dbError.code === '23505') {
        throw new BadRequestException(dbError.detail || 'Duplicate entry');
      }

      if (dbError.code === '23503') {
        throw new BadRequestException('Foreign key constraint violation');
      }

      if (dbError.code === '23502') {
        throw new BadRequestException('Not null constraint violation');
      }
    }

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}

import { Controller, Post, Body, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';

import { CreateUserDto, LoginUserDto } from './dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { Auth } from './decorators';
import { ValidRoles } from './interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new user account in the system.',
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered.',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Invalid input data or email already exists.',
  })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticates a user and returns an access token.',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully authenticated.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid credentials.',
  })
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-auth-status')
  @Auth()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Check authentication status',
    description: 'Validates the current JWT token and refreshes it.',
  })
  @ApiResponse({
    status: 200,
    description: 'Token is valid. Returns refreshed token.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or expired token.',
  })
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @Auth(ValidRoles.admin)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Test private route',
    description: 'Testing endpoint for admin-only access.',
  })
  @ApiResponse({
    status: 200,
    description: 'Access granted.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Authentication required.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Admin role required.',
  })
  testingPrivateRoute(@GetUser() user: User) {
    return { ok: true, message: 'Hola mundo private', user };
  }
}

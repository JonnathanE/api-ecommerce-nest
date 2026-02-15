import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SeedService } from './seed.service';
// import { Auth } from 'src/auth/decorators';
// import { ValidRoles } from 'src/auth/interfaces/valid-roles';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @ApiOperation({
    summary: 'Execute database seed',
    description:
      'Populates the database with initial seed data. WARNING: This will delete all existing data and replace it with seed data. Use only in development.',
  })
  @ApiResponse({
    status: 200,
    description: 'Seed executed successfully.',
    schema: {
      type: 'string',
      example: 'Seed executed',
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error during seed execution.',
  })
  // @Auth(ValidRoles.admin)
  executeSeed() {
    return this.seedService.runSeed();
  }
}

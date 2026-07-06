import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../user.entity';
import { FindOneParams } from '../../antique-items/find-one.params';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:id')
  public findOne(@Param() params: FindOneParams): Promise<User> {
    return this.usersService.findOneById(params.id);
  }
}

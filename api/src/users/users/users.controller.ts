import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  SerializeOptions,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../user.entity';
import { FindOneParams } from '../../antique-items/find-one.params';

@Controller('users')
@SerializeOptions({ strategy: 'excludeAll' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/:id')
  public findOne(@Param() params: FindOneParams): Promise<User> {
    return this.usersService.findOneById(params.id);
  }
}

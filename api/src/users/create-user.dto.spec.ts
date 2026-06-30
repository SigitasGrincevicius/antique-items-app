import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  let dto: CreateUserDto;

  beforeEach(() => {
    dto = plainToInstance(CreateUserDto, {
      email: '  Luke.Skywalker@SW.com  ',
      name: '  Luke Skywalker  ',
      password: '  Tatooine#2026Sky  ',
    });
  });
  
  it('should validate a valid DTO object', async () => {
    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
    expect(dto.email).toBe('luke.skywalker@sw.com');
    expect(dto.name).toBe('Luke Skywalker');
    expect(dto.password).toBe('Tatooine#2026Sky');
  });

  it('should fail on invalid email', async () => {
    dto = plainToInstance(CreateUserDto, {
      email: 'luke.skywalker.sw.com',
      name: 'Luke Skywalker',
      password: 'Tatooine#2026Sky',
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });
});

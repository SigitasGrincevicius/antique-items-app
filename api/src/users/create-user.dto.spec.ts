import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  const validateDto = async (payload: Record<string, unknown>) =>
    validate(plainToInstance(CreateUserDto, payload));
  const validPassword = 'Tatooine#2026Sky';

  it('should validate and normalize a valid user payload', async () => {
    const dto = plainToInstance(CreateUserDto, {
      email: '  LUKE.SKYWALKER@SW.COM  ',
      name: '  Luke Skywalker  ',
      password: `  ${validPassword}  `,
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
    expect(dto.email).toBe('luke.skywalker@sw.com');
    expect(dto.name).toBe('Luke Skywalker');
    expect(dto.password).toBe(validPassword);
  });

  it.each([
    {
      field: 'email',
      payload: {
        email: 'not-an-email',
        name: 'Luke Skywalker',
        password: validPassword,
      },
      constraint: 'isEmail',
    },
    {
      field: 'name',
      payload: {
        email: 'luke@sw.com',
        name: 'L',
        password: validPassword,
      },
      constraint: 'minLength',
    },
    {
      field: 'password',
      payload: {
        email: 'luke@sw.com',
        name: 'Luke Skywalker',
        password: 'password',
      },
      constraint: 'matches',
    },
  ])(
    'should reject invalid $field values',
    async ({ payload, field, constraint }) => {
      const errors = await validateDto(payload);
      const propertyError = errors.find((error) => error.property === field);

      expect(propertyError).toBeDefined();
      expect(propertyError?.constraints).toHaveProperty(constraint);
    },
  );
});

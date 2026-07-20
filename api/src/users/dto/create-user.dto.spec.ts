import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  const createDto = (overrides: Partial<CreateUserDto> = {}) =>
    plainToInstance(CreateUserDto, {
      email: '  Luke.Skywalker@SW.com  ',
      name: '  Luke Skywalker  ',
      password: '  Tatooine#2026Sky  ',
      ...overrides,
    });

  const findError = (
    errors: ValidationError[],
    property: keyof CreateUserDto,
  ) => errors.find((error) => error.property === property);

  const expectConstraint = async (
    overrides: Partial<CreateUserDto>,
    property: keyof CreateUserDto,
    constraint: string,
    message?: string,
  ) => {
    const errors = await validate(createDto(overrides));
    const propertyError = findError(errors, property);

    expect(propertyError).toBeDefined();
    expect(propertyError?.constraints).toHaveProperty(constraint);

    if (message) {
      expect(Object.values(propertyError?.constraints ?? {})).toContain(message);
    }
  };

  it('validates and normalizes a valid DTO object', async () => {
    const dto = createDto();
    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
    expect(dto.email).toBe('luke.skywalker@sw.com');
    expect(dto.name).toBe('Luke Skywalker');
    expect(dto.password).toBe('Tatooine#2026Sky');
  });

  it('rejects an invalid email address', async () => {
    await expectConstraint({ email: 'luke.skywalker.sw.com' }, 'email', 'isEmail');
  });

  it('rejects a blank name after trimming', async () => {
    await expectConstraint({ name: '   ' }, 'name', 'isNotEmpty');
  });

  it('rejects a name that becomes too short after trimming', async () => {
    await expectConstraint({ name: ' A ' }, 'name', 'minLength');
  });

  it('rejects a blank email after trimming', async () => {
    await expectConstraint({ email: '   ' }, 'email', 'isNotEmpty');
  });

  it('rejects a password shorter than 8 characters', async () => {
    await expectConstraint({ password: 'Abc#123' }, 'password', 'minLength');
  });

  it.each([
    ['uppercase letter', 'tatooine#2026sky', 'Password must contain at least 1 uppercase letter'],
    ['number', 'Tatooine#sky', 'Password must contain at least 1 number'],
    ['special character', 'Tatooine2026sky', 'Password must contain at least 1 special character'],
  ])('rejects a password without a %s', async (_missingRule, password, message) => {
    await expectConstraint({ password }, 'password', 'matches', message);
  });

  it('rejects a password longer than 72 characters', async () => {
    await expectConstraint({ password: `Aa1#${'b'.repeat(69)}` }, 'password', 'maxLength');
  });
});

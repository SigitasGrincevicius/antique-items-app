import { PasswordService } from './password.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(() => {
    service = new PasswordService();
    jest.clearAllMocks();
  });

  it('should delegate hashing to bcrypt with the configured salt rounds', async () => {
    const password = 'password123';
    const hashedPassword = 'hashed_password';
    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

    await expect(service.hash(password)).resolves.toBe(hashedPassword);

    expect(bcrypt.hash).toHaveBeenCalledTimes(1);
    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
  });

  it('should propagate bcrypt hash errors', async () => {
    const error = new Error('hash failed');
    (bcrypt.hash as jest.Mock).mockRejectedValue(error);

    await expect(service.hash('password123')).rejects.toThrow(error);
  });

  it('should delegate password verification to bcrypt.compare', async () => {
    const plainPassword = 'plain_password';
    const hashedPassword = 'hashed_password';
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    await expect(service.verify(plainPassword, hashedPassword)).resolves.toBe(
      true,
    );

    expect(bcrypt.compare).toHaveBeenCalledTimes(1);
    expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
  });

  it('should propagate bcrypt compare errors', async () => {
    const error = new Error('compare failed');
    (bcrypt.compare as jest.Mock).mockRejectedValue(error);

    await expect(
      service.verify('wrong_password', 'hashed_password'),
    ).rejects.toThrow(error);
  });
});

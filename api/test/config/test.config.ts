export const testConfig = {
  database: {
    type: 'postgres',
    host: '127.0.0.1',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'antique-items-test',
    synchronize: true,
  },
  app: {
    port: 3000,
  },
  auth: {
    secret: 'secret-123',
    expiresIn: '1m',
  },
};

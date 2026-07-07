export const testConfig = {
  database: {
    type: 'postgres',
    host: 'localhost',
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

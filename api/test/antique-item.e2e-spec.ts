import request from 'supertest';
import { AppModule } from './../src/app.module';
import { TestSetup } from './utils/test-setup';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/user.entity';
import { Role } from '../src/users/role.enum';
import { PasswordService } from '../src/users/password/password.service';
import { JwtService } from '@nestjs/jwt';

describe('Authentication & Authorization (e2e)', () => {
  let testSetup: TestSetup;
  let authToken: string;
  let itemId: string;

  const testUser = {
    email: 'ahsoka@sw.com',
    password: 'Password123!',
    name: 'Ahsoka Tano',
  };

  const loginPayload = {
    email: testUser.email,
    password: testUser.password,
  };

  beforeEach(async () => {
    let userId: string;
    let booksCategoryId: string;

    await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201);

    const loginResponse = await request(testSetup.app.getHttpServer())
      .post('/auth/login')
      .send(loginPayload)
      .expect(201);

    authToken = loginResponse.body.accessToken;
    userId = testSetup.app.get(JwtService).verify(authToken).sub as string;

    const categoryResponse = await request(testSetup.app.getHttpServer())
      .post('/categories')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Books' })
      .expect(201);

    booksCategoryId = categoryResponse.body.id;
  });

  beforeAll(async () => {
    testSetup = await TestSetup.create(AppModule);
  });

  afterEach(async () => {
    await testSetup.cleanup();
  });

  afterAll(async () => {
    await testSetup.teardown();
  });
});

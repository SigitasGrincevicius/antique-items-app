import request from 'supertest';
import { AppModule } from './../src/app.module';
import { TestSetup } from './utils/test-setup';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/user.entity';
import { Role } from '../src/users/role.enum';
import { PasswordService } from '../src/users/password/password.service';
import { JwtService } from '@nestjs/jwt';

describe('Antique Items CRUD operations (e2e)', () => {
  let testSetup: TestSetup;
  let authToken: string;
  let itemId: string;
  let userId: string;
  let booksCategoryId: string;
  let antiqueItemId: string;

  const testUser = {
    email: 'ahsoka@sw.com',
    password: 'Password123!',
    name: 'Ahsoka Tano',
  };

  const adminUser = {
    email: 'admin@sw.com',
    password: 'Password123!',
    name: 'Admin',
  };

  const loginPayload = {
    email: testUser.email,
    password: testUser.password,
  };

  beforeEach(async () => {
    const userRepository = testSetup.app.get(getRepositoryToken(User));
    const passwordService = testSetup.app.get(PasswordService);

    await userRepository.save({
      ...adminUser,
      password: await passwordService.hash(adminUser.password),
      roles: [Role.ADMIN],
    });

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

    const itemResponse = await request(testSetup.app.getHttpServer())
      .post('/antique-items')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'The Lord of the Rings - First Edition Trilogy',
        origin: 'London, United Kingdom',
        year: 1954,
        priceEur: 175000,
        description:
          'A complete early first-edition set in its original dust jackets, with fold-out maps and a signed bookseller provenance note.',
        categoryId: booksCategoryId,
      })
      .expect(201);

    antiqueItemId = itemResponse.body.id;
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

  it('Category is successfully created', () => {
    expect(booksCategoryId).toBeDefined();
  });

  it('Antique book is successfully created', () => {
    expect(antiqueItemId).toBeDefined();
  });

  it('antique item can be viewed by another user', async () => {
    const otherUser = {
      ...testUser,
      email: 'yoda@sw.com',
    };
    const otherLoginPayload = {
      email: otherUser.email,
      password: otherUser.password,
    };

    await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(otherUser)
      .expect(201);

    const otherResponse = await request(testSetup.app.getHttpServer())
      .post('/auth/login')
      .send(otherLoginPayload)
      .expect(201);

    const otherToken = otherResponse.body.accessToken;

    const itemResponse = await request(testSetup.app.getHttpServer())
      .get(`/antique-items/${antiqueItemId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(200);

    expect(itemResponse.body).toMatchObject({
      id: antiqueItemId,
      name: 'The Lord of the Rings - First Edition Trilogy',
      createdById: userId,
    });
  });
});

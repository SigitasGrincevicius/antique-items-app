import request from 'supertest';
import { AppModule } from './../src/app.module';
import { TestSetup } from './utils/test-setup';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import { Role } from '../src/users/auth/role.enum';
import { PasswordService } from '../src/users/auth/password/password.service';
import { JwtService } from '@nestjs/jwt';

describe('Antique Items CRUD operations (e2e)', () => {
  let testSetup: TestSetup;
  let authToken: string;
  let userId: string;
  let booksCategoryId: string;
  let antiqueItemId: string;

  const regularUser = {
    email: 'ahsoka@sw.com',
    password: 'Password123!',
    name: 'Ahsoka Tano',
  };

  const adminUser = {
    email: 'admin@sw.com',
    password: 'Password123!',
    name: 'Admin',
  };

  const antiqueItemPayload = {
    name: 'The Lord of the Rings - First Edition Trilogy',
    origin: 'London, United Kingdom',
    year: 1954,
    priceEur: 175000,
    description:
      'A complete early first-edition set in its original dust jackets, with fold-out maps and a signed bookseller provenance note.',
  };

  const login = async (email: string, password: string): Promise<string> => {
    const response = await request(testSetup.app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(201);

    return response.body.accessToken;
  };

  const createStoredUser = async (
    user: typeof regularUser,
    roles?: Role[],
  ): Promise<void> => {
    const userRepository = testSetup.app.get(getRepositoryToken(User));
    const passwordService = testSetup.app.get(PasswordService);

    await userRepository.save({
      ...user,
      password: await passwordService.hash(user.password),
      ...(roles && { roles }),
    });
  };

  beforeEach(async () => {
    await createStoredUser(adminUser, [Role.ADMIN]);
    const adminToken = await login(adminUser.email, adminUser.password);

    const categoryResponse = await request(testSetup.app.getHttpServer())
      .post('/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Books' })
      .expect(201);

    booksCategoryId = categoryResponse.body.id;

    await createStoredUser(regularUser);
    authToken = await login(regularUser.email, regularUser.password);
    userId = testSetup.app.get(JwtService).verify(authToken).sub as string;

    const itemResponse = await request(testSetup.app.getHttpServer())
      .post('/antique-items')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        ...antiqueItemPayload,
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
      ...regularUser,
      email: 'yoda@sw.com',
    };

    await request(testSetup.app.getHttpServer())
      .post('/auth/register')
      .send(otherUser)
      .expect(201);

    const otherToken = await login(otherUser.email, otherUser.password);

    const itemResponse = await request(testSetup.app.getHttpServer())
      .get(`/antique-items/${antiqueItemId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(200);

    expect(itemResponse.body).toMatchObject({
      id: antiqueItemId,
      name: antiqueItemPayload.name,
      createdById: userId,
    });
  });

  it('user can add, list, and remove a favorite antique item', async () => {
    await request(testSetup.app.getHttpServer())
      .post(`/antique-items/${antiqueItemId}/favorite`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(201);

    const favoritesResponse = await request(testSetup.app.getHttpServer())
      .get('/antique-items/favorites')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(favoritesResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: antiqueItemId,
          category: expect.objectContaining({ id: booksCategoryId }),
        }),
      ]),
    );

    await request(testSetup.app.getHttpServer())
      .delete(`/antique-items/${antiqueItemId}/favorite`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(204);

    const emptyFavoritesResponse = await request(testSetup.app.getHttpServer())
      .get('/antique-items/favorites')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(emptyFavoritesResponse.body).toEqual([]);
  });

  it('returns conflict when the same favorite is added twice', async () => {
    await request(testSetup.app.getHttpServer())
      .post(`/antique-items/${antiqueItemId}/favorite`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(201);

    await request(testSetup.app.getHttpServer())
      .post(`/antique-items/${antiqueItemId}/favorite`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(409);
  });
});

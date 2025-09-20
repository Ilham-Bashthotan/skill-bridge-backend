import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import { Server } from 'http';
import { Logger } from 'winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';
import {
  UserResponse,
  RegisterResponse,
  LoginResponse,
  UpdateProfileResponse,
  TestErrorResponse,
} from '../src/model/user-response.model';
import { ErrorFilter } from '../src/common/error.filter';

describe('UserController', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new ErrorFilter());

    // Add validation pipe to test app
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    logger = app.get('winston');
    testService = app.get(TestService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /auth/register', () => {
    beforeEach(async () => {
      await testService.deleteUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer() as Server)
        .post('/auth/register')
        .send({
          name: '',
          email: '',
          password: '',
        });

      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);

      // Type-safe casting of response
      const errorResponse = response as TestErrorResponse;
      expect(errorResponse.body.errors).toBeDefined();

      const errorBody = errorResponse.body.errors;
      expect(errorBody.message).toBeDefined();
      expect(errorBody.statusCode).toBe(400);
      expect(Array.isArray(errorBody.message)).toBe(true);
      expect((errorBody.message as string[]).length).toBeGreaterThan(0);
    });

    it('should be able to register', async () => {
      const response = await request(app.getHttpServer() as Server)
        .post('/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          phone: '08123456789',
          password: 'test123',
        });

      logger.info(response.body);
      const body = response.body as RegisterResponse;
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(body.message).toBe('User registered successfully');
      expect(body.user).toBeDefined();
      expect(body.user.email).toBe('test@example.com');
      expect(body.user.name).toBe('Test User');
      expect(body.user.role).toBe('student');
    });

    it('should be rejected if email already exists', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer() as Server)
        .post('/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          phone: '08123456789',
          password: 'test123',
        });

      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);

      // Type-safe casting of response
      const errorResponse = response as TestErrorResponse;
      expect(errorResponse.body.errors).toBeDefined();

      const errorBody = errorResponse.body.errors;
      expect(errorBody.message).toBeDefined();
      expect(errorBody.message).toBe('Email already exists');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    });

    it('should be rejected if credentials are invalid', async () => {
      const response = await request(app.getHttpServer() as Server)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      logger.info(response.body);
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should be able to login', async () => {
      const response = await request(app.getHttpServer() as Server)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'test123',
        });

      logger.info(response.body);
      const body = response.body as LoginResponse;
      expect(response.status).toBe(HttpStatus.OK);
      expect(body.token).toBeDefined();
      expect(body.user).toBeDefined();
      expect(body.user.email).toBe('test@example.com');
    });
  });

  describe('GET /users/profile/:id', () => {
    let userId: number;

    beforeEach(async () => {
      await testService.deleteUser();
      const user = await testService.createUser();
      userId = user.id;
    });

    it('should be able to get user profile', async () => {
      const response = await request(app.getHttpServer() as Server).get(
        `/users/profile/${userId}`,
      );

      logger.info(response.body);
      const body = response.body as UserResponse;
      expect(response.status).toBe(HttpStatus.OK);
      expect(body.id).toBe(userId);
      expect(body.email).toBe('test@example.com');
      expect(body.name).toBe('Test User');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app.getHttpServer() as Server).get(
        '/users/profile/99999',
      );

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('PUT /users/profile/:id', () => {
    let userId: number;

    beforeEach(async () => {
      await testService.deleteUser();
      const user = await testService.createUser();
      userId = user.id;
    });

    it('should be able to update profile', async () => {
      const response = await request(app.getHttpServer() as Server)
        .put(`/users/profile/${userId}`)
        .send({
          name: 'Updated Name',
          bio: 'Updated bio',
          experience: 'Updated experience',
        });

      logger.info(response.body);
      const body = response.body as UpdateProfileResponse;
      expect(response.status).toBe(HttpStatus.OK);
      expect(body.message).toBe('Profile updated successfully');
      expect(body.user.name).toBe('Updated Name');
      expect(body.user.bio).toBe('Updated bio');
    });
  });
});

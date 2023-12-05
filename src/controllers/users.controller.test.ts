import { Request, Response, NextFunction } from 'express';
import { UsersController } from './users.controller';
import { UsersMongoRepo } from '../repos/users/users.mongo.repo';

describe('Given FilmsController class', () => {
  let controller: UsersController;
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      query: { key: 'value' },
    } as unknown as Request;
    mockResponse = {
      json: jest.fn(),
      status: jest.fn(),
    } as unknown as Response;
    mockNext = jest.fn();
  });

  describe('When we instantiate it without errors', () => {
    test('Then login should...', async () => {
      const mockUserId = 'mockUserId';
      const mockLoginResult = {
        id: 'mockUserId',
        email: 'mock@example.com',
      };
      const mockRequest = {
        body: { userId: mockUserId },
      } as unknown as Request;
      const mockRepo = {
        getById: jest.fn().mockResolvedValue(mockLoginResult),
        login: jest.fn().mockResolvedValue(mockLoginResult),
      } as unknown as UsersMongoRepo;

      const controller = new UsersController(mockRepo);

      await controller.login(mockRequest, mockResponse, mockNext);
      expect(mockRepo.getById).toHaveBeenCalledWith(mockUserId);
    });
    test('Then register (create) should create a new user with valid input data and image file', async () => {
      const mockRequest = {
        file: {
          path: 'valid/path/to/image.jpg',
        },
        body: {},
      } as unknown as Request;
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn(),
      } as unknown as Response;
      const mockNext = jest.fn();
      const mockRepo = {
        create: jest.fn(),
      } as unknown as UsersMongoRepo;

      const controller = new UsersController(mockRepo);
      const mockImageData = { url: 'https://example.com/image.jpg' };
      const mockCloudinaryService = {
        uploadImage: jest.fn().mockResolvedValue(mockImageData),
      };
      controller.cloudinaryService = mockCloudinaryService;
      await controller.create(mockRequest, mockResponse, mockNext);
      expect(mockCloudinaryService.uploadImage).toHaveBeenCalledWith(
        mockRequest.file?.path
      );
      expect(mockRequest.body.avatar).toBe(mockImageData);
    });
  });

  describe('When we instantiate it with errors', () => {
    let mockError: Error;
    beforeEach(() => {
      mockError = new Error('Invalid multer file');
      const mockRepo = {
        login: jest.fn().mockRejectedValue(mockError),
        create: jest.fn().mockRejectedValue(mockError),
      } as unknown as UsersMongoRepo;

      controller = new UsersController(mockRepo);
    });
    test('Then login should throw an error', async () => {
      await controller.login(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
    test('Then register (create) should throw an error', async () => {
      await controller.create(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
});

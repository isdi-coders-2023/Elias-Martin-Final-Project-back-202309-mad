import { Request, Response, NextFunction } from 'express';
import { ClothesController } from './clothes.controller';
import { ClothesMongoRepo } from '../repos/clothes/clothes.mongo.repo';
import { ClothingItemModel } from '../repos/clothes/clothes.mongo.model';
import { HttpError } from '../types/http.error';

describe('Given ClothesController class', () => {
  let controller: ClothesController;
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
    beforeEach(() => {
      const mockRepo = {
        getAll: jest.fn().mockResolvedValue([{}]),
        getById: jest.fn().mockResolvedValue({}),
        search: jest.fn().mockResolvedValue([{}]),
        create: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({}),
        delete: jest.fn().mockResolvedValue(undefined),
      } as unknown as ClothesMongoRepo;
      controller = new ClothesController(mockRepo);
    });

    test('Then getAll should...', async () => {
      await controller.getAll(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith([{}]);
    });

    test('Then getById should...', async () => {
      await controller.getById(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith({});
    });

    test('Then search should...', async () => {
      await controller.search(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith([{}]);
    });

    test('Then create should create a new clothingItem with valid input data and image files', async () => {
      const mockRequest = {
        files: {
          clothingItemFrontImg: [
            {
              path: 'valid/path/to/frontImage.jpg',
            },
          ],
          clothingItemBackImg: [
            {
              path: 'valid/path/to/backImage.jpg',
            },
          ],
        },
        body: {
          userId: 'someUserId',
        },
      } as unknown as Request;
      const mockRepo = {
        create: jest.fn(),
      } as unknown as ClothesMongoRepo;
      const controller = new ClothesController(mockRepo);
      const mockImageDataFront = { url: 'https://example.com/frontImage.jpg' };
      const mockImageDataBack = { url: 'https://example.com/backImage.jpg' };
      const mockCloudinaryService = {
        uploadImage: jest
          .fn()
          .mockResolvedValue(mockImageDataFront)
          .mockResolvedValue(mockImageDataBack),
      };
      controller.cloudinaryService = mockCloudinaryService;
      await controller.create(mockRequest, mockResponse, mockNext);

      expect(mockCloudinaryService.uploadImage).toHaveBeenCalled();
    });

    test('Then update should update a the existent clothingItem with valid input data and image files', async () => {
      const mockRequest = {
        files: {
          clothingItemFrontImg: [
            {
              path: 'valid/path/to/frontImage.jpg',
            },
          ],
          clothingItemBackImg: [
            {
              path: 'valid/path/to/backImage.jpg',
            },
          ],
        },
        body: {
          userId: 'someUserId',
        },
        params: {
          id: '1',
        },
      } as unknown as Request;

      const mockRepo = {
        update: jest.fn(),
      } as unknown as ClothesMongoRepo;
      const controller = new ClothesController(mockRepo);
      const mockImageDataFront = { url: 'https://example.com/frontImage.jpg' };
      const mockImageDataBack = { url: 'https://example.com/backImage.jpg' };
      const mockExistingItem = {
        clothingItemFrontImg:
          'https://example.com/existingclothingItemFrontImg.jpg',
        clothingItemBackImg:
          'https://example.com/existingclothingItemBackImg.jpg',
      };
      const findByIdMock = jest.fn().mockResolvedValue(mockExistingItem);
      (ClothingItemModel.findById as jest.Mock) = findByIdMock;
      const mockCloudinaryService = {
        uploadImage: jest
          .fn()
          .mockResolvedValue(mockImageDataFront)
          .mockResolvedValue(mockImageDataBack),
      };
      controller.cloudinaryService = mockCloudinaryService;
      await controller.update(mockRequest, mockResponse, mockNext);
      expect(mockCloudinaryService.uploadImage).toHaveBeenCalled();
    });

    test('Then update should handle missing image files', async () => {
      const mockRequest = {
        files: {
          clothingItemFrontImg: [
            {
              path: undefined,
            },
          ],
          clothingItemBackImg: [
            {
              path: undefined,
            },
          ],
        },
        body: {
          userId: 'someUserId',
        },
        params: {
          id: '1',
        },
      } as unknown as Request;
      const mockRepo = {
        update: jest.fn(),
      } as unknown as ClothesMongoRepo;
      const controller = new ClothesController(mockRepo);
      await controller.update(mockRequest, mockResponse, mockNext);

      expect(mockRepo.update).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalled();
    });

    test('Then delete should...', async () => {
      await controller.delete(mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.statusMessage).toBe('No Content');
      expect(mockResponse.json).toHaveBeenCalledWith({});
    });
  });

  describe('When we instantiate it with errors', () => {
    let mockError: Error;

    beforeEach(() => {
      mockError = new Error('Mock error');
      const mockRepo = {
        getAll: jest.fn().mockRejectedValue(mockError),
        getById: jest.fn().mockRejectedValue(mockError),
        search: jest.fn().mockRejectedValue(mockError),
        create: jest.fn().mockRejectedValue(new Error('Invalid multer file')),
        update: jest.fn().mockRejectedValue(mockError),
        delete: jest.fn().mockRejectedValue(mockError),
      } as unknown as ClothesMongoRepo;

      controller = new ClothesController(mockRepo);
    });
    test('Then getAll should throw an error', async () => {
      await controller.getAll(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });

    test('Then getById should throw an error', async () => {
      await controller.getById(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });

    test('Then search should throw an error', async () => {
      await controller.search(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });

    test('Then create should call next with an error if req.file is not defined', async () => {
      mockRequest.file = undefined;
      await controller.create(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        new HttpError(406, 'Not Acceptable', 'Invalid multer files')
      );
    });

    test('Then update should throw an error', async () => {
      mockRequest.file = undefined;
      await controller.update(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        new HttpError(406, 'Not Acceptable', 'Invalid multer files')
      );
    });

    test('Then delete should throw an error', async () => {
      await controller.delete(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
  describe('When creating a new clothingItem with valid input data and image files', () => {
    test('Then create should handle repo.create error', async () => {
      const mockRequest = {
        files: {
          clothingItemFrontImg: [
            {
              path: 'valid/path/to/frontImage.jpg',
            },
          ],
          clothingItemBackImg: [
            {
              path: 'valid/path/to/backImage.jpg',
            },
          ],
        },
        body: {
          userId: 'someUserId',
        },
      } as unknown as Request;
      const mockRepo = {
        create: jest.fn().mockRejectedValue(new Error('Create error')),
      } as unknown as ClothesMongoRepo;
      const controller = new ClothesController(mockRepo);
      const mockCloudinaryService = {
        uploadImage: jest.fn(),
      };
      controller.cloudinaryService = mockCloudinaryService;
      await controller.create(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new Error('Create error'));
    });
  });
  describe('When updating an existing clothingItem with valid input data and image files', () => {
    test('Then update should handle repo.update error', async () => {
      const mockRequest = {
        files: {
          clothingItemFrontImg: [
            {
              path: 'valid/path/to/frontImage.jpg',
            },
          ],
          clothingItemBackImg: [
            {
              path: 'valid/path/to/backImage.jpg',
            },
          ],
        },
        body: {
          userId: 'someUserId',
        },
        params: {
          id: '1',
        },
      } as unknown as Request;

      const mockRepo = {
        update: jest.fn().mockRejectedValue(new Error('Update error')),
      } as unknown as ClothesMongoRepo;
      const mockExistingItem = {
        clothingItemFrontImg:
          'https://example.com/existingclothingItemFrontImg.jpg',
        clothingItemBackImg:
          'https://example.com/existingclothingItemBackImg.jpg',
      };
      const findByIdMock = jest.fn().mockResolvedValue(mockExistingItem);
      (ClothingItemModel.findById as jest.Mock) = findByIdMock;
      const controller = new ClothesController(mockRepo);
      const mockCloudinaryService = {
        uploadImage: jest.fn(),
      };
      controller.cloudinaryService = mockCloudinaryService;
      await controller.update(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new Error('Update error'));
    });
  });
});

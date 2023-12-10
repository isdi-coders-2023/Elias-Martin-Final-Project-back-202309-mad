import { Request, Response } from 'express';
import { FileInterceptor } from './file.interceptor';
import multer from 'multer';

jest.mock('multer');

describe('Given FileInterceptor class', () => {
  const middlewareMock = jest.fn();
  const single = jest.fn().mockReturnValue(middlewareMock);
  const fields = jest.fn().mockReturnValue(middlewareMock);
  multer.diskStorage = jest
    .fn()
    .mockImplementation(({ filename }) => filename('', '', () => {}));
  (multer as unknown as jest.Mock).mockReturnValue({
    single,
    fields,
  });

  describe('When we instantiate it', () => {
    const interceptor = new FileInterceptor();

    test('Then singleFileStore should be used', () => {
      interceptor.singleFileStore()({} as Request, {} as Response, jest.fn());
      expect(multer.diskStorage).toHaveBeenCalled();
      expect(single).toHaveBeenCalled();
      expect(middlewareMock).toHaveBeenCalled();
    });

    test('Then multiFileStore should be used with default fileSize', () => {
      interceptor.multiFileStore()({} as Request, {} as Response, jest.fn());
      expect(multer.diskStorage).toHaveBeenCalled();
      expect(fields).toHaveBeenCalled();
      expect(middlewareMock).toHaveBeenCalled();
    });

    test('Then multiFileStore should be used with custom fileSize', () => {
      const customFileSize = 10_000_000;
      interceptor.multiFileStore(customFileSize)(
        {} as Request,
        {} as Response,
        jest.fn()
      );
      expect(multer.diskStorage).toHaveBeenCalled();
      expect(fields).toHaveBeenCalled();
      expect(middlewareMock).toHaveBeenCalled();
    });
  });
});

import { Auth } from './auth';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { TokenPayload } from '../types/token.payload';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Given Auth abstract class', () => {
  describe('When we use its methods without errors', () => {
    test('Then hash should return the hashed value', () => {
      (hash as jest.Mock).mockReturnValue('test');
      const mockValue = '';
      const result = Auth.hash(mockValue);
      expect(hash).toHaveBeenCalled();
      expect(result).toBe('test');
    });

    test('Then compare should return true', () => {
      (compare as jest.Mock).mockReturnValue(true);
      const mockValue = '';
      const result = Auth.compare(mockValue, mockValue);
      expect(compare).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    test('Then signJWT should return a signed JWT', () => {
      jwt.sign = jest.fn().mockReturnValue('test');
      const result = Auth.signJWT({} as TokenPayload);
      expect(jwt.sign).toHaveBeenCalled();
      expect(result).toBe('test');
    });

    test('Then verifyAndGetPayload should return the payload', () => {
      jwt.verify = jest.fn().mockReturnValue({});
      const result = Auth.verifyAndGetPayload('');
      expect(jwt.verify).toHaveBeenCalled();
      expect(result).toStrictEqual({});
    });
  });
  describe('When we use its methods with errors', () => {
    test('Then verifyAndGetPayload should throw an error', () => {
      jwt.verify = jest.fn().mockReturnValue('');
      expect(() => Auth.verifyAndGetPayload('')).toThrow();
      expect(jwt.verify).toHaveBeenCalled();
    });
  });
});

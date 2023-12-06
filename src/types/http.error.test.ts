import { HttpError } from './http.error.js';

describe('Given HttpError class', () => {
  describe('When we instantiate it', () => {
    const mockStatus = 1;
    const mockMessage = 'Test';
    const errorMock = new HttpError(mockStatus, mockMessage);
    test('Then it should have the properties status and statusMessage with the parameters value', () => {
      expect(errorMock).toHaveProperty('status', mockStatus);
      expect(errorMock).toHaveProperty('statusMessage', mockMessage);
    });
  });
});

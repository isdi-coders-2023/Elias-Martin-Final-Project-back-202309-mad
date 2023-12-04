import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../types/http.error.js';
import { Auth } from '../services/auth.js';
import { ClothesMongoRepo } from '../repos/clothes/clothes.mongo.repo.js';

const debug = createDebug('EPV:auth:interceptor');

export class AuthInterceptor {
  constructor() {
    debug('Instantiated');
  }

  authorization(req: Request, res: Response, next: NextFunction) {
    try {
      const tokenHeader = req.get('Authorization');
      if (!tokenHeader?.startsWith('Bearer'))
        throw new HttpError(401, 'Unauthorized');
      const token = tokenHeader.split(' ')[1];
      const tokenPayload = Auth.verifyAndGetPayload(token);
      req.body.userId = tokenPayload.id; // Temp userId equivaldría a tokenUserId
      req.body.tokenRole = tokenPayload.role;
      next();
    } catch (error) {
      next(error);
    }
  }

  // Puede ser que no sea necesario (al integrar un user con el rol de Admin)
  async authenticationClothes(req: Request, res: Response, next: NextFunction) {
    try {
      // Eres el usuario
      const userID = req.body.userId; // Temp userId equivaldría a tokenUserId
      // Quieres actuar sobre la prenda de ropa
      const clothesID = req.params.id;
      const repoClothes = new ClothesMongoRepo();
      const clothingItem = await repoClothes.getById(clothesID);
      if (clothingItem.creator.id !== userID)
        throw new HttpError(401, 'Unauthorized', 'User not valid');
      next();
    } catch (error) {
      next(error);
    }
  }

  isAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body.tokenRole !== 'Admin')
        throw new HttpError(403, 'Forbidden', 'Not authorized');
      next();
    } catch (error) {
      next(error);
    }
  }
}

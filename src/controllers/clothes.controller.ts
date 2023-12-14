import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import { Repository } from '../repos/repo.js';
import { ClothingItem } from '../entities/clothingItem.js';
import { Controller } from './controller.js';
import { HttpError } from '../types/http.error.js';
import { ClothingItemModel } from '../repos/clothes/clothes.mongo.model.js';

const debug = createDebug('EPV:clothes:controller');

export class ClothesController extends Controller<ClothingItem> {
  constructor(protected repo: Repository<ClothingItem>) {
    super(repo);
    debug('Instantiated');
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.author = { id: req.body.userId };

      if (!req.files)
        throw new HttpError(406, 'Not Acceptable', 'Invalid multer files');

      // eslint-disable-next-line no-undef
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const clothingItemFrontImg = await this.cloudinaryService.uploadImage(
        files.clothingItemFrontImg[0].path
      );
      const clothingItemBackImg = await this.cloudinaryService.uploadImage(
        files.clothingItemBackImg[0].path
      );

      req.body.clothingItemFrontImg = clothingItemFrontImg;
      req.body.clothingItemBackImg = clothingItemBackImg;

      super.create(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const existingItem = await ClothingItemModel.findById(req.params.id);
      const existingClothingItemFrontImg = existingItem!.clothingItemFrontImg;
      const existingClothingItemBackImg = existingItem!.clothingItemBackImg;
      if (!req.files)
        throw new HttpError(406, 'Not Acceptable', 'Invalid multer files');

      // eslint-disable-next-line no-undef
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const clothingItemFrontImg =
        files.clothingItemFrontImg && files.clothingItemFrontImg[0]?.path
          ? await this.cloudinaryService.uploadImage(
              files.clothingItemFrontImg[0].path
            )
          : existingClothingItemFrontImg;

      const clothingItemBackImg =
        files.clothingItemBackImg && files.clothingItemBackImg[0]?.path
          ? await this.cloudinaryService.uploadImage(
              files.clothingItemBackImg[0]?.path
            )
          : existingClothingItemBackImg;

      req.body.clothingItemFrontImg = clothingItemFrontImg;
      req.body.clothingItemBackImg = clothingItemBackImg;

      super.update(req, res, next);
    } catch (error) {
      next(error);
    }
  }
}

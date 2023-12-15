import { Router as createRouter } from 'express';
import { ClothesController } from '../controllers/clothes.controller.js';
import createDebug from 'debug';
import { ClothesMongoRepo } from '../repos/clothes/clothes.mongo.repo.js';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';
import { FileInterceptor } from '../middleware/file.interceptor.js';

const debug = createDebug('EPV:clothes:router');

export const clothesRouter = createRouter();
debug('Starting');

const repo = new ClothesMongoRepo();
const controller = new ClothesController(repo);
const interceptor = new AuthInterceptor();
const fileInterceptor = new FileInterceptor();

clothesRouter.get('/', controller.getAll.bind(controller));
clothesRouter.get('/search', controller.search.bind(controller));
clothesRouter.get('/:id', controller.getById.bind(controller));
clothesRouter.post(
  '/',
  interceptor.authorization.bind(interceptor),
  interceptor.isAdmin.bind(interceptor),
  fileInterceptor.multiFileStore().bind(fileInterceptor),
  controller.create.bind(controller)
);
clothesRouter.patch(
  '/:id',
  interceptor.authorization.bind(interceptor),
  interceptor.isAdmin.bind(interceptor),
  fileInterceptor.multiFileStore().bind(fileInterceptor),
  controller.update.bind(controller)
);
clothesRouter.delete(
  '/:id',
  interceptor.authorization.bind(interceptor),
  interceptor.isAdmin.bind(interceptor),
  controller.delete.bind(controller)
);

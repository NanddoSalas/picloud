import { Request, Response } from 'express';
import { User } from './entities';

export interface Context {
  req: Request;
  res: Response;
  user?: User;
}

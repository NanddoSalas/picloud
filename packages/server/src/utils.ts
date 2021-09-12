import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { User } from './entities';

// eslint-disable-next-line import/prefer-default-export
export const getUser = async (req: Request) => {
  const bearerHeader = req.headers.authorization;

  if (bearerHeader) {
    const [, accesToken] = bearerHeader.split(' ');

    try {
      const payload = jwt.verify(accesToken, process.env.SECRET_KEY!);
      const user = await User.findOne({ where: { id: (payload as any).id } });

      if (user?.tokenVersion === (payload as any).tokenVersion) return user;
    } catch (err) {
      return undefined;
    }
  }
  return undefined;
};

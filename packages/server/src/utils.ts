import { validate } from 'class-validator';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { User } from './entities';
import { InputError } from './objectTypes';

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

export const createAccesToken = async (user: User) => {
  const payload = {
    userId: user.id,
    tokenVersion: user.tokenVersion,
  };

  return jwt.sign(payload, process.env.SECRET_KEY!);
};

export const validateInput = async (
  input: any,
): Promise<InputError[] | undefined> => {
  const errors = await validate(input, {
    stopAtFirstError: true,
    validationError: { target: false, value: false },
  });

  if (errors.length === 0) return undefined;

  const formattedErrors: InputError[] = [];

  errors.forEach(({ property, constraints }) => {
    formattedErrors.push({
      path: property,
      message: Object.entries(constraints!)[0][1],
    });
  });

  return formattedErrors;
};

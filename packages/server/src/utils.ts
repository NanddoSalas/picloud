import { validate } from 'class-validator';
import { Request } from 'express';
import FileType from 'file-type';
import { FileUpload } from 'graphql-upload';
import jwt from 'jsonwebtoken';
import { v4 } from 'uuid';
import { Photo, User } from './entities';
import oAuth2Client from './oAuth2Client';
import { InputError } from './objectTypes';
import storage from './storage';

export const getUser = async (req: Request) => {
  const bearerHeader = req.headers.authorization;

  if (bearerHeader) {
    const [, accesToken] = bearerHeader.split(' ');

    try {
      const payload = jwt.verify(accesToken, process.env.SECRET_KEY!);
      const user = await User.findOne({
        where: { id: (payload as any).userId },
      });

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

export const authenticate = async (email: string, password: string) => {
  const user = await User.findOne({
    where: {
      email,
    },
  });

  const authenticated = await user?.checkPassword(password);

  if (authenticated) return user;

  return undefined;
};

export const authenticateWithGoogle = async (idToken: string) => {
  try {
    const loginTicket = await oAuth2Client.verifyIdToken({
      idToken,
      audience: process.env.CLIENT_ID,
    });
    const payload = loginTicket.getPayload();

    if (!payload) return undefined;

    const user = await User.findOne({ where: { googleId: payload.sub } });

    if (user) return user;

    return await User.create({
      name: payload.name,
      googleId: payload.sub,
    }).save();
  } catch (error) {
    return undefined;
  }
};

export const validateAndUploadPhoto = async (
  file: Promise<FileUpload>,
  user: User,
) => {
  try {
    const { createReadStream } = await file;

    const validationStream = createReadStream();
    const uploadStream = createReadStream();

    const fileTypeResult = await FileType.fromStream(validationStream);
    const mime = fileTypeResult?.mime;

    if (!mime?.includes('image/')) return undefined;

    const fileName = v4();

    const newFile = storage.bucket(process.env.BUCKET_NAME!).file(fileName);

    await new Promise((res, rej) => {
      uploadStream.pipe(
        newFile
          .createWriteStream({
            gzip: true,
            resumable: false,
            contentType: mime,
          })
          .on('finish', res)
          .on('error', rej),
      );
    });

    const photo = new Photo();
    photo.fileName = fileName;
    photo.owner = Promise.resolve(user);
    await photo.save();

    return photo;
  } catch (error) {
    return undefined;
  }
};

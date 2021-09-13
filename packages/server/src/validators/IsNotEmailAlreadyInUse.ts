import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { User } from '../entities';

@ValidatorConstraint({ async: true })
class IsNotEmailAlreadyInUseConstraint implements ValidatorConstraintInterface {
  async validate(email: string) {
    const count = await User.count({ where: { email } });

    return count === 0;
  }
}

export default function IsNotEmailAlreadyInUse(options?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      validator: IsNotEmailAlreadyInUseConstraint,
      propertyName,
      options,
    });
  };
}

import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
class MatchPropertyConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [propertyToMatch] = args.constraints;

    return value === (args.object as any)[propertyToMatch];
  }
}

export default function MatchProperty(
  propertyToMatch: string,
  options?: ValidationOptions,
) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      constraints: [propertyToMatch],
      target: object.constructor,
      validator: MatchPropertyConstraint,
      propertyName,
      options,
    });
  };
}

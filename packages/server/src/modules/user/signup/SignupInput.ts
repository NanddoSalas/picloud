import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { IsNotEmailAlreadyInUse, MatchProperty } from '../../../validators';

@InputType()
export default class SignupInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmailAlreadyInUse({ message: 'Email already in use!' })
  @IsEmail()
  email: string;

  @Field()
  @MatchProperty('passwordConfirmation', { message: 'Passwords do not match' })
  @Length(8, 20)
  password: string;

  @Field()
  passwordConfirmation: string;
}

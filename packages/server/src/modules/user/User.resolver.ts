import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { User } from '../../entities';
import { Context } from '../../types';
import {
  authenticate,
  authenticateWithGoogle,
  createAccesToken,
  validateInput,
} from '../../utils';
import { GoogleAuthInput, GoogleAuthPayload } from './googleAuth';
import LoginInput from './login/LoginInput';
import LoginPayload from './login/LoginPayload';
import { SignupInput, SignupPayload } from './signup';

@Resolver()
export default class UserResolver {
  @Query(() => User, { nullable: true })
  me(@Ctx() { user }: Context) {
    return user;
  }

  @Mutation(() => SignupPayload)
  async signup(@Arg('input') input: SignupInput): Promise<SignupPayload> {
    const inputErrors = await validateInput(input);

    if (inputErrors) return { inputErrors };

    const user = await User.create({
      name: input.name,
      email: input.email,
    }).setPassword(input.password);

    await user.save();

    return { user };
  }

  @Mutation(() => LoginPayload)
  async login(
    @Arg('input') { email, password }: LoginInput,
  ): Promise<LoginPayload> {
    const user = await authenticate(email, password);

    if (!user) return {};

    const accesToken = await createAccesToken(user);

    return { accesToken };
  }

  @Mutation(() => GoogleAuthPayload)
  async googleAuth(
    @Arg('input') { idToken }: GoogleAuthInput,
  ): Promise<GoogleAuthPayload> {
    const user = await authenticateWithGoogle(idToken);

    if (!user) return {};

    const accesToken = await createAccesToken(user);

    return { accesToken };
  }
}

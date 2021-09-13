import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { User } from '../../entities';
import { Context } from '../../types';
import { validateInput } from '../../utils';
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
}

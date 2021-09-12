/* eslint-disable class-methods-use-this */
import { Ctx, Query, Resolver } from 'type-graphql';
import { User } from '../../entities';
import { Context } from '../../types';

@Resolver()
export default class UserResolver {
  @Query(() => User, { nullable: true })
  me(@Ctx() { user }: Context) {
    return user;
  }
}

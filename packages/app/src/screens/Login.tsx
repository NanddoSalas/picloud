import { useLoginMutation } from '@picloud/controller';
import { Link, useTheme } from '@react-navigation/native';
import { setItemAsync } from 'expo-secure-store';
import {
  Button,
  Center,
  Divider,
  HStack,
  Text,
  VStack,
  ZStack,
} from 'native-base';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Keyboard } from 'react-native';
import FieldInput from '../components/FieldInput';

const Login = () => {
  const [login, { loading, client }] = useLoginMutation();
  const { control, handleSubmit, setError } = useForm();
  const { colors } = useTheme();

  const handleLogin = async (loginInput: {
    email: string;
    password: string;
  }) => {
    Keyboard.dismiss();

    const { data } = await login({ variables: { loginInput } });

    // TODO: handle error
    if (!data) return;

    const { accesToken } = data.login;

    if (accesToken) {
      await setItemAsync('accesToken', accesToken);
      client.refetchQueries({ include: ['Me'] });
    } else {
      setError('email', {});
      setError('password', { message: 'Invalid Credentials' });
    }
  };

  // TODO: add google login logic
  const handleGoogleLogin = async () => {};

  return (
    <Center safeArea flex={1}>
      <VStack
        w="80%"
        space="lg"
        bgColor={colors.card}
        padding={8}
        shadow={3}
        borderRadius="lg"
      >
        <FieldInput label="Email" name="email" control={control} />
        <FieldInput label="Password" name="password" control={control} />

        <Button
          onPress={handleSubmit(handleLogin)}
          colorScheme="darkBlue"
          isLoading={loading}
          _loading={{
            colorScheme: 'darkBlue',
          }}
        >
          Login
        </Button>

        <HStack alignItems="center" justifyContent="center">
          <Text color="light.400">
            Don&apos;t have an account.
            <Link to={{ screen: 'Signup' }} style={{ color: colors.primary }}>
              {'   Sign up'}
            </Link>
          </Text>
        </HStack>

        <ZStack alignItems="center" justifyContent="center" mb={3}>
          <Divider bgColor="gray.400" />
          <Center bgColor={colors.card} px={2}>
            <Text color="light.300">Or continue with</Text>
          </Center>
        </ZStack>

        <Button
          isDisabled={loading}
          colorScheme="red"
          onPress={handleGoogleLogin}
        >
          Google
        </Button>
      </VStack>
    </Center>
  );
};

export default Login;

import { useSignupMutation } from '@picloud/controller';
import { Link, useTheme } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Center, HStack, Text, VStack } from 'native-base';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Keyboard } from 'react-native';
import FieldInput from '../components/FieldInput';
import { StackParams } from '../types';

type FormValues = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

const Signup: React.FC<NativeStackScreenProps<StackParams>> = ({
  navigation,
}) => {
  const [signup, { loading }] = useSignupMutation();
  const { control, handleSubmit, setError } = useForm();
  const { colors } = useTheme();

  const handleSignup = async (formValues: FormValues) => {
    Keyboard.dismiss();

    const { data } = await signup({ variables: { signupInput: formValues } });

    // TODO: handle error
    if (!data) return;

    const { user, inputErrors } = data.signup;

    // TODO: show succesful signup message
    if (user) navigation.navigate('Login');
    else {
      inputErrors?.forEach(({ message, path }) => setError(path, { message }));
    }
  };

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
        <FieldInput label="Name" name="name" control={control} />
        <FieldInput label="Email" name="email" control={control} />
        <FieldInput label="Password" name="password" control={control} />
        <FieldInput
          label="Password Confirmation"
          name="passwordConfirmation"
          control={control}
        />

        <Button
          onPress={handleSubmit(handleSignup)}
          colorScheme="darkBlue"
          isLoading={loading}
          _loading={{
            colorScheme: 'darkBlue',
          }}
        >
          Signup
        </Button>

        <HStack alignItems="center" justifyContent="center">
          <Text color="light.400">
            Already have an account.
            <Link to={{ screen: 'Login' }} style={{ color: colors.primary }}>
              {'   Log in'}
            </Link>
          </Text>
        </HStack>
      </VStack>
    </Center>
  );
};

export default Signup;

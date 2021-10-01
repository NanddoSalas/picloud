import { useTheme } from '@react-navigation/native';
import { FormControl, Input } from 'native-base';
import React from 'react';
import { useController } from 'react-hook-form';

interface FieldInputProps {
  name: string;
  label: string;
  control: any;
}

const FieldInput: React.FC<FieldInputProps> = ({ name, label, control }) => {
  const { colors } = useTheme();
  const { field, fieldState } = useController({
    name,
    control,
    defaultValue: '',
  });

  return (
    <FormControl isInvalid={fieldState.invalid}>
      <FormControl.Label _text={{ color: 'lightText', fontSize: 'lg' }}>
        {label}
      </FormControl.Label>
      <Input
        size="md"
        borderColor={colors.border}
        color="lightText"
        _focus={{ borderColor: colors.primary }}
        value={field.value}
        onBlur={field.onBlur}
        onChangeText={field.onChange}
      />
      {fieldState.error?.message && (
        <FormControl.ErrorMessage>
          {fieldState.error?.message}
        </FormControl.ErrorMessage>
      )}
    </FormControl>
  );
};

export default FieldInput;

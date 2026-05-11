import React, { useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { datePickerStyles } from './DatePickerInput.styles';

export interface DatePickerInputProps {
  label: string;
  value: string;
  onChangeDate: (isoDate: string) => void;
  error?: string;
  disabled?: boolean;
  minimumDate?: Date;
  testID?: string;
}

const parseIsoToDate = (isoString: string): Date | undefined => {
  if (!isoString) return undefined;
  const [year, month, day] = isoString.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return isNaN(d.getTime()) ? undefined : d;
};

const formatDateDisplay = (isoString: string): string => {
  const date = parseIsoToDate(isoString);
  if (!date) return '';
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const toIsoDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const DatePickerInput: React.FC<DatePickerInputProps> = ({
  label,
  value,
  onChangeDate,
  error,
  disabled = false,
  minimumDate,
  testID,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const selectedDate = parseIsoToDate(value) ?? minimumDate ?? new Date();

  const handlePress = (): void => {
    if (!disabled) {
      setShowPicker(true);
    }
  };

  const handleChange = (_event: DateTimePickerEvent, date?: Date): void => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (date) {
      onChangeDate(toIsoDate(date));
    }
  };

  const handleIOSConfirm = (): void => {
    setShowPicker(false);
  };

  const displayText = formatDateDisplay(value);

  return (
    <View style={datePickerStyles.container} testID={testID}>
      <Text style={datePickerStyles.label} testID={`${testID}-label`}>
        {label}
      </Text>

      <TouchableOpacity
        testID={`${testID}-button`}
        style={[
          datePickerStyles.touchable,
          error ? datePickerStyles.touchableError : null,
          disabled ? datePickerStyles.touchableDisabled : null,
        ]}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text
          style={[
            displayText ? datePickerStyles.valueText : datePickerStyles.placeholderText,
            disabled ? datePickerStyles.disabledText : null,
          ]}
          testID={`${testID}-value`}
        >
          {displayText || 'Seleccionar fecha'}
        </Text>
        <Text style={datePickerStyles.icon}>📅</Text>
      </TouchableOpacity>

      {error && (
        <Text style={datePickerStyles.errorText} testID={`${testID}-error`}>
          {error}
        </Text>
      )}

      {showPicker && (
        <>
          <DateTimePicker
            testID={`${testID}-picker`}
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleChange}
            minimumDate={minimumDate}
          />
          {Platform.OS === 'ios' && (
            <TouchableOpacity
              testID={`${testID}-confirm`}
              onPress={handleIOSConfirm}
              style={datePickerStyles.touchable}
            >
              <Text style={datePickerStyles.valueText}>Confirmar</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

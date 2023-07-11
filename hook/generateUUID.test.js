import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { generateUUID } from './generateUUID';

describe('generateUUID', () => {
  test('returns a string with the specified number of digits', () => {
    const digits = 10;
    const uuid = generateUUID(digits);

    expect(uuid).toHaveLength(digits);
    expect(typeof uuid).toBe('string');
  });
});



  
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

  test('generates a unique ID', () => {
    const digits = 8;
    const iterations = 1000;
    const generatedUUIDs = new Set();
  
    for (let i = 0; i < iterations; i++) {
      const uuid = generateUUID(digits);
      generatedUUIDs.add(uuid);
    }
  
    expect(generatedUUIDs.size).toBe(iterations);
  });
});



  
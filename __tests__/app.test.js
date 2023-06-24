/* import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

// Mock dependencies
jest.mock('expo-font', () => ({
  useFonts: jest.fn().mockReturnValue([true]),
}));
jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

// mock firebase
jest.mock('../firebaseConfig', () => ({
    initializeApp: jest.fn(),
}));

//mock 

describe('App', () => {
  test('renders the MainStack component', () => {
    const { getByTestId } = render(<App />);
    const mainStackComponent = getByTestId('main-stack');
    expect(mainStackComponent).toBeDefined();
  });

  test('hides the splash screen after loading fonts', () => {
    render(<App />);
    expect(require('expo-splash-screen').hideAsync).toHaveBeenCalled();
  });
});
 */
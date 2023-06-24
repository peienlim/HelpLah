/* import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SignUpScreen from '../screens/signUp';

describe('SignUpScreen', () => {
  it('renders all input fields correctly', () => {
    const { getByPlaceholder } = render(<SignUpScreen />);
    
    const nameInput = getByPlaceholder('Name...');
    const emailInput = getByPlaceholder('Email...');
    const passwordInput = getByPlaceholder('Password...');
    const confirmPasswordInput = getByPlaceholder('Confirm Password...');
    
    expect(nameInput).toBeDefined();
    expect(emailInput).toBeDefined();
    expect(passwordInput).toBeDefined();
    expect(confirmPasswordInput).toBeDefined();
  });

  it('calls handleSignUp function when Sign Up button is pressed', () => {
    const handleSignUpMock = jest.fn();
    const { getByText } = render(<SignUpScreen handleSignUp={handleSignUpMock} />);
    
    const signUpButton = getByText('Sign Up');
    fireEvent.press(signUpButton);
    
    expect(handleSignUpMock).toHaveBeenCalledTimes(1);
  });
}); */
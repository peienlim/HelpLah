import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FocusScreen from './focus';
import CountDownTimer from '../components/countdownTimer';

describe("Focus Screen", () => {

    test('renders "Enter" button that opens the modal', () => {
        // Render the focus screen component
        const { getByText, getByTestId } = render(<FocusScreen />);
        
        // Find the "Select-Time" button and simulate a press event
        const selectTimeButton = getByTestId('enter-button');
        fireEvent.press(selectTimeButton);
        
        // Assert that the modal is visible
        const modalComponent = getByTestId('modal-component');
        expect(modalComponent).toBeTruthy();
    });
    
});

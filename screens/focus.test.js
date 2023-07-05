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

    /* test('closes the modal when "Done" button is pressed', () => {
        // Render the component with the modal open
        const { getByTestId, queryByTestId } = render(<FocusScreen />);
        const selectTimeButton = getByTestId('select-time-button');
        fireEvent.press(selectTimeButton);
      
        // Find the "Done" button and simulate a press event
        const doneButton = getByTestId('done-button'); 
        fireEvent.press(doneButton);
      
        // Assert that the modal is no longer visible
        expect(queryByTestId('modal-component')).toBeNull();
    });

    test('displays the countdown timer', () => {
        // Render the component
        const { getByTestId, queryByTestId } = render(<FocusScreen />);

        // Find the countdown timer component
        const countdownTimer = queryByTestId('countdown-timer');

        // Assert that the countdown timer component is present
        expect(countdownTimer).toBeTruthy();

        // Assert that the countdown timer displays the default 15 min timing
        expect(countdownTimer).toHaveTextContent('15:00');

    }); */
    
});

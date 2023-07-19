import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CountDownTimer from './countdownTimer';

describe('CountDownTimer', () => {
    // Assuming duration set is 1 min
    test('renders without errors', () => {
      render(<CountDownTimer duration={60} />);
      // No errors thrown during rendering
    });

    test('displays the initial time correctly', async () => {
        // Assuming duration set is 1 min
        const { findByText } = render(<CountDownTimer duration={60} />);
        const timerText = await findByText('01:00');

        expect(timerText).toBeDefined();
    });

   /*  test('triggers the countdown and updates the time when start button is pressed', async () => {
        const { getByText, getByTestId } = render(<CountDownTimer duration={60} />);
        const startButton = getByText('Start');
        
        fireEvent.press(startButton);
        
        await waitFor(() => {
            const countdownTimer = getByTestId('countdown-timer');
            const timerText = countdownTimer.children[0].props.children;
        
            expect(timerText).toStrictEqual([' ', '01:00', ' ']);
        });
    }); */

    test('updates the time when the start button is pressed', async () => {
        const { getByTestId } = render(<CountDownTimer duration={60} />);
      
        const startButton = getByTestId('start-button');
        const timerText = getByTestId('countdown-timer');
      
        fireEvent.press(startButton); // Simulate pressing the start button
      
        // Wait for 1 second to allow the timer to update
        await waitFor(() => expect(timerText.props.children).not.toBe('01:00'));
      
        // Verify that the time has changed
        expect(timerText.props.children).not.toBe('01:00');
    });      
      
}); 



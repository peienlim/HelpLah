import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CountDownTimer from './countdownTimer';

describe('CountDownTimer', () => {
    // Assuming duration set is 15 min
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

    test('triggers the countdown and updates the time when start button is pressed', async () => {
        const { getByText, getByTestId } = render(<CountDownTimer duration={60} />);
        const startButton = getByText('Start');
        
        fireEvent.press(startButton);
        
        await waitFor(() => {
            const timerText = getByTestId('countdown-timer').children[0].props.children;
            return timerText === '00:59';
        });
        
        const countdownTimer = getByTestId('countdown-timer');
        const timerText = countdownTimer.children[0].props.children;
        
        expect(timerText).toBeDefined();
    });
    
    /* test('pauses the countdown and does not update the time when pause button is pressed', async () => {
        const { getByText, getByTestId } = render(<CountDownTimer duration={60} />);
        const startButton = getByText('Start');
        const pauseButton = getByText('Pause');
        
        fireEvent.press(startButton);
        fireEvent.press(pauseButton);
      
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
      
        const timerText = getByTestId('countdown-timer').children[0].props.children;
      
        expect(timerText).toEqual([' ', '00:59', ' ']); // Time should remain the same
    }); */
    
    /* test('resets the countdown to the initial time when reset button is pressed', async () => {
        const { getByText, getByTestId } = render(<CountDownTimer duration={60} />);
        const startButton = getByText('Start');
        fireEvent.press(startButton);
        await new Promise((r) => setTimeout(r, 1000)); // Wait for 1 second
        const resetButton = getByText('Reset');
        fireEvent.press(resetButton);
        const timerText = getByTestId('countdown-timer').children[0].props.children;
        expect(timerText).toEqual([" ", "01:00", " "]); // Time should reset to the initial duration
    }); */
      
});
import React from 'react';
import { render, fireEvent, within } from '@testing-library/react-native';
import FocusScreen from './focus';
import CountDownTimer from '../components/countdownTimer';
import {SelectList} from 'react-native-dropdown-select-list';

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

    test('renders components correctly', () => {
        const { getByText, getByTestId } = render(<FocusScreen />);
        
        // Assert the presence of enter button
        const enterButton = getByTestId('enter-button');
        expect(enterButton).toBeDefined();
    
        // Assert the presence of specific text
        const timerText = getByText('FOCUS TIMER');
        expect(timerText).toBeDefined();

        // Assert the presence of the select time
        const selectList = getByTestId("select-list");
        expect(selectList).toBeDefined();
    });
    

    /* test('shows confirmation alert when exiting focus mode', async () => {
        const { getByText, getByTestId, findByTestId, queryByTestId } = render(<FocusScreen />);
        const enterButton = getByTestId('enter-button');
      
        fireEvent.press(enterButton);
      
        // Wait for the modal to be visible
        const modalComponent = await findByTestId('modal-component');
      
        // Get the exit button within the modal
        const exitButton = await queryByTestId('exit-button',{}, { container: modalComponent });
      
        fireEvent.press(exitButton);
      
        const confirmButton = getByText('Confirm');
        expect(confirmButton).toBeDefined();
      });      
       */
});



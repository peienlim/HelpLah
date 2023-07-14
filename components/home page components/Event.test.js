import React from 'react';
import { render } from '@testing-library/react-native';
import Event from './Event';

describe("Event component", () => {
    test('renders correctly with the provided props', () => {
        const colour = 'red';
        const description = 'Sample Event';
      
        const { getByText, getByTestId } = render(<Event colour={colour} description={description} />);
        
        const eventContainer = getByTestId('event-container');
        expect(eventContainer).toBeTruthy();
      
        const eventText = getByText(description);
        expect(eventText).toBeTruthy();
        expect(eventText.props.style).toHaveProperty('fontFamily', 'spacemono', 'red');
    });
});

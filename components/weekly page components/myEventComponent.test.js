import React from 'react';
import { render } from '@testing-library/react-native';
import MyEventComponent from './myEventComponent';

describe('MyEventComponent', () => {
  
  test('renders correctly', () => {

    const event = {
      description: 'Sample Event',
      startDate: new Date(2023, 6, 6, 10, 0),
      endDate: new Date(2023, 6, 6, 12, 0),
    };

    const { getByText, findAllByText } = render(<MyEventComponent event={event} />);

    const descriptionText = getByText('Sample Event');
    const timeText = findAllByText('\n10\n:\n00\n-\n12\n:\n00');

    expect(descriptionText).toBeTruthy();
    expect(timeText).toBeTruthy();
  });
});

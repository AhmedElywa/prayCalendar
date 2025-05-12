import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Index from './index';

// Mock the CopyText component
jest.mock('Components/CopyText', () => {
  return {
    __esModule: true,
    default: ({ text }: { text: string }) => <div data-testid="copy-text">{text}</div>,
  };
});

// Mock ThemeMenu component
jest.mock('Components/Theme', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="theme-menu">Theme Menu</div>,
  };
});

// Mock defaultMethod
jest.mock('Components/defaultMethod', () => [
  { value: '0', label: 'Method 0' },
  { value: '5', label: 'Method 5' },
]);

describe('Index component', () => {
  it('renders without crashing', () => {
    render(<Index />);
    expect(screen.getByText('Generate Pray Calendar Subscribe link')).toBeInTheDocument();
  });

  it('updates address when input changes', () => {
    render(<Index />);
    const input = screen.getByLabelText(/Address/i);
    fireEvent.change(input, { target: { value: 'Cairo, Egypt' } });

    const copyText = screen.getByTestId('copy-text');
    expect(copyText.textContent).toContain('Cairo%2C%20Egypt');
  });

  it('updates method when select changes', () => {
    render(<Index />);
    const select = screen.getByLabelText(/Method/i);
    fireEvent.change(select, { target: { value: '0' } });

    const copyText = screen.getByTestId('copy-text');
    expect(copyText.textContent).toContain('method=0');
  });

  it('updates alarm when select changes', () => {
    render(<Index />);
    const select = screen.getByLabelText(/Alarm/i);
    fireEvent.change(select, { target: { value: '10' } });

    const copyText = screen.getByTestId('copy-text');
    expect(copyText.textContent).toContain('alarm=10');
  });

  it('toggles prayer events when checkboxes are clicked', () => {
    render(<Index />);

    // Get all checkboxes
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBe(7); // There should be 7 prayer events

    // By default all should be checked
    checkboxes.forEach((checkbox) => {
      expect(checkbox).toBeChecked();
    });

    // Uncheck the first prayer event (Fajr)
    fireEvent.click(checkboxes[0]);

    // Now the link should include the events parameter with the remaining events
    const copyText = screen.getByTestId('copy-text');
    expect(copyText.textContent).toContain('events=1,2,3,4,5,6');

    // Uncheck the second prayer event (Sunrise)
    fireEvent.click(checkboxes[1]);

    // Now the link should include just the remaining events
    expect(screen.getByTestId('copy-text').textContent).toContain('events=2,3,4,5,6');

    // Check the first one again
    fireEvent.click(checkboxes[0]);

    // Now the link should include the updated events
    expect(screen.getByTestId('copy-text').textContent).toContain('events=0,2,3,4,5,6');
  });
});

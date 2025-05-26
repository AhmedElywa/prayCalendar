import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Index from '../../pages/index';

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
  { value: '0', label: { en: 'Method 0', ar: 'طريقة 0' } },
  { value: '5', label: { en: 'Method 5', ar: 'طريقة 5' } },
]);

describe('Index component', () => {
  it('renders without crashing', () => {
    render(<Index />);
    expect(screen.getByRole('heading', { name: 'Generate Prayer Calendar Subscription Link' })).toBeInTheDocument();
  });

  it('updates address when input changes', async () => {
    render(<Index />);
    const input = screen.getByLabelText(/Location/i);
    fireEvent.change(input, { target: { value: 'Cairo, Egypt' } });

    await waitFor(() => {
      const copyText = screen.getByTestId('copy-text');
      expect(copyText.textContent).toContain('Cairo%2C%20Egypt');
      expect(copyText.textContent).toContain('lang=en');
    });
  });

  it('updates method when select changes', () => {
    render(<Index />);
    const select = screen.getByLabelText(/Method/i);
    fireEvent.change(select, { target: { value: '0' } });

    const copyText = screen.getByTestId('copy-text');
    expect(copyText.textContent).toContain('method=0');
    expect(copyText.textContent).toContain('lang=en');
  });

  it('updates alarm when checkboxes change', () => {
    render(<Index />);
    const tenBefore = screen.getByLabelText('10 minutes before');
    fireEvent.click(tenBefore);

    let copyText = screen.getByTestId('copy-text');
    expect(copyText.textContent).toContain('alarm=5,10');
    expect(copyText.textContent).toContain('lang=en');

    fireEvent.click(screen.getByLabelText('5 minutes before'));
    copyText = screen.getByTestId('copy-text');
    expect(copyText.textContent).toContain('alarm=10');
    expect(copyText.textContent).toContain('lang=en');
  });

  it('toggles prayer events when checkboxes are clicked', () => {
    render(<Index />);

    const eventNames = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Midnight'];
    const checkboxes = eventNames.map((name) => screen.getByLabelText(name));
    expect(checkboxes.length).toBe(7);

    checkboxes.forEach((checkbox) => {
      expect(checkbox).toBeChecked();
    });

    fireEvent.click(checkboxes[0]);
    let copyText = screen.getByTestId('copy-text');
    expect(copyText.textContent).toContain('events=1,2,3,4,5,6');
    expect(copyText.textContent).toContain('lang=en');

    fireEvent.click(checkboxes[1]);
    copyText = screen.getByTestId('copy-text');
    expect(copyText.textContent).toContain('events=2,3,4,5,6');
    expect(copyText.textContent).toContain('lang=en');

    fireEvent.click(checkboxes[0]);
    copyText = screen.getByTestId('copy-text');
    expect(copyText.textContent).toContain('events=0,2,3,4,5,6');
    expect(copyText.textContent).toContain('lang=en');
  });

  it('switches to coordinate mode and builds link with latitude/longitude', async () => {
    render(<Index />);

    // switch to coords radio
    fireEvent.click(screen.getByLabelText(/By coordinates/i));

    // fill latitude & longitude
    const latInput = screen.getByLabelText('Latitude');
    const lonInput = screen.getByLabelText('Longitude');
    fireEvent.change(latInput, { target: { value: '30.1' } });
    fireEvent.change(lonInput, { target: { value: '31.2' } });

    await waitFor(() => {
      const link = screen.getByTestId('copy-text').textContent;
      expect(link).toContain('latitude=30.1');
      expect(link).toContain('longitude=31.2');
      expect(link).not.toContain('address=');
    });
  });

  it('changes document dir when language is switched', () => {
    render(<Index />);
    expect(document.documentElement.dir).toBe('ltr');

    const languageSelect = screen.getAllByRole('combobox')[0]; // first select is language
    fireEvent.change(languageSelect, { target: { value: 'ar' } });

    expect(document.documentElement.lang).toBe('ar');
    expect(document.documentElement.dir).toBe('rtl');
  });
});

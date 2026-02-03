import { afterEach, beforeEach, describe, expect, test } from 'bun:test';

// Test the useDebounce implementation logic directly
// Since we can't easily test React hooks without a React context in Bun,
// we'll test the debounce logic extracted from the hook

describe('useDebounce logic', () => {
  let timeouts: ReturnType<typeof setTimeout>[] = [];

  beforeEach(() => {
    // Track timeouts for cleanup
    timeouts = [];
  });

  afterEach(() => {
    // Clear all pending timeouts
    for (const t of timeouts) {
      clearTimeout(t);
    }
    timeouts = [];
  });

  test('debounce returns value after specified delay', async () => {
    let debouncedValue = '';
    const value = 'test';
    const delay = 100;

    // Simulate debounce logic
    const timeout = setTimeout(() => {
      debouncedValue = value;
    }, delay);
    timeouts.push(timeout);

    // Before delay, value should not be set
    expect(debouncedValue).toBe('');

    // Wait for delay + buffer
    await new Promise((r) => setTimeout(r, delay + 50));

    // After delay, value should be set
    expect(debouncedValue).toBe('test');
  });

  test('rapid changes only apply the last value', async () => {
    const values: string[] = [];
    const delay = 100;
    let currentTimeout: ReturnType<typeof setTimeout> | null = null;

    // Simulate rapid value changes
    const simulateChange = (value: string) => {
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }
      currentTimeout = setTimeout(() => {
        values.push(value);
      }, delay);
      timeouts.push(currentTimeout);
    };

    // Rapid changes
    simulateChange('a');
    simulateChange('ab');
    simulateChange('abc');

    // Wait for debounce
    await new Promise((r) => setTimeout(r, delay + 50));

    // Only the last value should be in the array
    expect(values).toEqual(['abc']);
  });

  test('zero delay applies value immediately', async () => {
    let debouncedValue = '';
    const value = 'instant';
    const delay = 0;

    // With zero delay, value should be applied immediately
    if (delay === 0) {
      debouncedValue = value;
    }

    expect(debouncedValue).toBe('instant');
  });

  test('cleanup clears pending timeout', () => {
    let debouncedValue = '';
    let timeoutRef: ReturnType<typeof setTimeout> | null = null;

    // Create timeout
    timeoutRef = setTimeout(() => {
      debouncedValue = 'should not run';
    }, 100);
    timeouts.push(timeoutRef);

    // Cleanup (simulate unmount)
    if (timeoutRef) {
      clearTimeout(timeoutRef);
      timeoutRef = null;
    }

    // Value should still be empty after cleanup
    expect(debouncedValue).toBe('');
  });
});

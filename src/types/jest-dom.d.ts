import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toBeChecked(): R;
      toBeVisible(): R;
      toHaveTextContent(text: string): R;
      toHaveValue(value: any): R;
      toHaveAttribute(attr: string, value?: any): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toBeRequired(): R;
    }
  }
}

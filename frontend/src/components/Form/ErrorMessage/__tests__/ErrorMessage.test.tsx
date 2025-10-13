import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorMessage from '../ErrorMessage';

describe('ErrorMessage', () => {
  it('should render error message when provided', () => {
    render(<ErrorMessage message="This is an error" />);

    expect(screen.getByText('This is an error')).toBeInTheDocument();
  });

  it('should render with error class', () => {
    const { container } = render(<ErrorMessage message="This is an error" />);

    const errorSpan = container.querySelector('.error');
    expect(errorSpan).toBeInTheDocument();
    expect(errorSpan).toHaveTextContent('This is an error');
  });

  it('should not render when message is undefined', () => {
    const { container } = render(<ErrorMessage />);

    expect(container.firstChild).toBeNull();
  });

  it('should not render when message is empty string', () => {
    const { container } = render(<ErrorMessage message="" />);

    expect(container.firstChild).toBeNull();
  });

  it('should handle long error messages', () => {
    const longMessage =
      'This is a very long error message that should still render correctly';
    render(<ErrorMessage message={longMessage} />);

    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toast from '../Toast';

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render error toast with message', () => {
    render(<Toast message="Test error message" type="error" />);

    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByText('❌')).toBeInTheDocument();
  });

  it('should render success toast with message', () => {
    render(<Toast message="Test success message" type="success" />);

    expect(screen.getByText('Test success message')).toBeInTheDocument();
    expect(screen.getByText('✅')).toBeInTheDocument();
  });

  it('should render info toast with message', () => {
    render(<Toast message="Test info message" type="info" />);

    expect(screen.getByText('Test info message')).toBeInTheDocument();
    expect(screen.getByText('ℹ️')).toBeInTheDocument();
  });

  it('should not render when message is empty', () => {
    const { container } = render(<Toast message="" />);

    expect(container.firstChild).toBeNull();
  });

  it('should render close button when onClose is provided', () => {
    const onClose = vi.fn();
    render(<Toast message="Test message" onClose={onClose} />);

    expect(screen.getByLabelText('toast.close')).toBeInTheDocument();
  });

  it('should not render close button when onClose is not provided', () => {
    render(<Toast message="Test message" />);

    expect(screen.queryByLabelText('Fermer')).not.toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    vi.useRealTimers();
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Toast message="Test message" onClose={onClose} />);

    const closeButton = screen.getByLabelText('toast.close');
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
    vi.useFakeTimers();
  });

  it('should auto-close after duration', async () => {
    const onClose = vi.fn();
    render(<Toast message="Test message" onClose={onClose} duration={3000} />);

    expect(onClose).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(3000);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should use default duration of 5000ms', async () => {
    const onClose = vi.fn();
    render(<Toast message="Test message" onClose={onClose} />);

    await vi.advanceTimersByTimeAsync(4999);
    expect(onClose).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should apply correct CSS class based on type', () => {
    const { container, rerender } = render(
      <Toast message="Test" type="error" />
    );
    expect(container.querySelector('.toast-error')).toBeInTheDocument();

    rerender(<Toast message="Test" type="success" />);
    expect(container.querySelector('.toast-success')).toBeInTheDocument();

    rerender(<Toast message="Test" type="info" />);
    expect(container.querySelector('.toast-info')).toBeInTheDocument();
  });

  it('should clean up timer on unmount', () => {
    const onClose = vi.fn();
    const { unmount } = render(
      <Toast message="Test" onClose={onClose} duration={3000} />
    );

    unmount();
    vi.advanceTimersByTime(3000);

    expect(onClose).not.toHaveBeenCalled();
  });
});

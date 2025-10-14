import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import PaymentScheduleWarning from '../PaymentScheduleWarning';

describe('PaymentScheduleWarning', () => {
  test('should render the warning role and all text content from translations', () => {
    render(<PaymentScheduleWarning />);

    const warningElement = screen.getByRole('alert');
    expect(warningElement).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'table.warning.title' })
    ).toBeInTheDocument();

    expect(screen.getByText('table.warning.subtitle')).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        level: 3,
        name: 'table.warning.reasonsLabel',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 3,
        name: 'table.warning.solutionsLabel',
      })
    ).toBeInTheDocument();

    expect(screen.getByText('table.warning.reasons')).toBeInTheDocument();
    expect(
      screen.getByText('table.warning.solutionsToCheck')
    ).toBeInTheDocument();

    expect(screen.getByText('table.warning.solutions')).toBeInTheDocument();
  });

  test('should correctly split and render reasons with line breaks in the list', () => {
    render(<PaymentScheduleWarning />);

    const list = screen.getAllByRole('list')[0];

    expect(list).toHaveTextContent('table.warning.reasons');
  });

  test('should correctly split and render solutionsToCheck with line breaks in the list', () => {
    render(<PaymentScheduleWarning />);

    const list = screen.getAllByRole('list')[1];

    expect(list).toHaveTextContent('table.warning.solutionsToCheck');
  });
});

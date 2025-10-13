import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TableCell from '../TableCell';

describe('TableCell', () => {
  it('should render children content', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell>Test Content</TableCell>
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render as td element', () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <TableCell>Cell</TableCell>
          </tr>
        </tbody>
      </table>
    );

    const td = container.querySelector('td');
    expect(td).toBeInTheDocument();
  });

  it('should apply className when provided', () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <TableCell className="custom-class">Cell</TableCell>
          </tr>
        </tbody>
      </table>
    );

    const td = container.querySelector('td');
    expect(td).toHaveClass('custom-class');
  });

  it('should not have className when not provided', () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <TableCell>Cell</TableCell>
          </tr>
        </tbody>
      </table>
    );

    const td = container.querySelector('td');
    expect(td?.className).toBe('');
  });

  it('should apply colSpan attribute when provided', () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <TableCell colSpan={3}>Cell</TableCell>
          </tr>
        </tbody>
      </table>
    );

    const td = container.querySelector('td');
    expect(td).toHaveAttribute('colSpan', '3');
  });

  it('should not have colSpan when not provided', () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <TableCell>Cell</TableCell>
          </tr>
        </tbody>
      </table>
    );

    const td = container.querySelector('td');
    expect(td?.colSpan).toBe(1); // Default value
  });

  it('should render with both className and colSpan', () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <TableCell className="highlight" colSpan={2}>
              Cell
            </TableCell>
          </tr>
        </tbody>
      </table>
    );

    const td = container.querySelector('td');
    expect(td).toHaveClass('highlight');
    expect(td).toHaveAttribute('colSpan', '2');
  });

  it('should render numeric children', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell>{123}</TableCell>
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('should render React elements as children', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell>
              <span>Nested Content</span>
            </TableCell>
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByText('Nested Content')).toBeInTheDocument();
  });

  it('should render multiple children', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell>
              <span>First</span>
              <span>Second</span>
            </TableCell>
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });
});

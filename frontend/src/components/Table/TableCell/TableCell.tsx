interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}

export default function TableCell({
  children,
  className,
  colSpan,
}: TableCellProps): React.JSX.Element {
  return (
    <td className={className} colSpan={colSpan}>
      {children}
    </td>
  );
}

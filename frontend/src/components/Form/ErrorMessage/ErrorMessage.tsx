interface ErrorMessageProps {
  message?: string;
}

export default function ErrorMessage({
  message,
}: ErrorMessageProps): React.JSX.Element | null {
  if (!message) return null;

  return <span className="error">{message}</span>;
}

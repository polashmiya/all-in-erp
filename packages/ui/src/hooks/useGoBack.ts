import { useNavigate } from 'react-router';

export function useGoBack(fallback: string) {
  const navigate = useNavigate();
  return () => {
    const index = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    void (index > 0 ? navigate(-1) : navigate(fallback));
  };
}

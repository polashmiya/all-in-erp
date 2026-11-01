import { Button, Result } from 'antd';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router';
import { useHomePath } from '../shell/ShellContext';



export function NotFoundResult() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const home = useHomePath();

  return (
    <Result
      status="404"
      title={t('result.notFoundTitle')}
      subTitle={t('result.notFoundText')}
      extra={
        <Button type="primary" onClick={() => navigate(home)}>
          {t('result.backHome')}
        </Button>
      }
    />
  );
}

export function ForbiddenResult() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const home = useHomePath();

  return (
    <Result
      status="403"
      title={t('result.forbiddenTitle')}
      subTitle={t('result.forbiddenText')}
      extra={
        <Button type="primary" onClick={() => navigate(home)}>
          {t('result.backHome')}
        </Button>
      }
    />
  );
}

export function ErrorResult({ detail }: { detail?: string }) {
  const { t } = useTranslation();

  return (
    <Result
      status="500"
      title={t('result.errorTitle')}
      subTitle={detail ?? t('result.errorText')}
      extra={
        <Button type="primary" onClick={() => window.location.reload()}>
          {t('result.reload')}
        </Button>
      }
    />
  );
}

/** `errorElement` for data routers: maps route errors (404/403/thrown) to the right result. */
export function RouteErrorResult() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) return <NotFoundResult />;
    if (error.status === 403) return <ForbiddenResult />;
  }

  return <ErrorResult detail={import.meta.env.DEV && error instanceof Error ? error.message : undefined} />;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/** Catches render errors below it so one broken widget cannot blank the whole app. */
export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled render error', error, info.componentStack);
  }

  override render() {
    if (this.state.error) return <ErrorResult detail={import.meta.env.DEV ? this.state.error.message : undefined} />;
    return this.props.children;
  }
}

import { ArrowLeftOutlined } from '@ant-design/icons';
import type { CSSProperties, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { useLanguageStore } from '../../i18n/i18n';
import { localize } from '../../i18n/language';
import { useShell, useShellCrumbs } from '../app-shell/ShellContext';

export interface PageContainerProps {
  title?: ReactNode | false;
  subTitle?: ReactNode;
  tags?: ReactNode;
  extra?: ReactNode;
  backTo?: string;
  crumbs?: string[];
  fill?: boolean;
  style?: CSSProperties;
  children?: ReactNode;
}

export function PageHeader({
  title,
  subTitle,
  tags,
  extra,
  backTo,
}: Omit<PageContainerProps, 'crumbs' | 'fill' | 'children' | 'style'>) {
  const { t } = useTranslation();

  return (
    <div className="erp-page__head">
      <div className="erp-page__titles">
        <div className="erp-page__titlerow">
          {backTo && (
            <Link to={backTo} className="erp-backbtn" aria-label={t('shell.back')}>
              <ArrowLeftOutlined />
            </Link>
          )}
          <h1 className="erp-page__title">{title}</h1>
          {tags}
        </div>
        {subTitle && <p className="erp-page__sub">{subTitle}</p>}
      </div>
      {extra && <div className="erp-page__actions">{extra}</div>}
    </div>
  );
}

export function PageContainer({
  title,
  subTitle,
  tags,
  extra,
  backTo,
  crumbs = [],
  fill = false,
  style,
  children,
}: PageContainerProps) {
  const { trail } = useShell();
  const language = useLanguageStore((s) => s.language);
  const leaf = trail.at(-1);
  useShellCrumbs(crumbs);

  const heading =
    title === false ? null : (title ?? (leaf ? localize(leaf.label, language) : null));

  return (
    <div className={`erp-page${fill ? ' is-fill' : ''}`} style={style}>
      {(heading || extra) && (
        <PageHeader title={heading} subTitle={subTitle} tags={tags} extra={extra} backTo={backTo} />
      )}
      {children}
    </div>
  );
}

export function ActionBar({ status, children }: { status?: ReactNode; children: ReactNode }) {
  return (
    <div className="erp-actionbar">
      <span className="erp-actionbar__status">{status}</span>
      <div className="erp-actionbar__actions">{children}</div>
    </div>
  );
}

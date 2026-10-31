import { HomeOutlined } from '@ant-design/icons';
import { PageContainer, type PageContainerProps } from '@ant-design/pro-components';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '../i18n/i18n';
import { localize } from '../i18n/language';
import { useShell } from './ShellContext';

export type ShellPageProps = PageContainerProps & {
  /** Extra breadcrumb crumbs after the menu trail, e.g. "New" or a record code. */
  crumbs?: string[];
};

/**
 * Page frame used by every screen: title + breadcrumb derived from the menu trail
 * (Home / Module / Sub-module / Feature), so pages never hand-build navigation chrome.
 */
export function ShellPage({ crumbs = [], title, ...props }: ShellPageProps) {
  const { t } = useTranslation();
  const { trail } = useShell();
  const language = useLanguageStore((s) => s.language);
  const leaf = trail.at(-1);

  const items = [
    { title: <Link to="/dashboard" aria-label={t('shell.home')}><HomeOutlined /></Link> },
    ...trail.map((node, index) => {
      const label = localize(node.label, language);
      const linkable = node.path && (index < trail.length - 1 || crumbs.length > 0);
      return { title: linkable ? <Link to={node.path!}>{label}</Link> : label };
    }),
    ...crumbs.map((crumb) => ({ title: crumb })),
  ];

  return (
    <PageContainer
      title={title ?? (leaf ? localize(leaf.label, language) : undefined)}
      breadcrumb={items.length > 1 ? { items } : undefined}
      {...props}
    />
  );
}

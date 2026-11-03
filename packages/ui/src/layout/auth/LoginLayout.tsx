import { Grid } from 'antd';
import type { ReactNode } from 'react';
import { BrandMark } from '../../components/brand/BrandMark';
import { LanguageSegmented } from '../../components/navigation/LanguageSegmented';
import { ProductPreview } from './ProductPreview';

export interface LoginFeature {
  icon: ReactNode;
  title: string;
  description: string;
}

export interface LoginLayoutProps {
  appName: string;
  announcement?: string;
  headline: string;
  description: string;
  features: LoginFeature[];
  preview: { stats: string[]; publishedTitle: string; publishedMeta: string; roleNote: string };
  footerNote: string;
  footerExtra?: ReactNode;
  children: ReactNode;
}

export function LoginLayout({
  appName,
  announcement,
  headline,
  description,
  features,
  preview,
  footerNote,
  footerExtra,
  children,
}: LoginLayoutProps) {
  const screens = Grid.useBreakpoint();
  const showBrand = screens.lg === true;

  return (
    <div className="erp-login">
      <section className="erp-login__form">
        <header className="erp-login__head">
          <span className="erp-login__brand">
            <BrandMark size={34} />
            <span>{appName}</span>
          </span>
          <LanguageSegmented />
        </header>
        <div className="erp-login__body">
          <div className="erp-login__inner">{children}</div>
        </div>
        <footer className="erp-login__foot">
          <span>{footerNote}</span>
          {footerExtra}
        </footer>
      </section>

      {showBrand && (
        <section className="erp-login__brandpanel" aria-label={headline}>
          <div className="erp-login__copy">
            {announcement && (
              <span className="erp-login__pill">
                <span className="erp-login__pilldot" />
                {announcement}
              </span>
            )}
            <h2>{headline}</h2>
            <p>{description}</p>
          </div>
          <div className="erp-login__preview">
            <ProductPreview {...preview} />
          </div>
          <div className="erp-login__features">
            {features.map((feature) => (
              <div key={feature.title} className="erp-login__feature">
                <span className="erp-login__featicon">{feature.icon}</span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span className="erp-login__feattitle">{feature.title}</span>
                  <span className="erp-login__featdesc">{feature.description}</span>
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

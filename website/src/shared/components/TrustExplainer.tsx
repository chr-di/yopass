import { useTranslation } from 'react-i18next';

export default function TrustExplainer() {
  const { t } = useTranslation();
  const bullets = [
    t('trust.bulletOneTime'),
    t('trust.bulletExpires'),
    t('trust.bulletNoAccount'),
  ];

  return (
    <section
      className="mb-4 border-y border-base-300 py-3"
      aria-labelledby="trust-heading"
      data-testid="trust-explainer"
    >
      <h3 id="trust-heading" className="text-xl leading-tight">
        {t('trust.heading')}
      </h3>
      <p className="mt-1.5 text-[13px] leading-[1.35] text-base-content/80">
        {t('trust.body')}
      </p>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1" role="list">
        {bullets.map(bullet => (
          <li
            key={bullet}
            className="flex items-center gap-1.5 text-xs text-base-content"
          >
            <span
              aria-hidden="true"
              className="size-1.5 shrink-0 rounded-[2px] bg-primary"
            />
            {bullet}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[11px] leading-tight text-base-content/70">
        {t('trust.footnote')}
      </p>
    </section>
  );
}

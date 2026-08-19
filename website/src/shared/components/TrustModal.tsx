import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

// Sections are keyed explicitly rather than generated, so the i18n type
// definition stays exhaustive and a missing translation fails the build.
const SECTION_KEYS = ['Sending', 'Link', 'Visibility', 'Tips'] as const;

interface TrustModalProps {
  onClose: () => void;
}

export default function TrustModal({ onClose }: TrustModalProps) {
  const { t } = useTranslation();
  const closeRef = useRef<HTMLButtonElement>(null);

  // Escape closes, and focus lands on the close button so keyboard users are
  // not stranded behind the overlay.
  useEffect(() => {
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="modal modal-open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="trust-modal-title"
    >
      <div className="modal-box max-w-lg">
        <h3 id="trust-modal-title" className="text-xl leading-tight">
          {t('trust.modalTitle')}
        </h3>
        <div className="mt-4 space-y-4">
          {SECTION_KEYS.map(key => (
            <section key={key}>
              <h4 className="text-sm font-semibold">
                {t(`trust.modal${key}Title`)}
              </h4>
              <p className="mt-1 text-sm leading-relaxed text-base-content/80">
                {t(`trust.modal${key}Body`)}
              </p>
            </section>
          ))}
        </div>
        <div className="modal-action">
          <button
            ref={closeRef}
            className="btn btn-sm btn-primary"
            onClick={onClose}
          >
            {t('trust.modalClose')}
          </button>
        </div>
      </div>
      {/* Clicking the backdrop closes, matching the app's other overlays */}
      <button
        type="button"
        className="modal-backdrop"
        aria-label={t('trust.modalClose')}
        onClick={onClose}
      />
    </div>
  );
}

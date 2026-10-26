/**
 * Give / Donate page.
 *
 * Displays the parish's M-Pesa paybill and account numbers for both
 * churches (CTK and SJTE), with copy-to-clipboard buttons and a short
 * walkthrough of the M-Pesa Pay Bill flow.
 *
 * IMPORTANT: This page is DISPLAY ONLY. It does not initiate, process,
 * or confirm any payment. The transaction happens in the user's own
 * M-Pesa app, exactly as with a printed paybill notice. No money moves
 * through this website.
 */

import { useEffect, useRef, useState } from 'react';
import { Copy, Check, Heart, Smartphone, Info } from 'lucide-react';
import { GIVING, expandAccounts } from '../config/giving';
import { PageHeader, SectionHeader } from '../components/ui';

export default function Give() {
  return (
    <main className="min-h-screen bg-background pb-16">
      <PageHeader
        eyebrow="Giving"
        title="Support the Parish"
        subtitle="Offertory, tithe, and hosts & wine contributions for CTK and SJTE"
      />

      <div className="container-page py-12 max-w-4xl space-y-12">
        <HowToGive />

        {GIVING.churches.map((church) => (
          <ChurchCard key={church.key} church={church} />
        ))}

        <FundExplanations />

        <section className="bg-primary-light/30 border border-primary/15 rounded-xl p-6 text-sm text-body">
          <p>
            For receipts, pledge arrangements, or bank transfer details,
            please contact the parish office on{' '}
            <a
              href={GIVING.contact.phoneHref}
              className="text-primary font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            >
              {GIVING.contact.phone}
            </a>{' '}
            or email{' '}
            <a
              href={GIVING.contact.emailHref}
              className="text-primary font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            >
              {GIVING.contact.email}
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}

function HowToGive() {
  const steps = [
    'Open M-Pesa on your phone.',
    'Choose Lipa na M-Pesa → Pay Bill.',
    'Enter the Paybill Number shown for your church.',
    'Enter the Account Number for the fund you wish to support.',
    'Enter the amount and your M-Pesa PIN.',
    'Confirm. You will receive an M-Pesa confirmation SMS.',
  ];

  return (
    <section className="bg-surface rounded-xl border border-border p-6 md:p-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center">
          <Info className="text-primary" size={20} aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-heading">
            How to give with M-Pesa
          </h2>
          <p className="text-xs text-muted">
            The transaction happens in your M-Pesa app — this page only
            shows the numbers.
          </p>
        </div>
      </div>
      <ol className="space-y-2.5">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-body">
            <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-on-primary text-xs font-bold">
              {i + 1}
            </span>
            <span className="pt-0.5">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ChurchCard({ church }) {
  const accounts = expandAccounts(church);

  return (
    <section className="bg-surface rounded-xl shadow-sm border border-border p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
          <Smartphone className="text-primary" size={24} aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-heading">{church.name}</h2>
          <p className="text-sm text-muted">M-Pesa Paybill</p>
        </div>
      </div>

      <CopyField label="Paybill Number" value={church.paybill} />

      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-sm font-semibold text-heading mb-3">
          Account Number — choose the fund:
        </p>

        {church.accountPrefix && (
          <div className="mb-4 rounded-lg border border-primary/20 bg-primary-light/40 px-4 py-3 text-xs text-body">
            Include the{' '}
            <span className="font-mono font-bold text-primary">
              {church.accountPrefix}
            </span>{' '}
            prefix exactly as shown, followed by a single space, then the
            fund name.
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-3">
          {accounts.map(({ key, label, account }) => (
            <CopyField key={key} label={label} value={account} compact />
          ))}
        </div>
      </div>
    </section>
  );
}

function FundExplanations() {
  const funds = Object.entries(GIVING.fundMeta).map(([key, meta]) => ({
    key,
    ...meta,
  }));

  return (
    <section>
      <SectionHeader
        title="Where Your Gift Goes"
        subtitle="Every contribution sustains the life of the parish."
        align="left"
        as="h2"
      />
      <div className="grid gap-4 md:grid-cols-3">
        {funds.map((fund) => (
          <article
            key={fund.key}
            className="bg-surface rounded-xl border border-border p-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <Heart size={16} className="text-primary" aria-hidden="true" />
              <h3 className="font-bold text-heading">{fund.label}</h3>
            </div>
            <p className="text-sm text-body leading-relaxed">
              {fund.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

/**
 * Labelled value with a copy-to-clipboard button.
 *
 * Behavior:
 *   - Click tries the Clipboard API first.
 *   - On success: shows "Copied" for 1.6s and announces via role=status.
 *   - On failure (insecure context, permissions denied, unsupported):
 *     falls back to selecting the value visually so the user can
 *     copy it manually. The button label becomes "Select" so the
 *     intent is clear.
 *   - The timeout is cleared on unmount so no state update fires
 *     after the component is gone.
 */
function CopyField({ label, value, compact = false }) {
  const [state, setState] = useState('idle'); // 'idle' | 'copied' | 'failed'
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const onCopy = async () => {
    // Cancel any pending timer from a previous click.
    if (timerRef.current) clearTimeout(timerRef.current);

    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        throw new Error('Clipboard API unavailable');
      }
      await navigator.clipboard.writeText(value);
      setState('copied');
      timerRef.current = setTimeout(() => setState('idle'), 1600);
    } catch {
      setState('failed');
      timerRef.current = setTimeout(() => setState('idle'), 1600);
    }
  };

  const isCopied = state === 'copied';
  const isFailed = state === 'failed';

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-lg border bg-surface-alt ${
        isFailed ? 'border-danger/40' : 'border-border'
      } ${compact ? 'px-3 py-2' : 'px-4 py-3'}`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-wider text-muted font-semibold">
          {label}
        </p>
        <p
          className={`font-mono font-bold text-heading break-all ${
            compact ? 'text-base' : 'text-xl'
          }`}
        >
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={onCopy}
        aria-label={
          isCopied
            ? `${label} copied`
            : isFailed
            ? `Could not copy ${label}. Select manually.`
            : `Copy ${label}`
        }
        className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg
                   text-sm font-semibold transition-colors
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                     isFailed
                       ? 'text-danger hover:bg-danger/10'
                       : 'text-primary hover:bg-primary-light'
                   }`}
      >
        {isCopied ? (
          <>
            <Check size={16} aria-hidden="true" /> Copied
          </>
        ) : isFailed ? (
          <>
            <Copy size={16} aria-hidden="true" /> Select
          </>
        ) : (
          <>
            <Copy size={16} aria-hidden="true" /> Copy
          </>
        )}
      </button>
      {/* Screen reader announcement without a visual element */}
      <span className="sr-only" role="status" aria-live="polite">
        {isCopied ? `${label} copied to clipboard` : ''}
      </span>
    </div>
  );
}
/**
 * Parish giving details.
 *
 * Single source of truth for paybill numbers, account numbers, and
 * fund descriptions for both churches (CTK and SJTE). Update here when
 * the parish changes accounts — do not scatter these numbers across
 * components or pages.
 *
 * Account conventions:
 *   - CTK uses plain account names: "sadaka", "tithe", "h/w".
 *   - SJTE uses "<code> <fund>": "150520 sadaka", "150520 tithe",
 *     "150520 h/w". The 150520 prefix is required by SJTE's paybill
 *     and MUST be followed by a single space, then the fund name.
 *
 * "h/w" is used by BOTH churches to mean hosts & wine only — not
 * a general building/maintenance fund.
 *
 * To test after any change: run a KES 1 transaction on a real M-Pesa
 * line for each paybill + account combination. Confirm the parish
 * office sees it in their M-Pesa statement under the expected fund.
 */

export const GIVING = {
  /**
   * Shared fund metadata. Each church's `accounts` array references
   * these by key so labels and descriptions stay in sync. Only the
   * `account` string differs per church.
   */
  fundMeta: {
    sadaka: {
      label: 'Sadaka (Offertory)',
      description:
        'Weekly offertory supporting the day-to-day running of the parish — utilities, supplies, and staff.',
    },
    tithe: {
      label: 'Tithe',
      description:
        'A tenth of your income returned to God through the parish for pastoral work and outreach.',
    },
    hw: {
      label: 'H/W (Hosts & Wine)',
      description:
        'Provides the hosts and wine used at every Mass celebrated in the parish.',
    },
  },

  churches: [
    {
      key: 'ctk',
      name: 'Christ the King (CTK)',
      shortName: 'CTK',
      paybill: '653472',
      accounts: [
        { fund: 'sadaka', account: 'sadaka' },
        { fund: 'tithe', account: 'tithe' },
        { fund: 'hw', account: 'h/w' },
      ],
    },
    {
      key: 'sjte',
      name: 'St. John the Evangelist (SJTE)',
      shortName: 'SJTE',
      paybill: '899790',
      accountPrefix: '150520',
      accounts: [
        { fund: 'sadaka', account: '150520 sadaka' },
        { fund: 'tithe', account: '150520 tithe' },
        { fund: 'hw', account: '150520 h/w' },
      ],
    },
  ],

  /** Contact shown on the Give page for receipt/query questions. */
  contact: {
    phone: '020 2495785',
    phoneHref: 'tel:0202495785',
    email: 'ctkcatholicparishemba@gmail.com',
    emailHref: 'mailto:ctkcatholicparishemba@gmail.com',
  },
};

/**
 * Helper: expand a church's account list into fully-rendered objects
 * with label and description pulled from fundMeta.
 */
export function expandAccounts(church) {
  return church.accounts.map(({ fund, account }) => ({
    key: fund,
    account,
    ...GIVING.fundMeta[fund],
  }));
}
/**
 * Bulletins Manager.
 *
 * Create and edit structured parish bulletins. Each bulletin has:
 *   - Title, Sunday date, language, status
 *   - An array of sections
 *   - Each section has a heading and a list of items
 *   - Each item can have rich HTML text and an optional mass animation table
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../../lib/apiClient';
import {
  Plus,
  Trash2,
  ArrowLeft,
  Save,
  Table as TableIcon,
  Loader2,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import RichTextEditor from '../../components/RichTextEditor';

/**
 * The standard template that loads when the secretary clicks
 * "Load Standard Template". Mirrors the printed bulletin layout.
 */
const DEFAULT_TEMPLATE = [
  {
    heading: "1. TODAY'S ANNOUNCEMENTS",
    items: [
      {
        html: '<p>Today is the <strong>30th Sunday</strong> in ordinary time year A.</p>',
      },
      {
        html: "<p>We thank all who have animated today's Mass;</p>",
        massTable: [
          { mass: 'First', ctk: '', sjte: '' },
          { mass: 'Second', ctk: '', sjte: '' },
          { mass: 'Third', ctk: '', sjte: '' },
          { mass: 'Fourth', ctk: '', sjte: '' },
        ],
      },
    ],
  },
  {
    heading: "2. THIS WEEK'S ANNOUNCEMENTS",
    items: [{ html: '' }],
  },
  {
    heading: "3. NEXT SUNDAY'S ANNOUNCEMENTS",
    items: [{ html: '' }],
  },
  {
    heading: '4. OTHER ANNOUNCEMENTS',
    items: [{ html: '' }],
  },
];

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

function todayLocalDate() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function formatSundayDate(value) {
  if (!value) return '—';
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  const d = match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const STATUS_META = {
  draft: {
    label: 'Draft',
    className: 'bg-surface-alt text-muted border border-border',
  },
  published: {
    label: 'Published',
    className:
      'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300',
  },
};

const LANGUAGE_LABEL = { en: 'English', sw: 'Kiswahili' };

// ---------------------------------------------------------------------
// List component
// ---------------------------------------------------------------------

export default function BulletinsManager() {
  const [bulletins, setBulletins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [busyIds, setBusyIds] = useState(() => new Set());

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Initial load
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.authGet('/admin/bulletins');
        if (cancelled || !mountedRef.current) return;
        setBulletins(Array.isArray(res.data) ? res.data : []);
        setError('');
      } catch (err) {
        if (cancelled || !mountedRef.current) return;
        setError(err.message || 'Failed to load bulletins');
      } finally {
        if (!cancelled && mountedRef.current) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Explicit refresh
  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.authGet('/admin/bulletins');
      if (!mountedRef.current) return;
      setBulletins(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err.message || 'Failed to load bulletins');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  const markBusy = (id, busy) =>
    setBusyIds((prev) => {
      const next = new Set(prev);
      if (busy) next.add(id);
      else next.delete(id);
      return next;
    });

  const handleDelete = async (bulletin) => {
    if (!window.confirm(`Delete "${bulletin.title}"? This cannot be undone.`)) {
      return;
    }

    markBusy(bulletin.id, true);
    try {
      await api.authDelete(`/admin/bulletins/${bulletin.id}`);
      if (!mountedRef.current) return;
      setBulletins((prev) => prev.filter((b) => b.id !== bulletin.id));
    } catch (err) {
      if (!mountedRef.current) return;
      alert(err.message || 'Failed to delete bulletin');
    } finally {
      if (mountedRef.current) markBusy(bulletin.id, false);
    }
  };

  if (showForm) {
    return (
      <BulletinForm
        id={editingId}
        onSuccess={() => {
          setShowForm(false);
          setEditingId(null);
          refresh();
        }}
        onCancel={() => {
          setShowForm(false);
          setEditingId(null);
        }}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-heading">Parish Bulletins</h2>
          <p className="text-muted text-sm">
            Structured announcements with rich text and mass tables.
            Drafts are hidden from the public site until published.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg
                     bg-primary text-on-primary text-sm font-semibold
                     hover:bg-primary-hover transition-colors
                     focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-primary focus-visible:ring-offset-2
                     shrink-0"
        >
          <Plus size={18} aria-hidden="true" />
          New Bulletin
        </button>
      </div>

      {loading ? (
        <div
          className="flex flex-col items-center justify-center h-64 gap-3 bg-surface rounded-xl border border-border"
          role="status"
          aria-live="polite"
        >
          <Loader2 className="w-8 h-8 text-primary animate-spin" aria-hidden="true" />
          <span className="text-sm text-muted">Loading bulletins…</span>
        </div>
      ) : error ? (
        <div
          role="alert"
          className="bg-red-500/10 border border-red-500/30 text-danger p-4 rounded-lg flex flex-col sm:flex-row sm:items-center gap-3"
        >
          <div className="flex items-start gap-2 flex-1">
            <AlertCircle size={18} className="shrink-0 mt-0.5" aria-hidden="true" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={refresh}
            className="px-4 py-2 rounded-lg border-2 border-primary text-primary
                       text-sm font-semibold hover:bg-primary hover:text-on-primary
                       transition-colors shrink-0
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Try again
          </button>
        </div>
      ) : bulletins.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-xl border border-border">
          <Calendar size={48} className="mx-auto text-muted mb-4" aria-hidden="true" />
          <p className="text-heading font-medium mb-1">No bulletins yet</p>
          <p className="text-sm text-muted mb-4">
            Create the first bulletin to get started.
          </p>
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                       bg-primary text-on-primary text-sm font-semibold
                       hover:bg-primary-hover transition-colors
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Plus size={16} aria-hidden="true" />
            Create the first bulletin
          </button>
        </div>
      ) : (
        <div className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-surface-alt border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                    Title / Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                    Language
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bulletins.map((b) => {
                  const busy = busyIds.has(b.id);
                  const status = STATUS_META[b.status] || STATUS_META.draft;
                  return (
                    <tr key={b.id} className="hover:bg-surface-alt/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-heading truncate max-w-xs">
                          {b.title || 'Untitled bulletin'}
                        </p>
                        <p className="text-xs text-muted mt-0.5">
                          {formatSundayDate(b.sunday_date)}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-body uppercase">
                        {LANGUAGE_LABEL[b.language] || b.language || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(b.id);
                              setShowForm(true);
                            }}
                            disabled={busy}
                            className="text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm disabled:opacity-40"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(b)}
                            disabled={busy}
                            className="inline-flex items-center gap-1 text-sm font-medium text-danger hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm disabled:opacity-40"
                          >
                            {busy && <Loader2 size={12} className="animate-spin" aria-hidden="true" />}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------
// Bulletin Form
// ---------------------------------------------------------------------

function BulletinForm({ id, onSuccess, onCancel }) {
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    sunday_date: todayLocalDate(),
    language: 'en',
    status: 'draft',
    sections: [],
  });
  const [fetchLoading, setFetchLoading] = useState(isEditing);
  const [fetchError, setFetchError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [titleError, setTitleError] = useState('');

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Load existing bulletin for editing and auto-heal data structure
  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await api.authGet(`/admin/bulletins/${id}`);
        if (cancelled || !mountedRef.current) return;

        const fetchedData = res.data;

        // Auto-heal: ensure sections and items are always valid arrays
        // so the RichTextEditor and table logic don't crash.
        let safeSections = Array.isArray(fetchedData.sections) ? fetchedData.sections : [];

        safeSections = safeSections.map((section) => ({
          ...section,
          heading: section.heading || '',
          items: Array.isArray(section.items)
            ? section.items.map((item) => ({
                ...item,
                // Ensure html is at least an empty string
                html: item.html || item.text || '',
              }))
            : [],
        }));

        setFormData((prev) => ({
          ...prev,
          ...fetchedData,
          sections: safeSections,
        }));
        setFetchError('');
      } catch (err) {
        if (cancelled || !mountedRef.current) return;
        console.error("Failed to load bulletin:", err);
        setFetchError(err.message || 'Failed to load bulletin');
      } finally {
        if (!cancelled && mountedRef.current) setFetchLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const loadTemplate = () => {
    setFormData((prev) => ({
      ...prev,
      sections: JSON.parse(JSON.stringify(DEFAULT_TEMPLATE)),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (saving) return;

    if (!formData.title.trim()) {
      setTitleError('Bulletin title is required');
      return;
    }
    setTitleError('');
    setSaveError('');

    setSaving(true);
    try {
      const payload = {
        ...formData,
        title: formData.title.trim(),
      };
      if (isEditing) {
        await api.authPut(`/admin/bulletins/${id}`, payload);
      } else {
        await api.authPost('/admin/bulletins', payload);
      }
      if (!mountedRef.current) return;
      onSuccess();
    } catch (err) {
      if (!mountedRef.current) return;
      setSaveError(err.message || 'Failed to save bulletin');
    } finally {
      if (mountedRef.current) setSaving(false);
    }
  };

  // ---- Immutable section / item / table helpers ----------------------

  const updateSection = (sIdx, field, value) => {
    setFormData((prev) => {
      const sections = prev.sections.map((s, i) =>
        i === sIdx ? { ...s, [field]: value } : s
      );
      return { ...prev, sections };
    });
  };

  const updateItem = (sIdx, iIdx, field, value) => {
    setFormData((prev) => {
      const sections = prev.sections.map((s, si) => {
        if (si !== sIdx) return s;
        const items = s.items.map((item, ii) =>
          ii === iIdx ? { ...item, [field]: value } : item
        );
        return { ...s, items };
      });
      return { ...prev, sections };
    });
  };

  const updateTableRow = (sIdx, iIdx, rIdx, field, value) => {
    setFormData((prev) => {
      const sections = prev.sections.map((s, si) => {
        if (si !== sIdx) return s;
        const items = s.items.map((item, ii) => {
          if (ii !== iIdx) return item;
          const massTable = item.massTable.map((row, ri) =>
            ri === rIdx ? { ...row, [field]: value } : row
          );
          return { ...item, massTable };
        });
        return { ...s, items };
      });
      return { ...prev, sections };
    });
  };

  const addItem = (sIdx) => {
    setFormData((prev) => {
      const sections = prev.sections.map((s, si) =>
        si === sIdx ? { ...s, items: [...s.items, { html: '' }] } : s
      );
      return { ...prev, sections };
    });
  };

  const removeItem = (sIdx, iIdx) => {
    setFormData((prev) => {
      const sections = prev.sections.map((s, si) =>
        si === sIdx
          ? { ...s, items: s.items.filter((_, ii) => ii !== iIdx) }
          : s
      );
      return { ...prev, sections };
    });
  };

  const addSection = () => {
    setFormData((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        { heading: 'New Section', items: [{ html: '' }] },
      ],
    }));
  };

  const removeSection = (sIdx) => {
    if (!window.confirm('Remove this entire section?')) return;
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== sIdx),
    }));
  };

  // ---- Toggle Mass Table ----
  const toggleMassTable = (sIdx, iIdx) => {
    setFormData((prev) => {
      const sections = prev.sections.map((s, si) => {
        if (si !== sIdx) return s;
        const items = s.items.map((item, ii) => {
          if (ii !== iIdx) return item;
          
          if (item.massTable) {
            const newItem = { ...item };
            delete newItem.massTable;
            return newItem;
          }
          
          return {
            ...item,
            massTable: [
              { mass: 'First', ctk: '', sjte: '' },
              { mass: 'Second', ctk: '', sjte: '' },
              { mass: 'Third', ctk: '', sjte: '' },
              { mass: 'Fourth', ctk: '', sjte: '' },
            ],
          };
        });
        return { ...s, items };
      });
      return { ...prev, sections };
    });
  };

  // ---- Renders -------------------------------------------------------

  if (fetchLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3" role="status" aria-live="polite">
        <Loader2 className="w-8 h-8 text-primary animate-spin" aria-hidden="true" />
        <span className="text-sm text-muted">Loading bulletin…</span>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 bg-surface rounded-xl border border-border">
        <AlertCircle size={40} className="mx-auto text-danger mb-3" aria-hidden="true" />
        <p className="text-body mb-4">{fetchError}</p>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:bg-primary-hover transition-colors"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Back to list
        </button>
      </div>
    );
  }

  const inputClass =
    'w-full px-3 py-2 bg-background text-body border border-border-strong rounded-lg ' +
    'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ' +
    'disabled:opacity-60 disabled:cursor-not-allowed';

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex items-center gap-2 text-muted hover:text-heading mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-1 py-0.5"
      >
        <ArrowLeft size={18} aria-hidden="true" />
        Back
      </button>

      <form onSubmit={handleSave} className="bg-surface rounded-xl shadow-sm border border-border p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b border-border pb-4">
          <h2 className="text-xl font-bold text-heading">
            {isEditing ? 'Edit Bulletin' : 'Create Bulletin'}
          </h2>
          <button
            type="button"
            onClick={loadTemplate}
            className="text-sm font-semibold text-primary bg-primary-light px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Load Standard Template
          </button>
        </div>

        {saveError && (
          <div role="alert" className="bg-red-500/10 border border-red-500/30 text-danger p-3 rounded-lg text-sm">
            {saveError}
          </div>
        )}

        {/* Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="bulletin-title" className="block text-sm font-medium text-heading mb-1">
              Bulletin Title <span className="text-danger">*</span>
            </label>
            <input
              id="bulletin-title"
              required
              value={formData.title}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, title: e.target.value }));
                if (titleError) setTitleError('');
              }}
              placeholder="e.g. 30th Sunday in Ordinary Time"
              aria-invalid={titleError ? 'true' : undefined}
              aria-describedby={titleError ? 'bulletin-title-error' : undefined}
              className={inputClass}
              disabled={saving}
            />
            {titleError && (
              <p id="bulletin-title-error" className="text-xs text-danger mt-1">
                {titleError}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="bulletin-date" className="block text-sm font-medium text-heading mb-1">
              Sunday Date
            </label>
            <input
              id="bulletin-date"
              type="date"
              required
              value={formData.sunday_date}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, sunday_date: e.target.value }))
              }
              className={inputClass}
              disabled={saving}
            />
          </div>
          <div>
            <label htmlFor="bulletin-language" className="block text-sm font-medium text-heading mb-1">
              Language
            </label>
            <select
              id="bulletin-language"
              value={formData.language}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, language: e.target.value }))
              }
              className={inputClass}
              disabled={saving}
            >
              <option value="en">English</option>
              <option value="sw">Kiswahili</option>
            </select>
          </div>
          <div>
            <label htmlFor="bulletin-status" className="block text-sm font-medium text-heading mb-1">
              Status
            </label>
            <select
              id="bulletin-status"
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, status: e.target.value }))
              }
              className={inputClass}
              disabled={saving}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8 mt-2">
          {formData.sections.length === 0 && (
            <div className="text-center py-8 bg-surface-alt rounded-lg border border-dashed border-border-strong">
              <p className="text-muted mb-4">
                No sections yet. Click "Load Standard Template" or add one manually.
              </p>
              <button
                type="button"
                onClick={addSection}
                className="text-sm text-primary font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              >
                + Add First Section
              </button>
            </div>
          )}

          {formData.sections.map((section, sIdx) => (
            <div key={sIdx} className="bg-surface-alt border border-border rounded-xl p-5">
              <div className="flex items-start gap-2 mb-4">
                <label htmlFor={`section-${sIdx}-heading`} className="sr-only">
                  Section {sIdx + 1} heading
                </label>
                <input
                  id={`section-${sIdx}-heading`}
                  value={section.heading || ''}
                  onChange={(e) => updateSection(sIdx, 'heading', e.target.value)}
                  className="flex-1 bg-transparent font-bold text-lg text-heading border-b-2 border-border-strong focus:outline-none focus:border-primary pb-1 disabled:opacity-60"
                  disabled={saving}
                />
                <button
                  type="button"
                  onClick={() => removeSection(sIdx)}
                  className="p-2 text-muted hover:text-danger rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label={`Remove section ${sIdx + 1}`}
                  title="Remove section"
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>

              {section.items?.map((item, iIdx) => (
                <div key={iIdx} className="mb-6 bg-surface p-4 rounded-lg border border-border shadow-sm">
                  <div className="flex gap-2 items-start">
                    <span className="text-muted font-mono text-sm mt-2 w-5 shrink-0" aria-hidden="true">
                      {String.fromCharCode(97 + iIdx)})
                    </span>
                    <div className="flex-1 min-w-0">
                      
                      {/* Rich Text */}
                      <RichTextEditor
                        content={item.html || ''}
                        onChange={(html) => updateItem(sIdx, iIdx, 'html', html)}
                      />

                      {/* Mass Table or Add Button */}
                      {item.massTable ? (
                        <div className="mt-4 border-t border-border pt-4 overflow-x-auto">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-sm font-semibold text-heading">
                              <TableIcon size={16} aria-hidden="true" />
                              Mass Animation Table
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleMassTable(sIdx, iIdx)}
                              className="text-xs text-danger hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                            >
                              Remove Table
                            </button>
                          </div>
                          <table className="w-full text-sm border-collapse min-w-[400px]">
                            <thead>
                              <tr className="bg-surface-alt">
                                <th className="border border-border p-2 text-left text-xs font-medium text-muted uppercase">
                                  Mass
                                </th>
                                <th className="border border-border p-2 text-left text-xs font-medium text-muted uppercase">
                                  CTK Group
                                </th>
                                <th className="border border-border p-2 text-left text-xs font-medium text-muted uppercase">
                                  SJTE Group
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {item.massTable.map((row, rIdx) => (
                                <tr key={rIdx}>
                                  <td className="border border-border p-1 bg-surface-alt font-medium text-heading w-1/4">
                                    {row.mass}
                                  </td>
                                  <td className="border border-border p-0">
                                    <input
                                      type="text"
                                      value={row.ctk || ''}
                                      onChange={(e) => updateTableRow(sIdx, iIdx, rIdx, 'ctk', e.target.value)}
                                      placeholder="e.g. St. Gabriel SCC"
                                      aria-label={`${row.mass} Mass, CTK group`}
                                      className="w-full px-2 py-1.5 bg-background text-body focus:outline-none focus:bg-primary-light/30"
                                      disabled={saving}
                                    />
                                  </td>
                                  <td className="border border-border p-0">
                                    <input
                                      type="text"
                                      value={row.sjte || ''}
                                      onChange={(e) => updateTableRow(sIdx, iIdx, rIdx, 'sjte', e.target.value)}
                                      placeholder="e.g. St. Mark SCC"
                                      aria-label={`${row.mass} Mass, SJTE group`}
                                      className="w-full px-2 py-1.5 bg-background text-body focus:outline-none focus:bg-primary-light/30"
                                      disabled={saving}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={() => toggleMassTable(sIdx, iIdx)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover transition-colors bg-primary-light px-3 py-1.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          >
                            <TableIcon size={14} aria-hidden="true" />
                            Add Mass Animation Table
                          </button>
                        </div>
                      )}

                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(sIdx, iIdx)}
                      className="p-2 text-muted hover:text-danger rounded shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label={`Remove item ${String.fromCharCode(97 + iIdx)} from section ${sIdx + 1}`}
                      title="Remove item"
                    >
                      <Trash2 size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addItem(sIdx)}
                className="text-sm text-primary font-semibold mt-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              >
                + Add Item
              </button>
            </div>
          ))}

          {formData.sections.length > 0 && (
            <button
              type="button"
              onClick={addSection}
              className="w-full py-3 border-2 border-dashed border-border-strong rounded-xl text-muted hover:border-primary hover:text-primary text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              + Add Section
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="px-4 py-2 text-body hover:bg-surface-alt rounded-lg font-medium disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-on-primary font-semibold text-sm hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                Saving…
              </>
            ) : (
              <>
                <Save size={16} aria-hidden="true" />
                Save Bulletin
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
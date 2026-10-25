/**
 * Bulletins Manager.
 *
 * Create and edit structured parish bulletins. Each bulletin has:
 *   - Title, Sunday date, language, status
 *   - An array of sections
 *   - Each section has a heading and a list of items
 *   - Each item can have rich HTML text and an optional mass animation table
 *
 * Uses Tiptap for rich text editing (React 19 compatible).
 */

import { useState, useEffect } from 'react';
import { api } from '../../lib/apiClient';
import { Plus, Trash2, ArrowLeft, Save, Table as TableIcon } from 'lucide-react';
import RichTextEditor from '../../components/RichTextEditor';

/**
 * The standard template that loads when the secretary clicks
 * "Load Standard Template". Mirrors the printed bulletin layout.
 */
const DEFAULT_TEMPLATE = [
  {
    heading: "1. TODAY'S ANNOUNCEMENTS",
    items: [
      { html: "<p>Today is the <strong>30th Sunday</strong> in ordinary time year A.</p>" },
      {
        html: "<p>We thank all who have animated today's Mass;</p>",
        massTable: [
          { mass: "First", ctk: "", sjte: "" },
          { mass: "Second", ctk: "", sjte: "" },
          { mass: "Third", ctk: "", sjte: "" },
          { mass: "Fourth", ctk: "", sjte: "" },
        ],
      },
    ],
  },
  {
    heading: "2. THIS WEEK'S ANNOUNCEMENTS",
    items: [{ html: "" }],
  },
  {
    heading: "3. NEXT SUNDAY'S ANNOUNCEMENTS",
    items: [{ html: "" }],
  },
  {
    heading: "4. OTHER ANNOUNCEMENTS",
    items: [{ html: "" }],
  },
];

export default function BulletinsManager() {
  const [bulletins, setBulletins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);



  const loadBulletins = async () => {
    setLoading(true);
    try {
      const res = await api.authGet('/admin/bulletins');
      setBulletins(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
    loadBulletins();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this bulletin?')) return;
    await api.authDelete(`/admin/bulletins/${id}`);
    loadBulletins();
  };

  if (showForm) {
    return (
      <BulletinForm
        id={editingId}
        onSuccess={() => {
          setShowForm(false);
          loadBulletins();
        }}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Parish Bulletins</h2>
          <p className="text-gray-500 text-sm">
            Structured announcements with rich text and mass tables
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setShowForm(true);
          }}
          className="bg-[#800000] text-white px-4 py-2 rounded-lg flex items-center gap-2
                     hover:bg-[#660000] transition-colors"
        >
          <Plus size={18} /> New Bulletin
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Title / Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Language
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : bulletins.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                  No bulletins yet. Click "New Bulletin" to create one.
                </td>
              </tr>
            ) : (
              bulletins.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{b.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(b.sunday_date).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-4 py-3 uppercase text-xs font-semibold">
                    {b.language}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        b.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        setEditingId(b.id);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:underline mr-3 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="text-red-600 hover:underline text-sm font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// Bulletin Form
// ---------------------------------------------------------------------
function BulletinForm({ id, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    sunday_date: new Date().toISOString().split('T')[0],
    language: 'en',
    status: 'draft',
    sections: [],
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

useEffect(() => {
  if (!id) return;
  let cancelled = false;
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setFetching(true);
  api.authGet(`/admin/bulletins/${id}`)
    .then((res) => { if (!cancelled) setFormData(res.data); })
    .catch((err) => alert(err.message))
    .finally(() => { if (!cancelled) setFetching(false); });
  return () => { cancelled = true; };
}, [id]);

  const loadTemplate = () => {
    setFormData({
      ...formData,
      sections: JSON.parse(JSON.stringify(DEFAULT_TEMPLATE)),
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await api.authPut(`/admin/bulletins/${id}`, formData);
      } else {
        await api.authPost('/admin/bulletins', formData);
      }
      onSuccess();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---- State helpers ----
  const updateSection = (sIdx, field, value) => {
    const newSections = [...formData.sections];
    newSections[sIdx] = { ...newSections[sIdx], [field]: value };
    setFormData({ ...formData, sections: newSections });
  };

  const updateItem = (sIdx, iIdx, field, value) => {
    const newSections = [...formData.sections];
    newSections[sIdx].items = [...newSections[sIdx].items];
    newSections[sIdx].items[iIdx] = {
      ...newSections[sIdx].items[iIdx],
      [field]: value,
    };
    setFormData({ ...formData, sections: newSections });
  };

  const updateTableRow = (sIdx, iIdx, rIdx, field, value) => {
    const newSections = [...formData.sections];
    const newItems = [...newSections[sIdx].items];
    const newTable = [...newItems[iIdx].massTable];
    newTable[rIdx] = { ...newTable[rIdx], [field]: value };
    newItems[iIdx] = { ...newItems[iIdx], massTable: newTable };
    newSections[sIdx] = { ...newSections[sIdx], items: newItems };
    setFormData({ ...formData, sections: newSections });
  };

  const addItem = (sIdx) => {
    const newSections = [...formData.sections];
    newSections[sIdx].items = [...newSections[sIdx].items, { html: '' }];
    setFormData({ ...formData, sections: newSections });
  };

  const removeItem = (sIdx, iIdx) => {
    const newSections = [...formData.sections];
    newSections[sIdx].items = newSections[sIdx].items.filter(
      (_, i) => i !== iIdx
    );
    setFormData({ ...formData, sections: newSections });
  };

  const addSection = () => {
    setFormData({
      ...formData,
      sections: [
        ...formData.sections,
        { heading: 'New Section', items: [{ html: '' }] },
      ],
    });
  };

  const removeSection = (sIdx) => {
    if (!window.confirm('Remove this entire section?')) return;
    setFormData({
      ...formData,
      sections: formData.sections.filter((_, i) => i !== sIdx),
    });
  };

  if (fetching) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-[#800000] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <form
        onSubmit={handleSave}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-xl font-bold">
            {id ? 'Edit Bulletin' : 'Create Bulletin'}
          </h2>
          <button
            type="button"
            onClick={loadTemplate}
            className="text-sm font-semibold text-[#800000] bg-[#800000]/10 px-3 py-1.5 rounded-lg hover:bg-[#800000]/20"
          >
            Load Standard Template
          </button>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bulletin Title
            </label>
            <input
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. 30th Sunday in Ordinary Time"
              className="w-full border border-gray-300 rounded-lg px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-[#800000]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sunday Date
            </label>
            <input
              type="date"
              required
              value={formData.sunday_date}
              onChange={(e) =>
                setFormData({ ...formData, sunday_date: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-[#800000]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <select
              value={formData.language}
              onChange={(e) =>
                setFormData({ ...formData, language: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-[#800000]"
            >
              <option value="en">English</option>
              <option value="sw">Kiswahili</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-[#800000]"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8 mt-8">
          {formData.sections.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500 mb-4">
                No sections yet. Click "Load Standard Template" or add one manually.
              </p>
              <button
                type="button"
                onClick={addSection}
                className="text-sm text-[#800000] font-semibold hover:underline"
              >
                + Add First Section
              </button>
            </div>
          )}

          {formData.sections.map((section, sIdx) => (
            <div
              key={sIdx}
              className="bg-gray-50 border border-gray-200 rounded-xl p-5"
            >
              {/* Section heading */}
              <div className="flex items-start gap-2 mb-4">
                <input
                  value={section.heading}
                  onChange={(e) => updateSection(sIdx, 'heading', e.target.value)}
                  className="flex-1 bg-transparent font-bold text-lg text-[#234a33]
                             border-b-2 border-gray-300 focus:outline-none
                             focus:border-[#800000] pb-1"
                />
                <button
                  type="button"
                  onClick={() => removeSection(sIdx)}
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                  title="Remove section"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Items */}
              {section.items.map((item, iIdx) => (
                <div
                  key={iIdx}
                  className="mb-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                >
                  <div className="flex gap-2 items-start">
                    <span className="text-gray-400 font-mono text-sm mt-2 w-5 shrink-0">
                      {String.fromCharCode(97 + iIdx)})
                    </span>
                    <div className="flex-1 min-w-0">
                      <RichTextEditor
                        content={item.html || ''}
                        onChange={(html) =>
                          updateItem(sIdx, iIdx, 'html', html)
                        }
                      />

                      {/* Mass Table Editor */}
                      {item.massTable && (
                        <div className="mt-4 border-t border-gray-200 pt-4">
                          <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
                            <TableIcon size={16} /> Mass Animation Table
                          </div>
                          <table className="w-full text-sm border-collapse">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="border border-gray-300 p-2 text-left">
                                  Mass
                                </th>
                                <th className="border border-gray-300 p-2 text-left">
                                  CTK Group
                                </th>
                                <th className="border border-gray-300 p-2 text-left">
                                  SJTE Group
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {item.massTable.map((row, rIdx) => (
                                <tr key={rIdx}>
                                  <td className="border border-gray-300 p-1 bg-gray-50 font-medium w-1/4">
                                    {row.mass}
                                  </td>
                                  <td className="border border-gray-300 p-0">
                                    <input
                                      type="text"
                                      value={row.ctk || ''}
                                      onChange={(e) =>
                                        updateTableRow(
                                          sIdx,
                                          iIdx,
                                          rIdx,
                                          'ctk',
                                          e.target.value
                                        )
                                      }
                                      placeholder="e.g. St. Gabriel SCC"
                                      className="w-full px-2 py-1.5 focus:outline-none focus:bg-blue-50"
                                    />
                                  </td>
                                  <td className="border border-gray-300 p-0">
                                    <input
                                      type="text"
                                      value={row.sjte || ''}
                                      onChange={(e) =>
                                        updateTableRow(
                                          sIdx,
                                          iIdx,
                                          rIdx,
                                          'sjte',
                                          e.target.value
                                        )
                                      }
                                      placeholder="e.g. St. Mark SCC"
                                      className="w-full px-2 py-1.5 focus:outline-none focus:bg-blue-50"
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(sIdx, iIdx)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded shrink-0"
                      title="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addItem(sIdx)}
                className="text-sm text-[#800000] font-semibold mt-2 hover:underline"
              >
                + Add Item
              </button>
            </div>
          ))}

          {formData.sections.length > 0 && (
            <button
              type="button"
              onClick={addSection}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl
                         text-gray-500 hover:border-[#800000] hover:text-[#800000]
                         text-sm font-semibold transition-colors"
            >
              + Add Section
            </button>
          )}
        </div>

        {/* Save */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[#800000] text-white rounded-lg flex items-center gap-2
                       font-medium hover:bg-[#660000] disabled:opacity-50"
          >
            <Save size={18} /> {loading ? 'Saving...' : 'Save Bulletin'}
          </button>
        </div>
      </form>
    </div>
  );
}
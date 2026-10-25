/**
 * Livestreams Manager.
 *
 * List, create, edit, publish, and delete livestream records.
 * The YouTube URL is pasted by the admin; the video ID and thumbnail
 * are extracted automatically by the backend.
 */

import { useState, useEffect } from 'react';
import { api } from '../../lib/apiClient';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { FaYoutube } from 'react-icons/fa';

export default function LivestreamsManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);



  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.authGet('/admin/livestreams');
      setItems(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this livestream permanently?')) return;
    try {
      await api.authDelete(`/admin/livestreams/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleTogglePublish = async (item) => {
    try {
      const newStatus = item.status === 'published' ? 'draft' : 'published';
      const res = await api.authPut(`/admin/livestreams/${item.id}`, {
        ...item,
        status: newStatus,
      });
      setItems((prev) => prev.map((i) => (i.id === item.id ? res.data : i)));
    } catch (err) {
      alert(err.message);
    }
  };

  if (showForm || editing) {
    return (
      <LivestreamForm
        item={editing}
        onSuccess={() => {
          setShowForm(false);
          setEditing(null);
          load();
        }}
        onCancel={() => {
          setShowForm(false);
          setEditing(null);
        }}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Livestreams</h2>
          <p className="text-gray-500 text-sm">
            Manage YouTube recordings from recent masses and events
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg
                     bg-[#800000] text-white text-sm font-semibold
                     hover:bg-[#660000] transition-colors"
        >
          <Plus size={18} />
          Add Livestream
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-[#800000] animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <AlertCircle className="inline-block mr-2" size={18} />
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <FaYoutube size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No livestreams yet.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 text-[#800000] font-medium hover:underline"
          >
            Add the first one
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Video
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
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
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {item.thumbnail_url && (
                        <img
                          src={item.thumbnail_url}
                          alt=""
                          className="w-16 h-9 rounded object-cover bg-gray-100"
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {item.preacher || 'No preacher listed'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {item.stream_date
                      ? new Date(item.stream_date).toLocaleDateString()
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleTogglePublish(item)}
                        title={
                          item.status === 'published' ? 'Unpublish' : 'Publish'
                        }
                        className="p-2 text-gray-500 hover:text-[#800000] hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {item.status === 'published' ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => setEditing(item)}
                        title="Edit"
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        title="Delete"
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------
// Livestream Form
// ---------------------------------------------------------------------
function LivestreamForm({ item, onSuccess, onCancel }) {
  const isEditing = !!item;
  const [formData, setFormData] = useState({
    title: item?.title || '',
    preacher: item?.preacher || '',
    description: item?.description || '',
    youtube_url: item?.youtube_url || '',
    stream_date: item?.stream_date || '',
    view_count_display: item?.view_count_display || '',
    status: item?.status || 'draft',
    display_order: item?.display_order || 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Live preview of YouTube video ID from the pasted URL
  const getPreviewVideoId = (url) => {
    if (!url) return null;
    const regex =
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const previewId = getPreviewVideoId(formData.youtube_url);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        stream_date: formData.stream_date || null,
        display_order: parseInt(formData.display_order, 10) || 0,
      };

      if (isEditing) {
        await api.authPut(`/admin/livestreams/${item.id}`, payload);
      } else {
        await api.authPost('/admin/livestreams', payload);
      }
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {isEditing ? 'Edit Livestream' : 'Add Livestream'}
        </h2>
        <p className="text-sm text-gray-500">
          Paste the YouTube URL. Thumbnail is extracted automatically.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* YouTube URL + preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            YouTube URL *
          </label>
          <input
            name="youtube_url"
            value={formData.youtube_url}
            onChange={handleChange}
            required
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-[#800000]
                       focus:border-transparent font-mono text-sm"
          />
          {previewId && (
            <div className="mt-3 flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <img
                src={`https://img.youtube.com/vi/${previewId}/mqdefault.jpg`}
                alt="Video preview"
                className="w-32 h-18 rounded object-cover"
              />
              <div className="text-xs text-gray-500">
                <p className="font-medium text-gray-700 mb-1">Video preview</p>
                <p className="font-mono text-[10px] break-all">
                  ID: {previewId}
                </p>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="e.g. Family Day Mass 2025"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-[#800000]
                       focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preacher / Main Celebrant
          </label>
          <input
            name="preacher"
            value={formData.preacher}
            onChange={handleChange}
            placeholder="e.g. H.E. Archbishop Phillip Anyolo"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-[#800000]
                       focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-[#800000]
                       focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stream Date
            </label>
            <input
              type="date"
              name="stream_date"
              value={formData.stream_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-[#800000]
                         focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Views (display text)
            </label>
            <input
              name="view_count_display"
              value={formData.view_count_display}
              onChange={handleChange}
              placeholder="e.g. 5.5K views"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-[#800000]
                         focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Order
            </label>
            <input
              type="number"
              name="display_order"
              value={formData.display_order}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-[#800000]
                         focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-1">
              Lower numbers appear first
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-[#800000]
                         focus:border-transparent"
            >
              <option value="draft">Draft (hidden)</option>
              <option value="published">Published (visible)</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-[#800000] text-white
                       hover:bg-[#660000] transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}
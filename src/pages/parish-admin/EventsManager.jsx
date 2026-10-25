/**
 * Events Manager.
 *
 * Lists all events (drafts and published), allows creating, editing,
 * publishing, and deleting.
 */

import { useState, useEffect } from 'react';
import { api } from '../../lib/apiClient';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';

export default function EventsManager() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);



  const loadEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.authGet('/admin/events');
      setEvents(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
    loadEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event permanently? This cannot be undone.')) return;
    try {
      await api.authDelete(`/admin/events/${id}`);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleTogglePublish = async (event) => {
    try {
      const newStatus = event.status === 'published' ? 'draft' : 'published';
      const res = await api.authPut(`/admin/events/${event.id}`, {
        ...event,
        status: newStatus,
      });
      setEvents((prev) => prev.map((e) => (e.id === event.id ? res.data : e)));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingEvent(null);
    loadEvents();
  };

  if (showForm || editingEvent) {
    return (
      <EventForm
        event={editingEvent}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setShowForm(false);
          setEditingEvent(null);
        }}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Events</h2>
          <p className="text-gray-500 text-sm">Manage parish events</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg
                     bg-[#800000] text-white text-sm font-semibold
                     hover:bg-[#660000] transition-colors"
        >
          <Plus size={18} />
          New Event
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
      ) : events.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No events yet.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 text-[#800000] font-medium hover:underline"
          >
            Create the first one
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Start
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
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {event.image_url && (
                        <img
                          src={event.image_url}
                          alt=""
                          className="w-12 h-8 rounded object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{event.title}</p>
                        <p className="text-xs text-gray-500">
                          {event.location || 'No location'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(event.start_time).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        event.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {event.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => handleTogglePublish(event)}
                        title={event.status === 'published' ? 'Unpublish' : 'Publish'}
                        className="p-2 text-gray-500 hover:text-[#800000] hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {event.status === 'published' ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => setEditingEvent(event)}
                        title="Edit"
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
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
// Event Form (inline component)
// ---------------------------------------------------------------------
function EventForm({ event, onSuccess, onCancel }) {
  const isEditing = !!event;
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    start_time: event?.start_time
      ? new Date(event.start_time).toISOString().slice(0, 16)
      : '',
    end_time: event?.end_time
      ? new Date(event.end_time).toISOString().slice(0, 16)
      : '',
    location: event?.location || '',
    category: event?.category || '',
    status: event?.status || 'draft',
    image_url: event?.image_url || '',
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, WebP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const { supabase } = await import('../../lib/supabaseClient');

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `events/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('media').getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, image_url: data.publicUrl }));
    } catch (err) {
      console.error(err);
      setError('Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: formData.end_time ? new Date(formData.end_time).toISOString() : null,
      };

      if (isEditing) {
        await api.authPut(`/admin/events/${event.id}`, payload);
      } else {
        await api.authPost('/admin/events', payload);
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
          {isEditing ? 'Edit Event' : 'New Event'}
        </h2>
        <p className="text-sm text-gray-500">
          {isEditing
            ? 'Update the event details below.'
            : 'Fill in the details for the new event.'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thumbnail Image (Optional)
          </label>
          <div className="flex items-center gap-4">
            {formData.image_url ? (
              <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-gray-200 group">
                <img
                  src={formData.image_url}
                  alt="Event thumbnail"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image_url: '' })}
                  className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs font-medium"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="w-32 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 text-gray-400">
                <ImageIcon size={24} />
              </div>
            )}

            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="block w-full text-sm text-gray-500
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-lg file:border-0
                           file:text-sm file:font-medium
                           file:bg-[#800000]/10 file:text-[#800000]
                           hover:file:bg-[#800000]/20
                           cursor-pointer"
              />
              {uploading && (
                <p className="text-xs text-[#800000] mt-2 animate-pulse">
                  Uploading image...
                </p>
              )}
            </div>
          </div>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
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
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start *
            </label>
            <input
              type="datetime-local"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End (optional)
            </label>
            <input
              type="datetime-local"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Liturgy, Youth"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
            />
          </div>
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
                       focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent"
          >
            <option value="draft">Draft (hidden from public)</option>
            <option value="published">Published (visible on site)</option>
            <option value="archived">Archived</option>
            <option value="cancelled">Cancelled</option>
          </select>
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
            disabled={loading || uploading}
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-[#800000] text-white
                       hover:bg-[#660000] transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
}
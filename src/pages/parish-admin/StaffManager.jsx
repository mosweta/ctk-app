import { useState, useEffect} from 'react';
import { api } from '../../lib/apiClient';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Trash2, Loader2, User, Image as ImageIcon, AlertTriangle } from 'lucide-react';

export default function StaffManager() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.authGet('/admin/staff');
      setStaff(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this staff member?')) return;
    await api.authDelete(`/admin/staff/${id}`);
    load();
  };

  if (showForm || editing) {
    return (
      <StaffForm
        item={editing}
        onSuccess={() => { setShowForm(false); setEditing(null); load(); }}
        onCancel={() => { setShowForm(false); setEditing(null); }}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Staff & Clergy</h2>
          <p className="text-gray-500 text-sm">Manage parish staff information</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#800000] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#660000]"
        >
          <Plus size={18} /> Add Staff
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-[#800000] animate-spin" /></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Photo</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {staff.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{s.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.title}</td>
                  <td className="px-4 py-3">
                    {s.show_photo && s.image_url ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Visible</span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Hidden</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setEditing(s)} className="text-blue-600 hover:underline mr-3 text-sm font-medium">Edit</button>
                    <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:underline text-sm font-medium">Delete</button>
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

function StaffForm({ item, onSuccess, onCancel }) {
  const isEditing = !!item;
  const [formData, setFormData] = useState({
    name: item?.name || '',
    title: item?.title || '',
    description: item?.description || '',
    image_url: item?.image_url || '',
    show_photo: item?.show_photo || false,
    display_order: item?.display_order || 0,
    is_active: item?.is_active ?? true,
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return setError('Image file required');
    if (file.size > 5 * 1024 * 1024) return setError('Image must be less than 5MB');

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const filePath = `staff/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('media').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('media').getPublicUrl(filePath);
      setFormData(prev => ({ ...prev, image_url: data.publicUrl }));
    } catch { setError('Image upload failed'); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData, display_order: parseInt(formData.display_order) || 0 };
      if (isEditing) await api.authPut(`/admin/staff/${item.id}`, payload);
      else await api.authPost('/admin/staff', payload);
      onSuccess();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">{isEditing ? 'Edit Staff' : 'New Staff'}</h2>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input name="name" value={formData.name} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#800000] focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Parish Priest" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#800000] focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#800000] focus:outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
          <div className="flex items-center gap-4">
            {formData.image_url ? (
              <img src={formData.image_url} alt="" className="w-20 h-20 rounded-full object-cover border-2 border-gray-200" />
            ) : (
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400"><User size={24} /></div>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#800000]/10 file:text-[#800000] cursor-pointer" />
            {uploading && <Loader2 className="animate-spin text-[#800000]" size={18} />}
          </div>
        </div>

        {/* Critical: photo consent */}
        <div className={`rounded-lg p-4 border ${formData.show_photo ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'}`}>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" name="show_photo" checked={formData.show_photo} onChange={handleChange} className="mt-1 w-4 h-4 accent-[#800000]" />
            <div>
              <span className="block text-sm font-semibold text-gray-800">Display photo publicly on the website</span>
              <span className="block text-xs text-gray-600 mt-1">
                Only enable this after receiving explicit written consent. Many staff, especially clergy, prefer not to have photos published.
              </span>
            </div>
          </label>
          {formData.show_photo && (
            <p className="flex items-start gap-2 text-xs text-amber-700 mt-3 pt-3 border-t border-amber-200">
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              Photo will be published on the public Staff page. Confirm consent is on file.
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
            <input type="number" name="display_order" value={formData.display_order} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#800000] focus:outline-none" />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="w-4 h-4 accent-[#800000]" />
              <span className="text-sm text-gray-700">Active (visible on site)</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
          <button type="submit" disabled={loading || uploading} className="px-6 py-2 bg-[#800000] text-white rounded-lg hover:bg-[#660000] disabled:opacity-50">
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
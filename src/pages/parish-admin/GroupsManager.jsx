import { useState, useEffect, useRef } from 'react';
import { api } from '../../lib/apiClient';
import { supabase } from '../../lib/supabaseClient';
import { Plus, Edit2, Trash2, Users, Loader2, Image as ImageIcon } from 'lucide-react';

export default function GroupsManager() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);


  const loadGroups = async () => {
    setLoading(true);
    try {
      const res = await api.authGet('/admin/groups');
      setGroups(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

    useEffect(() => { loadGroups(); }, []);


  const handleDelete = async (id) => {
    if (!window.confirm('Delete this group permanently?')) return;
    try {
      await api.authDelete(`/admin/groups/${id}`);
      setGroups(groups.filter(g => g.id !== id));
    } catch (err) { alert(err.message); }
  };

  if (showForm || editingGroup) {
    return (
      <GroupForm
        group={editingGroup}
        onSuccess={() => { setShowForm(false); setEditingGroup(null); loadGroups(); }}
        onCancel={() => { setShowForm(false); setEditingGroup(null); }}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Groups & Jumuiyas</h2>
          <p className="text-gray-500 text-sm">Manage Small Christian Communities, Choirs, and Groups</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#800000] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#660000]"
        >
          <Plus size={18} /> Add Group
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Meeting</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {groups.map((g) => (
                <tr key={g.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {g.image_url && <img src={g.image_url} alt="" className="w-10 h-10 rounded-full object-cover" />}
                      <div>
                        <p className="font-medium text-gray-900">{g.name}</p>
                        <p className="text-xs text-gray-500">{g.patron_saint}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="capitalize text-sm font-medium px-2 py-1 bg-[#800000]/10 text-[#800000] rounded">{g.category}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {g.meeting_day && <p>{g.meeting_day} {g.meeting_time}</p>}
                    {g.meeting_location && <p className="text-xs text-gray-400">{g.meeting_location}</p>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setEditingGroup(g)} className="text-blue-600 hover:underline mr-3 text-sm font-medium">Edit</button>
                    <button onClick={() => handleDelete(g.id)} className="text-red-600 hover:underline text-sm font-medium">Delete</button>
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

function GroupForm({ group, onSuccess, onCancel }) {
  const isEditing = !!group;
  const [formData, setFormData] = useState({
    name: group?.name || '',
    category: group?.category || 'jumuiya',
    patron_saint: group?.patron_saint || '',
    short_description: group?.short_description || '',
    long_description: group?.long_description || '',
    meeting_day: group?.meeting_day || '',
    meeting_time: group?.meeting_time || '',
    meeting_location: group?.meeting_location || '',
    coordinator_name: group?.coordinator_name || '',
    coordinator_contact: group?.coordinator_contact || '',
    founded_year: group?.founded_year || '',
    image_url: group?.image_url || '',
    is_public: group?.is_public ?? true,
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return setError('Please upload an image');
    if (file.size > 5 * 1024 * 1024) return setError('Image must be less than 5MB');

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const filePath = `groups/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('media').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('media').getPublicUrl(filePath);
      setFormData(prev => ({ ...prev, image_url: data.publicUrl }));
    } catch {
      setError('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData, founded_year: formData.founded_year ? parseInt(formData.founded_year) : null };
      if (isEditing) {
        await api.authPut(`/admin/groups/${group.id}`, payload);
      } else {
        await api.authPost('/admin/groups', payload);
      }
      onSuccess();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">{isEditing ? 'Edit Group' : 'New Group'}</h2>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image (Optional)</label>
          <div className="flex items-center gap-4">
            {formData.image_url ? (
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 group">
                <img src={formData.image_url} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setFormData({ ...formData, image_url: '' })} className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs">Remove</button>
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400"><ImageIcon size={20} /></div>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#800000]/10 file:text-[#800000] cursor-pointer" />
            {uploading && <Loader2 className="animate-spin text-[#800000]" size={18} />}
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input name="name" value={formData.name} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#800000] focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#800000] focus:outline-none">
              <option value="jumuiya">Jumuiya (SCC)</option>
              <option value="ecclesial">Ecclesial Group</option>
              <option value="choir">Choir</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patron Saint</label>
            <input name="patron_saint" value={formData.patron_saint} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#800000] focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Founded Year</label>
            <input type="number" name="founded_year" value={formData.founded_year} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#800000] focus:outline-none" />
          </div>
        </div>

        {/* Descriptions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Short Description (for cards)</label>
          <textarea name="short_description" value={formData.short_description} onChange={handleChange} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#800000] focus:outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Long Description (for detail page)</label>
          <textarea name="long_description" value={formData.long_description} onChange={handleChange} rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#800000] focus:outline-none" />
        </div>

        {/* Meeting Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Day</label>
            <input name="meeting_day" value={formData.meeting_day} onChange={handleChange} placeholder="e.g. Every 2nd Sunday" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#800000] focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Time</label>
            <input name="meeting_time" value={formData.meeting_time} onChange={handleChange} placeholder="e.g. 4:00 PM" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#800000] focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input name="meeting_location" value={formData.meeting_location} onChange={handleChange} placeholder="e.g. Block 5" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#800000] focus:outline-none" />
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Coordinator Name</label>
            <input name="coordinator_name" value={formData.coordinator_name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#800000] focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact (phone/email)</label>
            <input name="coordinator_contact" value={formData.coordinator_contact} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#800000] focus:outline-none" />
          </div>
        </div>

        {/* Visibility */}
        <div className="flex items-center gap-3">
          <input type="checkbox" id="is_public" name="is_public" checked={formData.is_public} onChange={handleChange} className="w-4 h-4 accent-[#800000]" />
          <label htmlFor="is_public" className="text-sm text-gray-700">Show on public website</label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
          <button type="submit" disabled={loading || uploading} className="px-6 py-2 bg-[#800000] text-white rounded-lg hover:bg-[#660000] disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Group'}
          </button>
        </div>
      </form>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { api } from '../../lib/apiClient';
import { Save, Loader2, AlertCircle } from 'lucide-react';

export default function SettingsManager() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/parish-settings');
        setSettings(res.data);
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const updateField = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.authPut('/admin/settings', { settings });
      setSuccess('Settings saved successfully. Public site updates within seconds.');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#800000]" size={40} /></div>;
  if (!settings) return <div className="text-red-600">Failed to load settings</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Parish Settings</h2>
        <p className="text-gray-500 text-sm">These values appear on the public website</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm flex items-center gap-2"><AlertCircle size={16} />{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg text-sm">{success}</div>}

      {/* Contact Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Contact Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              value={settings.contact_info?.phone || ''}
              onChange={(e) => updateField('contact_info', { ...settings.contact_info, phone: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#800000] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={settings.contact_info?.email || ''}
              onChange={(e) => updateField('contact_info', { ...settings.contact_info, email: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#800000] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              rows={2}
              value={settings.contact_info?.address || ''}
              onChange={(e) => updateField('contact_info', { ...settings.contact_info, address: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#800000] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Mass Times */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Mass Times</h3>
        <p className="text-xs text-gray-500 mb-4">Enter each mass on a new line. Changes appear immediately on the public site.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sunday — CTK</label>
            <textarea
              rows={4}
              value={(settings.mass_times?.sunday_ctk || []).join('\n')}
              onChange={(e) => updateField('mass_times', { ...settings.mass_times, sunday_ctk: e.target.value.split('\n') })}
              placeholder="7:00 AM - 9:00 AM"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-[#800000] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sunday — SJTE</label>
            <textarea
              rows={4}
              value={(settings.mass_times?.sunday_sjte || []).join('\n')}
              onChange={(e) => updateField('mass_times', { ...settings.mass_times, sunday_sjte: e.target.value.split('\n') })}
              placeholder="8:00 AM - 10:00 AM"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-[#800000] focus:outline-none"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Weekday — CTK</label>
          <textarea
            rows={2}
            value={(settings.mass_times?.weekday_ctk || []).join('\n')}
            onChange={(e) => updateField('mass_times', { ...settings.mass_times, weekday_ctk: e.target.value.split('\n') })}
            placeholder="7:00 AM"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-[#800000] focus:outline-none"
          />
        </div>
      </div>

      {/* Other Times */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Other Service Times</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confession Times</label>
            <input
              type="text"
              value={settings.confession_times?.saturday || ''}
              onChange={(e) => updateField('confession_times', { saturday: e.target.value })}
              placeholder="Saturday: 4:00 PM - 5:30 PM"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#800000] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adoration Times</label>
            <input
              type="text"
              value={settings.adoration_times?.last_thursday || ''}
              onChange={(e) => updateField('adoration_times', { last_thursday: e.target.value })}
              placeholder="Last Thursday: 7:00 PM - 8:30 PM"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#800000] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-[#800000] text-white rounded-lg flex items-center gap-2 font-semibold hover:bg-[#660000] disabled:opacity-50"
        >
          {saving ? <><Loader2 className="animate-spin" size={18} /> Saving...</> : <><Save size={18} /> Save All Settings</>}
        </button>
      </div>
    </div>
  );
}
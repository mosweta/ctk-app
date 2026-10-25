import { useState, useEffect } from 'react';
import { api } from '../../lib/apiClient';
import { RefreshCw, Loader2, BookOpen } from 'lucide-react';

export default function ReadingsManager() {
  const [cached, setCached] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(null);
  const [error, setError] = useState('');



  const load = async () => {
    setLoading(true);
    try {
      const res = await api.authGet('/admin/readings');
      setCached(res.data);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

    useEffect(() => { load(); }, []);

  const handleRefresh = async (date) => {
    setRefreshing(date);
    try {
      await api.authPost(`/admin/readings/${date}/refresh`);
      await load();
    } catch (err) { alert(err.message); }
    finally { setRefreshing(null); }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Daily Readings</h2>
        <p className="text-gray-500 text-sm">
          The site automatically caches daily readings for 6 hours. If a day's readings are wrong, force a refresh below.
        </p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4 text-sm">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cached</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td colSpan="3" className="text-center py-12"><Loader2 className="inline animate-spin text-[#800000]" size={28} /></td></tr>
            ) : cached.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-12">
                  <BookOpen size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">No readings cached yet. Visit <code>/readings</code> on the public site to populate the cache.</p>
                </td>
              </tr>
            ) : (
              cached.map((row) => (
                <tr key={row.reading_date} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">
                    {row.reading_date}
                    {row.is_manual_override && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded">Manual</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(row.fetched_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleRefresh(row.reading_date)}
                      disabled={refreshing === row.reading_date}
                      className="inline-flex items-center gap-1.5 text-sm text-[#800000] hover:underline font-medium disabled:opacity-50"
                    >
                      {refreshing === row.reading_date ? (
                        <><Loader2 size={14} className="animate-spin" /> Refreshing...</>
                      ) : (
                        <><RefreshCw size={14} /> Refresh</>
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Toggle Saint Image */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 mb-2">Saint of the Day Image</h3>
        <p className="text-sm text-gray-500 mb-4">
          When enabled, the saint image is fetched from Wikipedia and shown on the public readings page.
        </p>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            defaultChecked={true}
            onChange={async (e) => {
              try {
                await api.authPut('/admin/settings', {
                  settings: { readings_show_saint_image: e.target.checked }
                });
              } catch (err) { alert(err.message); }
            }}
            className="w-5 h-5 accent-[#800000]"
          />
          <span className="text-sm text-gray-700">Show saint image on readings page</span>
        </label>
      </div>
    </div>
  );
}
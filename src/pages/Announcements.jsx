import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApi } from '../hooks/useApi';
import { Loader2, BookOpen, Calendar } from 'lucide-react';

export default function Announcements() {
  const { data: bulletins, loading, error } = useApi('/bulletins');
  const [lang, setLang] = useState('en');

  const filtered = (bulletins || []).filter((b) => b.language === lang);
  const latest = filtered[0];

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header with language toggle */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#800000]/10 text-[#800000] mb-3">
              <BookOpen size={28} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#234a33]">Parish Bulletin</h1>
          </div>

          <div className="flex bg-white rounded-lg shadow-sm p-1 border border-gray-200">
            <button onClick={() => setLang('en')} className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${lang === 'en' ? 'bg-[#800000] text-white' : 'text-gray-500 hover:text-[#800000]'}`}>English</button>
            <button onClick={() => setLang('sw')} className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${lang === 'sw' ? 'bg-[#800000] text-white' : 'text-gray-500 hover:text-[#800000]'}`}>Kiswahili</button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-[#800000] animate-spin" /></div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-6 rounded-xl text-center border border-red-100">{error}</div>
        ) : !latest ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500">No bulletins available in {lang === 'en' ? 'English' : 'Kiswahili'} yet.</p>
          </div>
        ) : (
          <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            
            <div className="bg-[#1e4a2a] text-white p-8 md:p-10 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{latest.title}</h2>
              <p className="flex items-center justify-center gap-2 text-white/80 text-sm uppercase tracking-wider">
                <Calendar size={16} />
                {new Date(latest.sunday_date).toLocaleDateString(lang === 'en' ? 'en-US' : 'sw-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div className="p-6 md:p-10 space-y-10">
              {latest.sections?.map((section, sIdx) => (
                <section key={sIdx}>
                  <h3 className="text-lg md:text-xl font-bold text-[#800000] uppercase tracking-wide border-b-2 border-[#800000]/20 pb-2 mb-4">
                    {section.heading}
                  </h3>
                  <ol className="list-[lower-alpha] pl-6 space-y-6 text-gray-700 leading-relaxed">
                    {section.items?.map((item, iIdx) => (
                      <li key={iIdx}>
                        
                        {/* Render the rich text HTML securely */}
                        <div 
                          className="ql-editor-public whitespace-pre-line"
                          dangerouslySetInnerHTML={{ __html: item.html || item.text || '' }} 
                        />

                        {/* Render the Mass Table */}
                        {item.massTable && item.massTable.length > 0 && (
                          <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200">
                            <table className="w-full text-sm border-collapse">
                              <thead>
                                <tr className="bg-[#1e4a2a] text-white text-xs uppercase tracking-wider">
                                  <th className="p-3 text-left border-r border-white/10 w-1/4">Mass</th>
                                  <th className="p-3 text-left border-r border-white/10">CTK</th>
                                  <th className="p-3 text-left">SJTE</th>
                                </tr>
                              </thead>
                              <tbody>
                                {item.massTable.map((row, rIdx) => {
                                  // Skip empty rows
                                  if (!row.ctk && !row.sjte) return null;
                                  return (
                                    <tr key={rIdx} className="border-b last:border-0 hover:bg-gray-50">
                                      <td className="p-3 font-semibold text-[#234a33] bg-gray-50/50">{row.mass}</td>
                                      <td className="p-3 text-gray-700">{row.ctk || '-'}</td>
                                      <td className="p-3 text-gray-700">{row.sjte || '-'}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
            </div>
            
            <div className="bg-gray-50 p-6 text-center text-sm text-gray-500 border-t">
              Wishing you all a blessed week!
            </div>
          </motion.article>
        )}
      </div>
    </main>
  );
}
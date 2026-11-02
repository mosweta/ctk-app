import { useState, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useApi } from '../hooks/useApi';
import { Loader2, BookOpen, Calendar, AlertCircle } from 'lucide-react';
import DOMPurify from 'dompurify';

const sanitizeHtml = (html) => {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'ul', 'ol', 'li', 'a', 'span', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  });
};

export default function Announcements() {
  const { data: bulletins, loading, error, refetch } = useApi('/bulletins');
  const [lang, setLang] = useState('en');
  const shouldReduceMotion = useReducedMotion();

  const latest = useMemo(() => {
    if (!Array.isArray(bulletins)) return null;
    const filtered = bulletins.filter((b) => b.language === lang);
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.sunday_date).getTime();
      const dateB = new Date(b.sunday_date).getTime();
      return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
    });
    return sorted[0] || null;
  }, [bulletins, lang]);

  const formattedDate = useMemo(() => {
    if (!latest?.sunday_date) return 'Date TBA';
    const d = new Date(latest.sunday_date);
    if (Number.isNaN(d.getTime())) return 'Date TBA';
    return d.toLocaleDateString(lang === 'en' ? 'en-US' : 'sw-KE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [latest, lang]);

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center w-full max-w-4xl mx-auto min-w-0">
        
        {/* Centered Page Header */}
        <div className="flex flex-col items-center justify-center text-center mb-12 gap-4 w-full">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-light text-primary">
            <BookOpen size={32} aria-hidden="true" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-heading">Parish Bulletin</h1>

          <div className="flex bg-surface rounded-lg shadow-sm p-1 border border-border mt-2">
            <button 
              onClick={() => setLang('en')} 
              className={`px-5 py-2 rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${lang === 'en' ? 'bg-primary text-white' : 'text-muted hover:text-primary'}`}
            >
              English
            </button>
            <button 
              onClick={() => setLang('sw')} 
              className={`px-5 py-2 rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${lang === 'sw' ? 'bg-primary text-white' : 'text-muted hover:text-primary'}`}
            >
              Kiswahili
            </button>
          </div>
        </div>

        {/* States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 w-full">
            <Loader2 className="w-10 h-10 text-primary animate-spin" aria-hidden="true" />
            <p className="text-muted text-sm">Loading bulletin...</p>
          </div>
        ) : error ? (
          <div className="text-center py-24 bg-surface rounded-2xl border border-border w-full flex flex-col items-center gap-4">
            <AlertCircle size={40} className="text-danger mb-2" />
            <p className="text-body">We couldn’t load the bulletin right now.</p>
            <button
              onClick={refetch}
              className="mt-2 px-6 py-2.5 rounded-lg border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Try again
            </button>
          </div>
        ) : !latest ? (
          <div className="text-center py-24 bg-surface rounded-2xl border border-border w-full">
            <BookOpen size={48} className="mx-auto text-muted mb-4" aria-hidden="true" />
            <p className="text-body">No bulletins available in {lang === 'en' ? 'English' : 'Kiswahili'} yet.</p>
          </div>
        ) : (
          /* Bulletin Content */
          <motion.article 
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            /* ADDED mx-auto HERE to center the article block */
            className="w-full max-w-3xl min-w-0 mx-auto"
          >
            
            {/* Bulletin Green Header */}
            <div className="bg-base text-white p-8 md:p-12 text-center rounded-2xl shadow-md break-words mb-10">
              <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white break-words [overflow-wrap:anywhere]">
                {latest.title || 'Parish Bulletin'}
              </h2>
              <p className="flex items-center justify-center gap-2 text-white/80 text-sm md:text-base uppercase tracking-wider">
                <Calendar size={18} aria-hidden="true" />
                {formattedDate}
              </p>
            </div>

            {/* Bulletin Body Content */}
            <div className="space-y-12 text-left min-w-0">
              {latest.sections?.map((section, sIdx) => (
                <section key={sIdx} className="min-w-0">
                  {section.heading && (
                    <h3 className="text-xl md:text-2xl font-bold text-primary uppercase tracking-wide border-b-2 border-primary/20 pb-3 mb-6">
                      {section.heading}
                    </h3>
                  )}
                  
                  <ol className="list-[lower-alpha] pl-6 space-y-8 text-body leading-relaxed min-w-0 text-lg">
                    {section.items?.map((item, iIdx) => {
                      const rawContent = item.html || item.text || '';
                      const safeContent = sanitizeHtml(rawContent);

                      return (
                        <li key={iIdx} className="min-w-0">
                          {/* Rich Text */}
                          {safeContent && (
                            <div 
                              className="ql-editor-public prose dark:prose-invert max-w-none text-body prose-p:my-3 prose-ul:my-3 prose-ol:my-3 prose-li:my-1 break-words [overflow-wrap:anywhere]"
                              dangerouslySetInnerHTML={{ __html: safeContent }} 
                            />
                          )}

                          {/* Mass Table */}
                          {item.massTable && item.massTable.length > 0 && (
                            <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-surface">
                              <table className="w-full text-sm md:text-base text-left border-collapse min-w-[500px]">
                                <thead>
                                  <tr className="bg-base text-white text-xs md:text-sm uppercase tracking-wider">
                                    <th className="p-4 border-r border-white/10 w-1/4">Mass</th>
                                    <th className="p-4 border-r border-white/10">CTK</th>
                                    <th className="p-4">SJTE</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {item.massTable.map((row, rIdx) => {
                                    if (!row.ctk && !row.sjte) return null;
                                    
                                    return (
                                      <tr key={rIdx} className="border-b border-border last:border-0 hover:bg-surface-alt/50 transition-colors">
                                        <td className="p-4 font-semibold text-heading bg-surface-alt/30 break-words">
                                          {row.mass || '-'}
                                        </td>
                                        <td className="p-4 text-body break-words">
                                          {row.ctk || '-'}
                                        </td>
                                        <td className="p-4 text-body break-words">
                                          {row.sjte || '-'}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </section>
              ))}
            </div>
            
            {/* Footer Text */}
            <div className="mt-16 pt-8 border-t border-border text-center text-body font-medium italic">
              Wishing you all a blessed week!
            </div>
          </motion.article>
        )}
      </div>
    </main>
  );
}
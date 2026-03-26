import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../section/Header';
import Footer from '../section/Footer';
import './Announcements.css';
import { 
  FiBell, 
  FiCalendar, 
  FiClock, 
  FiChevronDown, 
  FiChevronUp,
  FiShare2,
  FiCopy,
  FiCheck,
  FiPrinter,
  FiDownload,
  FiArrowLeft,
  FiArrowRight
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Announcements = () => {
  const [expandedSections, setExpandedSections] = useState({});
  const [copied, setCopied] = useState(false);
  const [activeWeek, setActiveWeek] = useState('current');
  const announcementsRef = useRef(null);

  // Initialize all sections as expanded by default
  useEffect(() => {
    const initialExpanded = {};
    announcementData.sections.forEach((_, index) => {
      initialExpanded[index] = true;
    });
    setExpandedSections(initialExpanded);
  }, []);

  // Announcement data based on your sample
  const announcementData = {
    date: "SUNDAY 22ND MARCH 2026",
    sections: [
      {
        title: "TODAY'S ANNOUNCEMENTS",
        items: [
          {
            type: "text",
            content: "Today is the 5th Sunday of Lent."
          },
          {
            type: "text",
            content: "We thank all who have animated today's Mass:",
            subItems: [
              "St. Peter and Paul SCC",
              "St. Stephen SCC",
              "Our Lady Queen of Peace SCC",
              "St. Rita SCC",
              "God bless you all."
            ]
          },
          {
            type: "text",
            content: "We shall have the 3rd scrutiny for the catechumens to be baptized during Easter. This will be during the 1pm Mass at CTK Church."
          },
          {
            type: "text",
            content: "Today is our parish election day for the group leaders. We are requested to fully participate in it as per our schedules and venues."
          },
          {
            type: "text",
            content: "We congratulate all the newly elected jumuia leaders who were elected last Sunday and wish them God's blessings as they take this noble role in the church",
            notes: [
              "Until the commissioning and official handover is done, we urge the outgoing leaders to continue with their roles/duties.",
              "Those who were elected and are not eligible, we shall have repeat of elections for their positions soon."
            ]
          }
        ]
      },
      {
        title: "THIS WEEK'S ANNOUNCEMENTS",
        items: [
          {
            type: "text",
            content: "On Tuesday 24th March 2026 there will be Mass and adoration for all choirs at 7pm in both CTK Church, and at SJTE Church respectively."
          },
          {
            type: "text",
            content: "On Wednesday 25th March 2026 we shall have deanery confessions in preparation for Easter starting from 5pm-7pm in both CTK and SJTE churches."
          },
          {
            type: "text",
            content: "On Friday 27th March way of the Cross will be at 6:30pm followed by Mass in both CTK & SJTE churches. At CTK Mass will be animated by St. Jude SCC, and SJTE by St. Agatha SCC."
          },
          {
            type: "subheading",
            content: "On Saturday 28th March 2026:"
          },
          {
            type: "list",
            items: [
              "There will be a charity day for:",
              "• St. Michael SCC at St. Teresa Orphanage in Huruma.",
              "• Our Lady of Mercy SCC at Nairobi West prison.",
              "There will be recollection day for the following:",
              "• Our Lady of Assumption SCC and Our Lady of Fatima SCC at Apostles of Jesus Seminary Chapel from 9am.",
              "• St. Lawrence of Rome SCC at Subukia shrine.",
              "There will be feast day Mass for YCA –CTK/SJTE members at 3pm at Wanandege Plaza."
            ]
          }
        ]
      },
      {
        title: "NEXT SUNDAY'S ANNOUNCEMENTS – 29TH MARCH 2026",
        items: [
          {
            type: "text",
            content: "It will be the Palm Sunday. All Christians are requested to carry the Palms. In Tassia Masses will be as usual, but PMC will have only the 2nd Mass. CTK PMC Masses will be as usual."
          },
          {
            type: "text",
            content: "We shall have elections for the parish/local church pastoral council leaders and leaders of ecclesial movements and associations."
          },
          {
            type: "text",
            content: "We will have birthday blessing for those who have celebrated their birthdays in the month of March."
          },
          {
            type: "text",
            content: "There will be rehearsals for those who will take the readings for Easter Triduum at 3pm at CTK Church and at 12pm at SJTE church."
          },
          {
            type: "text",
            content: "The following will animate Masses;",
            massSchedule: [
              { mass: "1st Mass", group: "St. Thomas of Aquinas SCC" },
              { mass: "2nd Mass", group: "St. Teresa of Avila SCC" },
              { mass: "3rd Mass", group: "St. Teresa of Calcutta SCC" },
              { mass: "4th Mass", group: "St. Teresa of Child Jesus SCC" }
            ]
          }
        ]
      },
      {
        title: "OTHER ANNOUNCEMENTS",
        items: [
          {
            type: "subheading",
            content: "BLESSING OF HOMES"
          },
          {
            type: "text",
            content: "There will be home blessing for Our Lay of Mercy SCC – Tuesday, 24th March from 6pm"
          },
          {
            type: "subheading",
            content: "JOB ADVERTISEMENT"
          },
          {
            type: "text",
            content: "Caritas Nairobi is advertising for a position of food security and livelihoods coordinator. For more details, kindly visit the notice board."
          }
        ]
      }
    ]
  };

  // Toggle section expansion
  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Expand all sections
  const expandAll = () => {
    const allExpanded = {};
    announcementData.sections.forEach((_, index) => {
      allExpanded[index] = true;
    });
    setExpandedSections(allExpanded);
  };

  // Collapse all sections
  const collapseAll = () => {
    const allCollapsed = {};
    announcementData.sections.forEach((_, index) => {
      allCollapsed[index] = false;
    });
    setExpandedSections(allCollapsed);
  };

  // Copy announcements to clipboard
  const copyToClipboard = async () => {
    const text = generateTextVersion();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Generate text version for copying
  const generateTextVersion = () => {
    let text = `CHRIST THE KING PARISH – EMBAKASI\n${announcementData.date}\n\n`;
    announcementData.sections.forEach(section => {
      text += `${section.title}\n${'='.repeat(section.title.length)}\n\n`;
      section.items.forEach(item => {
        if (item.type === 'text') {
          text += `${item.content}\n\n`;
          if (item.subItems) {
            item.subItems.forEach(sub => {
              text += `  ${sub}\n`;
            });
            text += '\n';
          }
          if (item.notes) {
            text += `NB: ${item.notes.join(' ')}\n\n`;
          }
          if (item.massSchedule) {
            item.massSchedule.forEach(mass => {
              text += `  ${mass.mass}: ${mass.group}\n`;
            });
            text += '\n';
          }
        } else if (item.type === 'subheading') {
          text += `${item.content}\n\n`;
        } else if (item.type === 'list' && item.items) {
          item.items.forEach(listItem => {
            text += `${listItem}\n`;
          });
          text += '\n';
        }
      });
    });
    return text;
  };

  // Download as text file
  const downloadAsText = () => {
    const text = generateTextVersion();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `announcements_${announcementData.date.replace(/\s/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Print announcements
  const handlePrint = () => {
    window.print();
  };

  // Share announcements
  const handleShare = async () => {
    const text = generateTextVersion();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Parish Announcements',
          text: text,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      copyToClipboard();
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <>
      <Header />
      <main className="announcements-page">
        <section className="announcements-section" ref={announcementsRef}>
          <div className="announcements-container">
            

            {/* Header */}
            <motion.div 
              className="section-header"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
             
              <h1 className="section-title">Parish Announcements</h1>
              <p className="section-date">{announcementData.date}</p>
              <p className="section-subtitle">
                Stay updated with the latest news and events from our parish
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className="action-buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="action-group">
                <button className="action-btn" onClick={expandAll}>
                  Expand All
                </button>
                <button className="action-btn" onClick={collapseAll}>
                  Collapse All
                </button>
              </div>
              <div className="action-group">
                <button className="action-btn" onClick={copyToClipboard}>
                  {copied ? <FiCheck /> : <FiCopy />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                
                <button className="action-btn" onClick={handlePrint}>
                  <FiPrinter /> Print
                </button>
                <button className="action-btn" onClick={handleShare}>
                  <FiShare2 /> Share
                </button>
              </div>
            </motion.div>

            {/* Announcements Content */}
            <motion.div 
              className="announcements-content"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}
            >
              {announcementData.sections.map((section, sectionIndex) => (
                <motion.div 
                  key={sectionIndex}
                  className="announcement-section"
                  variants={fadeInUp}
                >
                  <div 
                    className="section-header-clickable"
                    onClick={() => toggleSection(sectionIndex)}
                  >
                    <h2 className="section-title-announcement">{section.title}</h2>
                    <button className="expand-btn" aria-label={expandedSections[sectionIndex] ? "Collapse section" : "Expand section"}>
                      {expandedSections[sectionIndex] ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                  </div>
                  
                  <AnimatePresence>
                    {expandedSections[sectionIndex] && (
                      <motion.div 
                        className="section-content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {section.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="announcement-item">
                            {item.type === 'text' && (
                              <>
                                <p className="item-text">{item.content}</p>
                                {item.subItems && (
                                  <ul className="sub-list">
                                    {item.subItems.map((sub, subIndex) => (
                                      <li key={subIndex}>{sub}</li>
                                    ))}
                                  </ul>
                                )}
                                {item.notes && (
                                  <div className="note-box">
                                    <strong>NB:</strong>
                                    <ul>
                                      {item.notes.map((note, noteIndex) => (
                                        <li key={noteIndex}>{note}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {item.massSchedule && (
                                  <div className="mass-schedule">
                                    {item.massSchedule.map((mass, massIndex) => (
                                      <div key={massIndex} className="mass-item">
                                        <span className="mass-name">{mass.mass}</span>
                                        <span className="mass-group">{mass.group}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </>
                            )}
                            
                            {item.type === 'subheading' && (
                              <h3 className="subheading">{item.content}</h3>
                            )}
                            
                            {item.type === 'list' && item.items && (
                              <ul className="list-items">
                                {item.items.map((listItem, listIndex) => (
                                  <li key={listIndex}>{listItem}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>

            {/* Footer Note */}
            <motion.div 
              className="announcements-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="footer-text">
                <FiCalendar className="footer-icon" />
                For more information, please visit the parish office or check the notice board
              </p>
              <div className="footer-links">
                <Link to="/contact-us" className="footer-link">Contact Us</Link>
                <Link to="/calendar" className="footer-link">View Calendar</Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Announcements;
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
    date: "SUNDAY 29TH MARCH 2026",
    sections: [
      {
        title: "TODAY'S ANNOUNCEMENTS",
        items: [
          {
            type: "text",
            content: "Today is the Palm Sunday. "
          },
          {
            type: "text",
            content: "We thank all who have animated today's Mass:",
            subItems: [
              "St. Thomas of Aquinas SCC.",
              "St. Teresa of Avila SCC",
              "St. Teresa of Calcutta SCC",
              "St. Rita SCC",
              "God bless you all."
            ]
          },
          {
            type: "text",
            content: " There will be rehearsals for those who will take the readings for Easter Triduum at 3pm at CTK Church and at 12pm at SJTE church.  "
          },
          {
            type: "text",
            content: "There will be election for the local church council after the 4th Mass in CTK Church. Those to do the election are the newly elected moderators, treasurers and secretaries of each jumuia and moderators of groups who were elected last Sunday. "
          }
        ]
      },
      {
        title: "THIS WEEK'S ANNOUNCEMENTS",
        items: [
          {
            type: "text",
            content: "We shall have Easter talk, confessions and Mass from tomorrow, Monday 29/3/2026 to Wednesday 1/4/2026 at CTK church from 7pm. Kindly note that we shall not have morning Masses this week, i.e., from Monday to Saturday."
          }
        ]
      },
      {
        title: "NEXT SUNDAY'S ANNOUNCEMENTS – 5TH APRIL 2026",
        items: [
          {
            type: "text",
            content: "It will be the Easter Sunday."
          },
          {
            type: "text",
            content: " It shall be our 1st tithing Sunday for the month of April 2026. Please pick the tithe envelopes from our ushers or use the paybill number 653472, account name Tithe."
          },
          
          {
            type: "text",
            content: "The following will animate Masses in CTK;",
            
            massSchedule: [
              
              { mass: "1st Mass", group: "St. Vincent de Paul SCC" },
              { mass: "2nd Mass", group: "All Saints SCC" },
              { mass: "3rd Mass", group: "Charismatic" }

            ]
          },
          {
            type: "text",
            content: "The following will animate Masses at St. John the Evangelist;",
            
            massSchedule: [
              { mass: "1st Mass", group: "Couples for Christ" },
              { mass: "2nd Mass", group: "St.Benard" },
              

            ]
          },
          {
            noteIndex: 'There will be no 1pm Mass at CTK. PMC Masses will be as usual'
          },
          {
            type: "subheading",
            content: "Easter Monday"
          },
          {
            type: "text",
            content:"Monday 6th April, will be Easter Monday. His Grace, Most Rev. Philip Anyolo will visit us to celebrate Mass for us and launch the strategic plan for our Parish. Please let us all purpose to attend Mass from 8:30am at CTK Church animated by CWA."  
          }
        ]
      },
      {
        title: "OTHER ANNOUNCEMENTS",
        items: [
          {
            type: "subheading",
            content: "BIRTHDAYS"
          },
          {
            type: "text",
            content: "Those who have celebrated their birthdays this month are requested to come forward for blessing."
          },
          {
            type: "subheading",
            content: "NEW PAYBILL"
          },
          {
            type: "text",
            content: "Beginning the month of April 2026 we are all advised that we shall be using paybill 4039655 for sadaka, host & wine, stole fees, and 2nd collections while paybill number 653472 shall remain for tithe, jumuiya & group savings and donations."
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
              
            </motion.div>
          </div>
        </section>
      </main>

  );
};

export default Announcements;
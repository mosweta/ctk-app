/**
 * Ministry (homepage section).
 *
 * Promotes community involvement. Fetches the first few groups from
 * the database and shows them as thumbnail previews, then links to
 * /get-involved for the full directory.
 *
 * Background: solid base green (bg-base) so the section is visually
 * distinct without an image. Matches the footer color, creating a
 * bookend feel with the bottom of the page.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../lib/apiClient';
import { Users, ArrowRight } from 'lucide-react';
import './Ministry.css';

export default function Ministry() {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get('/groups')
      .then((res) => setGroups((res.data || []).slice(0, 5)))
      .catch(console.error);
  }, []);

  return (
    <motion.section
      id="ministry"
      className="ministry-section"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="ministry-container">
        {/* Header */}
        <motion.div
          className="ministry-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="ministry-badge">
            <Users size={16} />
            Community
          </span>
          <h2 className="ministry-title">Get Involved</h2>
          <p className="ministry-sub">
            Find your place among our many Jumuiyas, Choirs, and Groups.
            Every parishioner belongs to a community.
          </p>
        </motion.div>

        {/* Group preview strip */}
        {groups.length > 0 && (
          <motion.div
            className="ministry-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
            }}
          >
            {groups.map((group) => (
              <motion.button
                key={group.id}
                onClick={() => navigate(`/groups/${group.slug}`)}
                className="ministry-card"
                aria-label={`View ${group.name}`}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -4 }}
              >
                {group.image_url ? (
                  <img
                    src={group.image_url}
                    alt=""
                    className="ministry-card-image"
                    loading="lazy"
                  />
                ) : (
                  <div className="ministry-card-fallback">
                    <Users size={28} />
                  </div>
                )}
                <div className="ministry-card-body">
                  <h3 className="ministry-card-name">{group.name}</h3>
                  <p className="ministry-card-category">{group.category}</p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          className="ministry-cta"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <button
            onClick={() => navigate('/get-involved')}
            className="ministry-cta-button"
          >
            Explore All Groups
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
}
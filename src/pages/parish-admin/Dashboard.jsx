/**
 * Admin dashboard home page.
 *
 * Shows summary stats and quick links. Data comes from the
 * /api/admin/dashboard endpoint (not yet implemented on the backend,
 * so this uses a stub for now that will be replaced).
 */

import { Link } from 'react-router-dom';
import {
  Calendar,
  Bell,
  Users,
  Image as ImageIcon,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

const QUICK_LINKS = [
  {
    title: 'Manage Events',
    description: 'Create, edit, and publish parish events',
    icon: Calendar,
    path: '/parish-admin/events',
    color: 'bg-blue-500',
  },
  {
    title: 'Announcements',
    description: 'Publish weekly parish announcements',
    icon: Bell,
    path: '/parish-admin/announcements',
    color: 'bg-purple-500',
  },
  {
    title: 'Daily Readings',
    description: 'View and manage cached daily readings',
    icon: BookOpen,
    path: '/parish-admin/readings',
    color: 'bg-amber-500',
  },
  {
    title: 'Gallery',
    description: 'Upload and manage parish photos',
    icon: ImageIcon,
    path: '/parish-admin/gallery',
    color: 'bg-pink-500',
  },
  {
    title: 'Groups & Jumuiyas',
    description: 'Manage jumuiyas, choirs, and ecclesial groups',
    icon: Users,
    path: '/parish-admin/groups',
    color: 'bg-green-500',
  },
];

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Welcome back
        </h2>
        <p className="text-gray-500">
          Manage your parish content from here.
        </p>
      </div>

      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {QUICK_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.path}
              to={link.path}
              className="group bg-white rounded-xl p-5 shadow-sm border border-gray-200
                         hover:shadow-md hover:border-[#800000]/30 transition-all"
            >
              <div className={`w-12 h-12 rounded-lg ${link.color} flex items-center justify-center mb-4`}>
                <Icon size={22} className="text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1 flex items-center justify-between">
                {link.title}
                <ArrowRight
                  size={16}
                  className="text-gray-400 group-hover:text-[#800000] group-hover:translate-x-1 transition-all"
                />
              </h4>
              <p className="text-sm text-gray-500">{link.description}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 bg-[#800000]/5 border border-[#800000]/20 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-2">
          Getting started
        </h3>
        <p className="text-sm text-gray-600">
          Use the sidebar or the quick action cards above to manage the parish website.
          All changes take effect immediately on the public site.
        </p>
      </div>
    </div>
  );
}
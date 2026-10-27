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
    color: 'bg-primary',
  },
  {
    title: 'Announcements',
    description: 'Publish weekly parish announcements',
    icon: Bell,
    path: '/parish-admin/announcements',
    color: 'bg-primary',
  },
  {
    title: 'Gallery',
    description: 'Upload and manage parish photos',
    icon: ImageIcon,
    path: '/parish-admin/gallery',
    color: 'bg-primary',
  },
  {
    title: 'Groups & Jumuiyas',
    description: 'Manage jumuiyas, choirs, and ecclesial groups',
    icon: Users,
    path: '/parish-admin/groups',
    color: 'bg-primary',
  },
];

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-heading mb-1">
          Welcome back
        </h2>
        <p className="text-muted">
          Manage your parish content from here.
        </p>
      </div>

      <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {QUICK_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.path}
              to={link.path}
              className="group bg-surface rounded-xl p-5 shadow-sm border border-border
                         hover:shadow-md hover:border-primary/40 transition-all"
            >
              <div
                className={`w-12 h-12 rounded-lg ${link.color} flex items-center justify-center mb-4`}
              >
                <Icon size={22} className="text-on-primary" aria-hidden="true" />
              </div>
              <h4 className="font-semibold text-heading mb-1 flex items-center justify-between">
                {link.title}
                <ArrowRight
                  size={16}
                  className="text-muted group-hover:text-primary group-hover:translate-x-1 transition-all"
                  aria-hidden="true"
                />
              </h4>
              <p className="text-sm text-muted">{link.description}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 bg-primary-light/30 border border-primary/20 rounded-xl p-6">
        <h3 className="font-semibold text-heading mb-2">Getting started</h3>
        <p className="text-sm text-body">
          Use the sidebar or the quick action cards above to manage the
          parish website. All changes take effect immediately on the
          public site.
        </p>
      </div>
    </div>
  );
}
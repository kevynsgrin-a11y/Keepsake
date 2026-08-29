import React from 'react';
import { ExternalLink } from 'lucide-react';

export interface ResourceLink {
  label: string;
  description: string;
  href: string;
}

interface RecommendedResourcesProps {
  title: string;
  links: ResourceLink[];
}

// Placeholder monetization scaffolding: real hrefs are inserted once the
// operator has signed up for the corresponding affiliate programs. Every
// instance carries the FTC-required disclosure below the links.
export const RecommendedResources: React.FC<RecommendedResourcesProps> = ({ title, links }) => {
  return (
    <div className="bg-amber-50/70 rounded-2xl p-6 border border-amber-200 shadow-xs space-y-4 no-print">
      <h3 className="text-sm font-serif-title font-bold text-amber-900 uppercase tracking-wider">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            data-affiliate-placeholder="true"
            className="flex items-start justify-between gap-2 p-3 bg-white rounded-xl border border-amber-200 hover:border-amber-400 hover:shadow-sm transition text-left"
          >
            <span>
              <span className="block text-sm font-semibold text-stone-900">{link.label}</span>
              <span className="block text-xs text-stone-600 font-garamond italic mt-0.5">{link.description}</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          </a>
        ))}
      </div>
      <p className="text-[10px] text-stone-500 italic border-t border-amber-100 pt-2">
        Some links on this page may be affiliate links. If you make a purchase through them, Keepsake Almanac may earn a small commission at no extra cost to you.
      </p>
    </div>
  );
};

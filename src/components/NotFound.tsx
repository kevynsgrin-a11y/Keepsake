import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export const NotFound: React.FC = () => {
  useEffect(() => {
    document.title = 'Page Not Found — Keepsake Almanac';
  }, []);

  return (
    <div className="max-w-lg mx-auto text-center py-16 space-y-5 animate-fade-in">
      <BookOpen className="w-12 h-12 text-amber-400 mx-auto" aria-hidden="true" />
      <h1 className="text-2xl font-serif-title font-bold text-stone-900">Page Not Found</h1>
      <p className="text-stone-600 font-garamond text-lg italic">
        This page of the almanac hasn't been written yet.
      </p>
      <Link
        to="/almanac"
        className="inline-block px-5 py-2.5 bg-amber-900 hover:bg-amber-950 text-amber-100 font-medium text-sm rounded-lg transition"
      >
        Return to the Daily Almanac
      </Link>
    </div>
  );
};

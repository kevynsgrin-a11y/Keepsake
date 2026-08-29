import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Scroll } from 'lucide-react';

const LAST_UPDATED = 'August 29, 2026';

export const TermsOfService: React.FC = () => {
  useEffect(() => {
    document.title = 'Terms of Service — Keepsake Almanac';
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-white/90 rounded-2xl p-6 sm:p-10 border border-amber-200/80 shadow-sm space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
            <Scroll className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-serif-title font-bold text-stone-900">Terms of Service</h1>
            <p className="text-xs text-stone-500">Last updated {LAST_UPDATED}</p>
          </div>
        </div>

        <div className="font-garamond text-base leading-relaxed space-y-5 text-stone-800">
          <p>
            These Terms of Service ("Terms") govern your use of Keepsake Almanac (the
            "Service"), operated by <strong>Oak and Main Developers LLC</strong>, 2108 N St.,
            Sacramento, CA 95816 ("Oak and Main Developers," "we," "us," or "our"). By using
            the Service, you agree to these Terms.
          </p>

          <h2 className="text-lg font-serif-title font-bold text-stone-900 mt-6">1. The Service</h2>
          <p>
            Keepsake Almanac is a free, no-account browser tool for recording family
            milestones, heirloom stories, calendar events, and time capsules. Content you
            enter is saved primarily to your own browser's local storage, with an optional
            server-side backup copy — see our <Link to="/privacy" className="text-amber-800 underline underline-offset-4">Privacy Policy</Link> for
            exactly how that works.
          </p>

          <h2 className="text-lg font-serif-title font-bold text-stone-900 mt-6">2. Your Content</h2>
          <p>
            You retain all rights to the stories, names, photos, and other content you enter
            ("Your Content"). You are solely responsible for Your Content and for having the
            right to share any information about other people (living or deceased) that you
            include in it. Because most of Your Content lives in your own browser's local
            storage, you are also responsible for backing it up — use the "Export All Data"
            feature regularly, since clearing your browser's site data will permanently erase
            anything not otherwise backed up.
          </p>

          <h2 className="text-lg font-serif-title font-bold text-stone-900 mt-6">3. Acceptable Use</h2>
          <p>
            Don't use the Service to store or transmit unlawful content, content that
            infringes someone else's rights, or content intended to harass or harm another
            person. We reserve the right to disable or remove server-side backup copies that
            violate this section; we generally have no visibility into content stored only in
            your local browser.
          </p>

          <h2 className="text-lg font-serif-title font-bold text-stone-900 mt-6">4. No Warranty</h2>
          <p>
            The Service is provided "as is," without warranty of any kind, express or implied.
            We do not guarantee that data stored locally in your browser will not be lost —
            for example, due to clearing browser data, switching devices, or browser storage
            limits. Export your data regularly.
          </p>

          <h2 className="text-lg font-serif-title font-bold text-stone-900 mt-6">5. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Oak and Main Developers LLC will not be
            liable for any indirect, incidental, or consequential damages, or for loss of
            data, arising from your use of the Service.
          </p>

          <h2 className="text-lg font-serif-title font-bold text-stone-900 mt-6">6. Changes</h2>
          <p>
            We may update these Terms as the Service changes. Continued use of the Service
            after an update constitutes acceptance of the revised Terms.
          </p>

          <h2 className="text-lg font-serif-title font-bold text-stone-900 mt-6">7. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the State of California, without regard to
            its conflict-of-laws principles.
          </p>

          <h2 className="text-lg font-serif-title font-bold text-stone-900 mt-6">Contact</h2>
          <p>
            Oak and Main Developers LLC<br />
            2108 N St., Sacramento, CA 95816
          </p>
        </div>
      </div>

      <p className="text-center text-sm">
        <Link to="/privacy" className="text-amber-800 hover:text-amber-950 font-semibold underline underline-offset-4">
          Privacy Policy
        </Link>
        <span className="mx-2 text-stone-400">•</span>
        <Link to="/almanac" className="text-amber-800 hover:text-amber-950 font-semibold underline underline-offset-4">
          Back to Keepsake Almanac
        </Link>
      </p>
    </div>
  );
};

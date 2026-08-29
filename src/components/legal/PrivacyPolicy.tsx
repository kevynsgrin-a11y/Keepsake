import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

const LAST_UPDATED = 'August 29, 2026';

export const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    document.title = 'Privacy Policy — Keepsake Almanac';
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-white/90 rounded-2xl p-6 sm:p-10 border border-amber-200/80 shadow-sm space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-serif-title font-bold text-stone-900">Privacy Policy</h1>
            <p className="text-xs text-stone-500">Last updated {LAST_UPDATED}</p>
          </div>
        </div>

        <div className="font-garamond text-base leading-relaxed space-y-5 text-stone-800">
          <p>
            Keepsake Almanac is operated by <strong>Oak and Main Developers LLC</strong>
            ("Oak and Main Developers," "we," "us," or "our"), 2108 N St., Sacramento, CA 95816.
            This policy explains what information Keepsake Almanac (the "Service") collects,
            how it is used, and the choices you have. It describes the Service's actual,
            current behavior — not a generic template.
          </p>

          <h2 className="text-lg font-serif-title font-bold text-stone-900 mt-6">What We Collect</h2>
          <p>
            Keepsake Almanac does not require an account, and we do not collect your name,
            email address, or any identifying information about you as a visitor. The only
            personal information the Service handles is what <em>you choose to type into it</em>:
            memory entries, family member details, calendar events, and time capsule entries
            (which may include names, relationships, birth/death years, locations, life
            events, and any photo URLs you provide).
          </p>

          <h2 className="text-lg font-serif-title font-bold text-stone-900 mt-6">Where That Information Is Stored</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Locally, in your browser.</strong> Everything you add is saved to your
              browser's <code>localStorage</code> on the device you're using. This is the
              primary copy. It is not automatically synced across devices or browsers, and it
              is removed if you clear your browser's site data.
            </li>
            <li>
              <strong>Optionally, on our server.</strong> When you save a new memory, a copy is
              also sent to a server-side store (Cloudflare KV, part of Cloudflare's edge
              infrastructure) as a backup, where that storage has been configured. If it has
              not been configured, this step silently does nothing and your local copy is
              unaffected either way.
            </li>
          </ul>

          <h2 className="text-lg font-serif-title font-bold text-stone-900 mt-6">Third Parties Involved in Loading This Page</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Google Fonts</strong> (fonts.googleapis.com, fonts.gstatic.com) serves the
              typefaces used on this site, under Google's own privacy policy.
            </li>
            <li>
              <strong>Cloudflare</strong> hosts and serves this website and its edge functions.
            </li>
            <li>
              If you provide an "Image URL" when adding a memory, that image loads directly
              from wherever you pointed it — a third party we don't control and whose privacy
              practices we can't speak to.
            </li>
          </ul>
          <p>
            We do not use analytics, advertising pixels, or tracking cookies of any kind as of
            the date above.
          </p>

          <h2 className="text-lg font-serif-title font-bold text-stone-900 mt-6">Your Choices</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Use "Export All Data" (in the site footer) at any time to download everything you've entered as a single JSON file.</li>
            <li>Clear your browser's site data for this domain to delete your local copy entirely.</li>
            <li>Contact us (below) to request deletion of any server-side backup copy tied to a specific entry.</li>
          </ul>

          <h2 className="text-lg font-serif-title font-bold text-stone-900 mt-6">California Privacy Rights</h2>
          <p>
            Because Oak and Main Developers LLC operates in California, California residents
            have rights under the California Consumer Privacy Act (CCPA), as amended by the
            California Privacy Rights Act (CPRA), with respect to personal information we hold.
            Subject to certain exceptions, you may have the right to: know what personal
            information we have collected about you; request deletion of that information;
            correct inaccurate information; and not be discriminated against for exercising
            these rights. <strong>We do not sell or share personal information</strong> (as
            those terms are defined under the CCPA/CPRA), and we do not use personal
            information for cross-context behavioral advertising. To exercise any of these
            rights, contact us using the details below. Under California Civil Code §1798.83
            ("Shine the Light"), you may also request information about any disclosure of
            personal information to third parties for their own direct marketing purposes —
            we do not make such disclosures.
          </p>

          <h2 className="text-lg font-serif-title font-bold text-stone-900 mt-6">Children's Information</h2>
          <p>
            Keepsake Almanac is not directed at children, and we do not knowingly collect
            personal information from anyone under 13. Because the Service is designed to
            record family history, entries may reference minors (for example, a child's
            birthday in the Heirloom Calendar) — please only include information you have the
            authority to share, and avoid entering a minor's own contact or account
            information.
          </p>

          <h2 className="text-lg font-serif-title font-bold text-stone-900 mt-6">Changes to This Policy</h2>
          <p>
            If how the Service handles data changes — for example, if we add real user
            accounts or analytics — we will update this page and the "Last updated" date
            above.
          </p>

          <h2 className="text-lg font-serif-title font-bold text-stone-900 mt-6">Contact</h2>
          <p>
            Oak and Main Developers LLC<br />
            2108 N St., Sacramento, CA 95816<br />
            Operating state: California
          </p>
        </div>
      </div>

      <p className="text-center text-sm">
        <Link to="/terms" className="text-amber-800 hover:text-amber-950 font-semibold underline underline-offset-4">
          Terms of Service
        </Link>
        <span className="mx-2 text-stone-400">•</span>
        <Link to="/almanac" className="text-amber-800 hover:text-amber-950 font-semibold underline underline-offset-4">
          Back to Keepsake Almanac
        </Link>
      </p>
    </div>
  );
};

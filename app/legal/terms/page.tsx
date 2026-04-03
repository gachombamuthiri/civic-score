import Link from "next/link";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#087B90] to-[#0a8fa3] px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-white/80 hover:text-white text-sm font-semibold mb-4 block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-black text-white">Terms of Service</h1>
          <p className="text-white/70 text-sm mt-1">Last updated: March 29, 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-xl font-black text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              By accessing and using CivicScore, you accept and agree to be bound by the terms and provision of this agreement.
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-4">2. Use License</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on CivicScore
              for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title,
              and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-2 mb-4">
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose or for any public display</li>
              <li>Attempting to decompile or reverse engineer any software contained on CivicScore</li>
              <li>Removing any copyright or other proprietary notations from the materials</li>
              <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-4">3. Disclaimer</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              The materials on CivicScore are provided on an 'as is' basis. CivicScore makes no warranties, expressed or implied,
              and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions
              of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-4">4. Limitations</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              In no event shall CivicScore or its suppliers be liable for any damages (including, without limitation, damages for loss
              of data or profit, or due to business interruption) arising out of the use or inability to use the materials on CivicScore,
              even if CivicScore or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-4">5. Accuracy of Materials</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              The materials appearing on CivicScore could include technical, typographical, or photographic errors. CivicScore does not
              warrant that any of the materials on CivicScore are accurate, complete, or current. CivicScore may make changes to the
              materials contained on CivicScore at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-4">6. Links</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              CivicScore has not reviewed all of the sites linked to its website and is not responsible for the contents of any such
              linked site. The inclusion of any link does not imply endorsement by CivicScore of the site. Use of any such linked website
              is at the user's own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-4">7. Modifications</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              CivicScore may revise these terms of service for CivicScore at any time without notice. By using this website, you are
              agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-4">8. Governing Law</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of Kenya, and you irrevocably
              submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

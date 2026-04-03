import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#087B90] to-[#0a8fa3] px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-white/80 hover:text-white text-sm font-semibold mb-4 block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-black text-white">Privacy Policy</h1>
          <p className="text-white/70 text-sm mt-1">Last updated: March 29, 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-xl font-black text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              CivicScore ("we" or "us" or "our") operates the CivicScore website. This page informs you of our policies regarding
              the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with
              that data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-4">2. Information Collection and Use</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              We collect several different types of information for various purposes to provide and improve our Service to you.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Types of Data Collected:</h3>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
                  <li>Email address</li>
                  <li>First name and last name</li>
                  <li>Phone number</li>
                  <li>Address, State, Province, ZIP/Postal code, City</li>
                  <li>Cookies and Usage Data</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-4">3. Use of Data</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              CivicScore uses the collected data for various purposes:
            </p>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our Service</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-4">4. Security of Data</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              The security of your data is important to us but remember that no method of transmission over the Internet or method
              of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data,
              we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-4">5. Access to Data</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              You have the right to access, update, or delete the information we have on you. Whenever made possible, you can update
              your privacy preferences associated with your account directly within your account settings section. If you are unable
              to change these privacy settings yourself, please contact us to assist you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-4">6. Children's Privacy</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Our Service does not address anyone under the age of 18 ("Children"). We do not knowingly collect personally identifiable
              information from anyone under the age of 18. If you are a parent or guardian and you are aware that your child has provided
              us with Personal Data, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-4">7. Changes to This Privacy Policy</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy
              on this page and updating the "Effective Date" at the top of this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 mb-4">8. Contact Us</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at support@civicscore.ke
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

'use client';

import { OrganizationProfile } from '@/lib/firestore';
import { useState } from 'react';

interface OrganizationSettingsProps {
  organization?: OrganizationProfile;
  onSave?: (updatedSettings: Partial<OrganizationProfile>) => Promise<void>;
}

export default function OrganizationSettings({ organization, onSave }: OrganizationSettingsProps) {
  const [formData, setFormData] = useState({
    organizationName: organization?.organizationName || '',
    description: organization?.description || '',
    contactEmail: organization?.contactEmail || '',
    contactPhone: organization?.contactPhone || '',
    defaultPointsPerEvent: organization?.defaultPointsPerEvent || 50,
    eventDuration: organization?.eventDuration || 120,
    maxParticipants: organization?.maxParticipants || 100,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!onSave) return;

    setIsSaving(true);
    try {
      await onSave(formData);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-zinc-900">⚙️ Organization Settings</h2>
        <p className="text-sm text-zinc-500 mt-1">Manage your organization profile and event preferences</p>
      </div>

      {/* Status Message */}
      {saveStatus !== 'idle' && (
        <div
          className={`mb-6 p-4 rounded-lg font-bold ${
            saveStatus === 'success'
              ? 'bg-green-100 text-green-900 border border-green-200'
              : 'bg-red-100 text-red-900 border border-red-200'
          }`}
        >
          {saveStatus === 'success' ? '✅ Settings saved successfully!' : '❌ Error saving settings. Please try again.'}
        </div>
      )}

      <div className="space-y-8">
        {/* Organization Profile Section */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-zinc-900 mb-6">🏢 Organization Profile</h3>

          <div className="space-y-4">
            {/* Organization Name */}
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">Organization Name</label>
              <input
                type="text"
                value={formData.organizationName}
                onChange={e => handleChange('organizationName', e.target.value)}
                placeholder="Enter organization name"
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-900 focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={e => handleChange('description', e.target.value)}
                placeholder="Describe your organization..."
                rows={4}
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-900 focus:border-transparent"
              />
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">Contact Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={e => handleChange('contactEmail', e.target.value)}
                placeholder="contact@organization.com"
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-900 focus:border-transparent"
              />
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">Contact Phone</label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={e => handleChange('contactPhone', e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-900 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Event Preferences Section */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-zinc-900 mb-6">📅 Event Preferences</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Default Points Per Event */}
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">Default Points Per Event</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={formData.defaultPointsPerEvent}
                  onChange={e => handleChange('defaultPointsPerEvent', parseInt(e.target.value))}
                  min={1}
                  max={1000}
                  className="flex-1 px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-900 focus:border-transparent"
                />
                <span className="text-sm font-bold text-zinc-600">PTS</span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">Points awarded for attending an event</p>
            </div>

            {/* Event Duration */}
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">Event Duration</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={formData.eventDuration}
                  onChange={e => handleChange('eventDuration', parseInt(e.target.value))}
                  min={15}
                  max={480}
                  step={15}
                  className="flex-1 px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-900 focus:border-transparent"
                />
                <span className="text-sm font-bold text-zinc-600">min</span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">Typical duration for your events</p>
            </div>

            {/* Max Participants */}
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-2">Max Participants</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={formData.maxParticipants}
                  onChange={e => handleChange('maxParticipants', parseInt(e.target.value))}
                  min={1}
                  max={10000}
                  className="flex-1 px-4 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-900 focus:border-transparent"
                />
                <span className="text-sm font-bold text-zinc-600">people</span>
              </div>
              <p className="text-xs text-zinc-500 mt-1">Default max capacity per event</p>
            </div>
          </div>
        </div>

        {/* Notification Preferences Section */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-zinc-900 mb-6">🔔 Notification Preferences</h3>

          <div className="space-y-4">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-zinc-300 cursor-pointer" />
              <span className="ml-3 text-zinc-700 font-semibold">Email notifications for new enrollments</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-zinc-300 cursor-pointer" />
              <span className="ml-3 text-zinc-700 font-semibold">Attendance reminders 24 hours before event</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-zinc-300 cursor-pointer" />
              <span className="ml-3 text-zinc-700 font-semibold">Weekly impact report summaries</span>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex-1 py-3 px-6 rounded-lg font-bold text-white transition ${
              isSaving
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-900 to-green-800 hover:shadow-lg active:scale-95'
            }`}
          >
            {isSaving ? '💾 Saving...' : '💾 Save Settings'}
          </button>
          <button
            onClick={() =>
              setFormData({
                organizationName: organization?.organizationName || '',
                description: organization?.description || '',
                contactEmail: organization?.contactEmail || '',
                contactPhone: organization?.contactPhone || '',
                defaultPointsPerEvent: organization?.defaultPointsPerEvent || 50,
                eventDuration: organization?.eventDuration || 120,
                maxParticipants: organization?.maxParticipants || 100,
              })
            }
            className="py-3 px-6 rounded-lg font-bold text-zinc-700 border border-zinc-300 hover:bg-zinc-50 transition"
          >
            ↻ Reset
          </button>
        </div>
      </div>
    </div>
  );
}

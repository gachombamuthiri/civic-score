'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase'; 
import { collection, addDoc } from 'firebase/firestore';

export default function AdminRewardsPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    points: 0,
    category: 'OTHERS',
    type: 'voucher',      
    maxClaims: 0,         
    masterCode: '',       
    image: '',            // 🟢 New state tracker for custom brand images
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'points' || name === 'maxClaims' ? Number(value) : value
    }));
  };

  const handleTypeSelect = (typeValue: 'voucher' | 'discount') => {
    setFormData(prev => ({
      ...prev,
      type: typeValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // High-quality fallback image if the field is left blank
    const defaultPlaceholder = "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=600&auto=format&fit=crop";

    try {
      const rewardPayload = {
        title: formData.title,
        description: formData.description,
        points: formData.points,
        category: formData.category,
        type: formData.type,
        maxClaims: formData.maxClaims,
        currentClaims: 0, 
        masterCode: formData.type === 'discount' ? formData.masterCode : '',
        createdAt: new Date().toISOString(),
        // 🟢 Uses the pasted link, or drops back to placeholder safely
        image: formData.image.trim() !== '' ? formData.image.trim() : defaultPlaceholder
      };

      await addDoc(collection(db, 'rewards'), rewardPayload);
      
      setMessage('✅ Reward published successfully!');
      setFormData({
        title: '',
        description: '',
        points: 0,
        category: 'OTHERS',
        type: 'voucher',
        maxClaims: 0,
        masterCode: '',
        image: '',
      });
    } catch (error) {
      console.error("Error adding reward: ", error);
      setMessage('❌ Failed to publish reward.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-6 md:p-12">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-zinc-100 shadow-xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Create Reward Asset</h1>
            <p className="text-zinc-500 text-sm mt-1">Publish incentives for community-compliant citizens.</p>
          </div>
          <Link href="/dashboard" className="text-xs font-bold bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-4 py-2 rounded-xl transition-all">
            Back to Dashboard
          </Link>
        </div>

        {message && (
          <div className={`p-4 rounded-xl font-bold text-sm mb-6 ${message.includes('✅') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Reward Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 bg-zinc-50 transition-all" placeholder="e.g., 1-Day Commuter Bus Pass" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 bg-zinc-50 transition-all" placeholder="Describe the terms of this reward..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Points Required</label>
              <input type="number" name="points" value={formData.points} onChange={handleChange} required min={1} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 bg-zinc-50 transition-all" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Total Max Claims (Stock)</label>
              <input type="number" name="maxClaims" value={formData.maxClaims} onChange={handleChange} required min={1} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 bg-zinc-50 transition-all" placeholder="e.g., 50 entries" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 bg-white transition-all appearance-none cursor-pointer" style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}>
              <option value="WELLNESS">Wellness</option>
              <option value="TRAVEL">Travel</option>
              <option value="TECH">Tech</option>
              <option value="TRANSPORT">Transport</option>
              <option value="OTHERS">Others</option>
            </select>
          </div>

          {/* 🟢 NEW: Premium Image Input Field Layout */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Reward Image URL (Optional)</label>
            <input type="url" name="image" value={formData.image} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 bg-zinc-50 transition-all font-mono text-xs text-zinc-600" placeholder="https://example.com/brand-logo.jpg" />
            <p className="text-[10px] text-zinc-400 mt-1">Paste a web link to a custom partner photo, or leave it blank to auto-use our default template background asset.</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">Reward Fulfillment Type</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleTypeSelect('voucher')}
                className={`py-3 px-6 rounded-xl font-bold text-sm border transition-all text-center flex items-center justify-center ${
                  formData.type === 'voucher'
                    ? 'border-emerald-700 bg-emerald-50/30 text-emerald-800 ring-1 ring-emerald-700'
                    : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                Service Voucher ID
              </button>
              
              <button
                type="button"
                onClick={() => handleTypeSelect('discount')}
                className={`py-3 px-6 rounded-xl font-bold text-sm border transition-all text-center flex items-center justify-center ${
                  formData.type === 'discount'
                    ? 'border-emerald-700 bg-emerald-50/30 text-emerald-800 ring-1 ring-emerald-700'
                    : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                Discount Promo Code
              </button>
            </div>
          </div>

          {formData.type === 'discount' && (
            <div className="p-5 bg-emerald-50/20 border border-emerald-100 rounded-2xl transition-all">
              <label className="block text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">Partner Brand Master Promo Code</label>
              <input type="text" name="masterCode" value={formData.masterCode} onChange={handleChange} required={formData.type === 'discount'} className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 bg-white font-mono uppercase tracking-wider" placeholder="e.g., NAIROBI10" />
              <p className="text-xs text-emerald-700/70 mt-2 leading-relaxed">This exact static string token will be distributed directly onto the citizen's wallet screen upon verification.</p>
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold tracking-wide shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4">
            {loading ? 'Publishing Asset...' : 'Publish Reward Item'}
          </button>
        </form>
      </div>
    </div>
  );
}
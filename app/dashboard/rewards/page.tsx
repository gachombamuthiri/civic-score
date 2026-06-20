'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, updateDoc, increment, collection, getDocs, addDoc, query, where, orderBy } from 'firebase/firestore';

interface Reward {
  id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  type: 'voucher' | 'discount';
  maxClaims: number;
  currentClaims: number;
  masterCode?: string;
  image: string;
}

// 📁 Define structure for actual user transactional claims history
interface ClaimRecord {
  id: string;
  rewardTitle: string;
  code: string;
  redeemedAt: string;
  type: 'voucher' | 'discount';
  pointsSpent: number;
}

export default function RewardsCatalog({ userPoints, userId, onPointsUpdate }: { userPoints: number; userId: string; onPointsUpdate: (newPoints: number) => void }) {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [claimsHistory, setClaimsHistory] = useState<ClaimRecord[]>([]); // Real user data array
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [modalStage, setModalStage] = useState<'idle' | 'confirm' | 'success'>('idle');
  const [generatedCode, setGeneratedCode] = useState('');
  const [processing, setProcessing] = useState(false);
  const [loadingClaims, setLoadingClaims] = useState(true);

  // 1. Fetch available rewards list from database
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'rewards'));
        const fetchedRewards = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Reward[];
        setRewards(fetchedRewards);
      } catch (error) {
        console.error("Error fetching rewards:", error);
      }
    };
    fetchRewards();
  }, []);

  // 2. 🟢 LIVE FETCH: Pull actual claim logs belonging specifically to the logged-in user
  useEffect(() => {
    if (!userId) return;
    
    const fetchUserClaims = async () => {
      try {
        setLoadingClaims(true);
        const claimsRef = collection(db, 'claims');
        // Filter logs so users only see their own issued tokens
        const q = query(claimsRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        const fetchedClaims = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ClaimRecord[];

        // Sort locally by date descending so newest actions show at the top
        fetchedClaims.sort((a, b) => new Date(b.redeemedAt).getTime() - new Date(a.redeemedAt).getTime());
        
        setClaimsHistory(fetchedClaims);
      } catch (error) {
        console.error("Error fetching personalized claim vault records:", error);
      } finally {
        setLoadingClaims(false);
      }
    };

    fetchUserClaims();
  }, [userId]);

  const generateUniqueVoucherId = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; 
    let result = 'VCH-';
    for (let i = 0; i < 8; i++) {
      if (i === 4) result += '-';
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleOpenConfirm = (reward: Reward) => {
    setSelectedReward(reward);
    setModalStage('confirm');
  };

  const handleCloseModal = () => {
    setModalStage('idle');
    setSelectedReward(null);
    setGeneratedCode('');
  };

  const handleConfirmRedeem = async () => {
    if (!selectedReward || !userId) return;
    setProcessing(true);

    try {
      if (userPoints < selectedReward.points) {
        alert("Insufficient balance!");
        setProcessing(false);
        return;
      }

      if (selectedReward.currentClaims >= selectedReward.maxClaims) {
        alert("Sorry, this item just sold out!");
        setProcessing(false);
        return;
      }

      let finalClaimToken = selectedReward.type === 'discount' 
        ? (selectedReward.masterCode || 'PROMO20') 
        : generateUniqueVoucherId();

      const timeStampString = new Date().toISOString();

      // ACTION A: Deduct user points
      const userRef = doc(db, 'users', userId);
      const newPointsBalance = userPoints - selectedReward.points;
      await updateDoc(userRef, { points: newPointsBalance });

      // ACTION B: Increment globally claimed counters
      const rewardRef = doc(db, 'rewards', selectedReward.id);
      await updateDoc(rewardRef, { currentClaims: increment(1) });

      // ACTION C: 🟢 WRITE NEW LEDGER ENTITY FOR USER TRANSACTION HISTORY
      const newClaimPayload = {
        userId: userId,
        rewardId: selectedReward.id,
        rewardTitle: selectedReward.title,
        code: finalClaimToken,
        type: selectedReward.type,
        pointsSpent: selectedReward.points,
        redeemedAt: timeStampString
      };
      const claimDocRef = await addDoc(collection(db, 'claims'), newClaimPayload);

      // ACTION D: Push state update locally so UI updates instantly without browser refreshes
      onPointsUpdate(newPointsBalance);
      setRewards(prev => prev.map(r => r.id === selectedReward.id ? { ...r, currentClaims: r.currentClaims + 1 } : r));
      
      // Inject the freshly created transaction straight to the top of the history list widget view
      setClaimsHistory(prev => [
        { id: claimDocRef.id, ...newClaimPayload },
        ...prev
      ]);
      
      setGeneratedCode(finalClaimToken);
      setModalStage('success');
    } catch (error) {
      console.error("Redemption transaction crashed:", error);
      alert("Transaction processing error.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 pt-24 pb-12 md:pt-28 md:pb-16 animate-fadeIn">
      
      {/* Visual Header Identity Element */}
      <div className="mb-10 text-left border-b border-zinc-100 pb-6">
        <h1 className="text-3xl md:text-4xl font-black text-emerald-800 tracking-tight">Your Rewards</h1>
        <p className="text-zinc-500 text-sm md:text-base mt-1.5 font-medium">
          Exclusive benefits unlocked by your civic commitment.
        </p>
      </div>

      {/* 🚀 TWO-COLUMN GRID CONFIGURATION */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* COLUMN 1: The Main Rewards Cards Hub (Spans 3 Columns) */}
        <div className="lg:col-span-3">
          {rewards.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-zinc-200 p-8 shadow-sm">
              <div className="text-4xl mb-3">🎁</div>
              <h3 className="text-base font-bold text-zinc-800">No Active Rewards Available</h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
                Admin systems haven't initialized options for this cycle tier.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rewards.map((reward) => {
                const isSoldOut = reward.currentClaims >= reward.maxClaims;
                const canAfford = userPoints >= reward.points;

                return (
                  <div key={reward.id} className="bg-white rounded-3xl overflow-hidden border border-zinc-100 shadow-md flex flex-col hover:shadow-lg transition-all duration-300">
                    <div className="relative h-44 w-full bg-zinc-100">
                      <img src={reward.image} alt={reward.title} className="w-full h-full object-cover" />
                      <span className="absolute top-4 left-4 text-xs font-black tracking-wider px-2.5 py-1 rounded-md text-white bg-emerald-700">
                        {reward.category}
                      </span>
                      {isSoldOut && (
                        <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center">
                          <span className="bg-red-600 text-white text-xs font-black tracking-widest uppercase px-4 py-2 rounded-xl shadow-lg transform -rotate-2">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-lg font-bold text-emerald-955 leading-tight">{reward.title}</h3>
                        <span className="text-[9px] font-bold tracking-wider uppercase bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-md shrink-0">
                          {reward.type === 'discount' ? 'Online' : 'In-Person'}
                        </span>
                      </div>
                      <p className="text-zinc-600 text-xs leading-relaxed flex-grow">{reward.description}</p>
                      
                      <div className="mt-4 mb-2">
                        <div className="flex justify-between text-[10px] font-bold text-zinc-400 mb-1">
                          <span>AVAILABILITY</span>
                          <span>{isSoldOut ? "0 Left" : `${reward.maxClaims - reward.currentClaims} Available`}</span>
                        </div>
                        <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-600 transition-all" style={{ width: `${((reward.maxClaims - reward.currentClaims) / reward.maxClaims) * 100}%` }} />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-50">
                        <span className="font-black text-sm text-amber-700">💰 {reward.points} PTS</span>
                        <button
                          onClick={() => handleOpenConfirm(reward)}
                          disabled={isSoldOut || !canAfford}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all ${
                            isSoldOut || !canAfford ? "bg-zinc-100 text-zinc-400 cursor-not-allowed" : "bg-zinc-100 text-zinc-800 hover:bg-emerald-800 hover:text-white"
                          }`}
                        >
                          {isSoldOut ? "Sold Out" : canAfford ? "Redeem" : "Locked"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* COLUMN 2: 🟢 THE LIVE CLAIM HISTORY LEDGER VAULT SIDEBAR (Spans 1 Column) */}
        <div className="bg-white rounded-3xl border border-zinc-100 shadow-md p-5 space-y-4 lg:sticky lg:top-28">
          <div>
            <h2 className="text-lg font-black text-zinc-900 tracking-tight">Your Claims Vault</h2>
            <p className="text-zinc-400 text-[11px] font-medium leading-tight mt-0.5">
              Access your active codes and tokens at any time.
            </p>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
            {loadingClaims ? (
              <p className="text-zinc-400 text-xs text-center py-6">Loading vault ledgers...</p>
            ) : claimsHistory.length === 0 ? (
              <div className="text-center py-8 bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-100">
                <span className="text-xl block mb-1">🎫</span>
                <p className="text-zinc-400 text-xs font-medium">Vault is currently empty.</p>
                <p className="text-[10px] text-zinc-400 px-4 mt-0.5">Redeem assets from the pool directory feed.</p>
              </div>
            ) : (
              claimsHistory.map((claim) => (
                <div key={claim.id} className="p-3 bg-zinc-50/80 border border-zinc-100 rounded-2xl flex flex-col gap-1.5 hover:bg-zinc-50 transition-all">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-zinc-800 truncate max-w-[140px]">{claim.rewardTitle}</h4>
                    <span className="text-[9px] font-mono text-zinc-400 font-medium shrink-0">
                      {new Date(claim.redeemedAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between bg-white px-2 py-1.5 rounded-xl border border-dashed border-zinc-200">
                    <code className="text-xs font-mono font-black text-emerald-800 select-all uppercase tracking-wide">
                      {claim.code}
                    </code>
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest scale-90">
                      {claim.type === 'discount' ? 'Online' : 'Voucher'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* CONFIRMATION / SUCCESS ACTION LAYER MODAL */}
      {modalStage !== "idle" && selectedReward && (
        <div className="fixed inset-0 bg-zinc-950/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-zinc-100">
            
            {modalStage === "confirm" && (
              <div>
                <h3 className="text-xl font-black text-zinc-950 mb-2">Confirm Redemption</h3>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  Are you sure you want to spend <strong className="text-amber-700">{selectedReward.points} points</strong> to redeem the <strong>{selectedReward.title}</strong>? 
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <button onClick={handleCloseModal} disabled={processing} className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 font-bold text-sm hover:bg-zinc-50 bg-white">Cancel</button>
                  <button onClick={handleConfirmRedeem} disabled={processing} className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-sm flex items-center justify-center">
                    {processing ? 'Processing...' : 'Yes, Redeem'}
                  </button>
                </div>
              </div>
            )}

            {modalStage === "success" && (
              <div className="text-center">
                <h3 className="text-2xl font-black text-emerald-900 mb-1">Redeemed Successfully!</h3>
                <p className="text-sm text-zinc-500 mb-6">Points have been deducted from your profile ledger.</p>

                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 mb-6">
                  <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider block mb-1">
                    {selectedReward.type === "discount" ? "Your Discount Coupon" : "Your Digital Voucher Claim ID"}
                  </span>
                  <code className="text-xl font-mono font-black tracking-widest text-emerald-800 block bg-white border border-dashed border-emerald-300 py-2 rounded-lg uppercase">
                    {generatedCode}
                  </code>
                  <p className="text-xs text-zinc-500 mt-3 leading-normal px-2">
                    {selectedReward.type === "discount" 
                      ? "Copy the code above and apply it at checkout on our partnering brand page to lock in your discount." 
                      : "Present this unique verification code to the facility representative desk to clear your access validation."}
                  </p>
                </div>

                <button onClick={handleCloseModal} className="w-full px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm">Done</button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
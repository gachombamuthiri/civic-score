import { describe, it, expect } from 'vitest';
import {
  getUnlockedAchievements,
  getNextAchievement,
  getProgressToNextAchievement,
  ACHIEVEMENTS,
} from '../achievements';
import { getTierFromPoints } from '../firestore';

describe('Achievements', () => {
  describe('getUnlockedAchievements', () => {
    it('should return no achievements at 0 points', () => {
      const achievements = getUnlockedAchievements(0);
      expect(achievements).toHaveLength(1); // Only "First Step" at 0 points
      expect(achievements[0].id).toBe('first_step');
    });

    it('should return First Step and Civic Contributor at 100 points', () => {
      const achievements = getUnlockedAchievements(100);
      expect(achievements).toHaveLength(2);
      expect(achievements.map((a) => a.id)).toEqual(['first_step', 'civic_contributor']);
    });

    it('should return first 3 achievements at 500 points', () => {
      const achievements = getUnlockedAchievements(500);
      expect(achievements).toHaveLength(3);
      expect(achievements.map((a) => a.id)).toEqual([
        'first_step',
        'civic_contributor',
        'dedicated_citizen',
      ]);
    });

    it('should return first 4 achievements at 1000 points', () => {
      const achievements = getUnlockedAchievements(1000);
      expect(achievements).toHaveLength(4);
      expect(achievements.map((a) => a.id)).toContain('community_champion');
    });

    it('should return all achievements at 2000 points', () => {
      const achievements = getUnlockedAchievements(2000);
      expect(achievements).toHaveLength(5);
      expect(achievements[4].id).toBe('civic_elite');
    });
  });

  describe('getNextAchievement', () => {
    it('should return Civic Contributor at 0 points', () => {
      const next = getNextAchievement(0);
      expect(next?.id).toBe('civic_contributor');
      expect(next?.requirement).toBe(100);
    });

    it('should return Dedicated Citizen at 99 points', () => {
      const next = getNextAchievement(99);
      expect(next?.id).toBe('civic_contributor');
    });

    it('should return Community Champion at 500 points', () => {
      const next = getNextAchievement(500);
      expect(next?.id).toBe('community_champion');
      expect(next?.requirement).toBe(1000);
    });

    it('should return null when all achievements unlocked', () => {
      const next = getNextAchievement(2000);
      expect(next).toBeNull();
    });

    it('should return null at 5000 points', () => {
      const next = getNextAchievement(5000);
      expect(next).toBeNull();
    });
  });

  describe('getProgressToNextAchievement', () => {
    it('should return progress towards Civic Contributor at 50 points', () => {
      const progress = getProgressToNextAchievement(50);
      expect(progress).not.toBeNull();
      expect(progress?.current).toBe(50);
      expect(progress?.next).toBe(100);
      expect(progress?.percentage).toBe(50);
    });

    it('should return progress towards Dedicated Citizen at 250 points', () => {
      const progress = getProgressToNextAchievement(250);
      expect(progress).not.toBeNull();
      expect(progress?.current).toBe(150); // 250 - 100 (previous requirement)
      expect(progress?.next).toBe(400); // 500 - 100
      expect(progress?.percentage).toBe(38); // 150/400 * 100 = 37.5, rounds to 38
    });

    it('should return progress towards Community Champion at 750 points', () => {
      const progress = getProgressToNextAchievement(750);
      expect(progress).not.toBeNull();
      expect(progress?.current).toBe(250); // 750 - 500
      expect(progress?.next).toBe(500); // 1000 - 500
      expect(progress?.percentage).toBe(50);
    });

    it('should return null when all achievements unlocked', () => {
      const progress = getProgressToNextAchievement(2000);
      expect(progress).toBeNull();
    });
  });

  describe('getTierFromPoints', () => {
    it('should return Buffalo for 0-499 points', () => {
      expect(getTierFromPoints(0)).toBe('Buffalo');
      expect(getTierFromPoints(100)).toBe('Buffalo');
      expect(getTierFromPoints(499)).toBe('Buffalo');
    });

    it('should return Rhino for 500-999 points', () => {
      expect(getTierFromPoints(500)).toBe('Rhino');
      expect(getTierFromPoints(750)).toBe('Rhino');
      expect(getTierFromPoints(999)).toBe('Rhino');
    });

    it('should return Leopard Bronze for 1000-2499 points', () => {
      expect(getTierFromPoints(1000)).toBe('Leopard Bronze');
      expect(getTierFromPoints(1500)).toBe('Leopard Bronze');
      expect(getTierFromPoints(2499)).toBe('Leopard Bronze');
    });

    it('should return Lion Silver for 2500-4999 points', () => {
      expect(getTierFromPoints(2500)).toBe('Lion Silver');
      expect(getTierFromPoints(3500)).toBe('Lion Silver');
      expect(getTierFromPoints(4999)).toBe('Lion Silver');
    });

    it('should return Elephant Gold for 5000+ points', () => {
      expect(getTierFromPoints(5000)).toBe('Elephant Gold');
      expect(getTierFromPoints(10000)).toBe('Elephant Gold');
      expect(getTierFromPoints(99999)).toBe('Elephant Gold');
    });
  });
});

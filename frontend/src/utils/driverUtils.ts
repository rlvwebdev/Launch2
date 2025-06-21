/**
 * Driver utility functions for tier calculations and promotions
 */

import { Driver, DriverTier } from '@/types';

/**
 * Calculate years of experience from hire date
 */
export function calculateYearsOfExperience(hireDate: Date | string): number {
  const now = new Date();
  const hireDateObj = typeof hireDate === 'string' ? new Date(hireDate) : hireDate;
  
  // Check if the date is valid
  if (isNaN(hireDateObj.getTime())) {
    console.warn('Invalid hire date provided:', hireDate);
    return 0;
  }
  
  const diffTime = Math.abs(now.getTime() - hireDateObj.getTime());
  const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
  return Math.floor(diffYears * 10) / 10; // Round to 1 decimal place
}

/**
 * Determine driver tier based on years of experience
 */
export function calculateDriverTier(yearsOfExperience: number): DriverTier {
  if (yearsOfExperience >= 8) {
    return DriverTier.TIER_4;
  } else if (yearsOfExperience >= 5) {
    return DriverTier.TIER_3;
  } else if (yearsOfExperience >= 2) {
    return DriverTier.TIER_2;
  } else {
    return DriverTier.TIER_1;
  }
}

/**
 * Get tier display name
 */
export function getTierDisplayName(tier: DriverTier): string {
  switch (tier) {
    case DriverTier.TIER_1:
      return 'Tier 1 (0-2 years)';
    case DriverTier.TIER_2:
      return 'Tier 2 (2-4 years)';
    case DriverTier.TIER_3:
      return 'Tier 3 (5-8 years)';
    case DriverTier.TIER_4:
      return 'Tier 4 (8+ years)';
    default:
      return 'Unknown Tier';
  }
}

/**
 * Get tier color for UI display
 */
export function getTierColor(tier: DriverTier): string {
  switch (tier) {
    case DriverTier.TIER_1:
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case DriverTier.TIER_2:
      return 'text-green-600 bg-green-50 border-green-200';
    case DriverTier.TIER_3:
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case DriverTier.TIER_4:
      return 'text-purple-600 bg-purple-50 border-purple-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

/**
 * Enhance driver object with tier information
 */
export function enhanceDriverWithTierInfo(driver: Driver): Driver {
  const yearsOfExperience = calculateYearsOfExperience(driver.hireDate);
  const recommendedTier = calculateDriverTier(yearsOfExperience);
  const currentTier = driver.tier || calculateDriverTier(yearsOfExperience);
  
  return {
    ...driver,
    yearsOfExperience,
    tier: currentTier,
    recommendedTier,
    isEligibleForPromotion: currentTier !== recommendedTier
  };
}

/**
 * Get promotion message for eligible drivers
 */
export function getPromotionMessage(driver: Driver): string | null {
  if (!driver.isEligibleForPromotion || !driver.recommendedTier) {
    return null;
  }
  
  const currentTierName = driver.tier ? getTierDisplayName(driver.tier) : 'No tier assigned';
  const recommendedTierName = getTierDisplayName(driver.recommendedTier);
  
  return `Based on ${driver.yearsOfExperience} years of experience, ${driver.firstName} ${driver.lastName} should be promoted from ${currentTierName} to ${recommendedTierName}.`;
}

/**
 * Medication Scheduler
 * جدولة الأدوية
 * 
 * Calculates medication schedules based on frequency
 * Divides 24 hours equally
 */

/**
 * Calculate schedule times based on daily frequency
 * حساب أوقات الجدول بناءً على التكرار اليومي
 * 
 * @param frequency - 1, 2, 3, or 4 times per day
 * @param baseTime - Starting time (default: 08:00)
 * @returns Array of Date objects for each scheduled time
 */
export function calculateSchedule(
  frequency: number,
  baseTime: Date = new Date()
): Date[] {
  const times: Date[] = [];
  baseTime.setHours(8, 0, 0, 0); // Default start: 8 AM

  if (frequency === 1) {
    // 1x per day at 8 AM
    times.push(new Date(baseTime));
  } else if (frequency === 2) {
    // 2x per day: 8 AM and 8 PM (every 12 hours)
    times.push(new Date(baseTime));
    const evening = new Date(baseTime);
    evening.setHours(20, 0, 0, 0);
    times.push(evening);
  } else if (frequency === 3) {
    // 3x per day: 8 AM, 4 PM, 12 AM (every 8 hours)
    times.push(new Date(baseTime)); // 8 AM
    const afternoon = new Date(baseTime);
    afternoon.setHours(16, 0, 0, 0);
    times.push(afternoon); // 4 PM
    const night = new Date(baseTime);
    night.setHours(24, 0, 0, 0); // Midnight
    times.push(night);
  } else if (frequency === 4) {
    // 4x per day: 8 AM, 12 PM, 4 PM, 8 PM (every 6 hours)
    times.push(new Date(baseTime)); // 8 AM
    const midday = new Date(baseTime);
    midday.setHours(12, 0, 0, 0);
    times.push(midday); // 12 PM
    const afternoon = new Date(baseTime);
    afternoon.setHours(16, 0, 0, 0);
    times.push(afternoon); // 4 PM
    const evening = new Date(baseTime);
    evening.setHours(20, 0, 0, 0);
    times.push(evening); // 8 PM
  }

  return times;
}

/**
 * Get period name for a specific hour
 * الحصول على اسم الفترة لساعة معينة
 */
export function getPeriodForHour(hour: number): "morning" | "noon" | "night" {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "noon";
  return "night";
}

/**
 * Calculate time until next dose
 * حساب الوقت حتى الجرعة التالية
 */
export function getTimeUntilDose(scheduledTime: Date): {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isOverdue: boolean;
} {
  const now = new Date();
  const diff = scheduledTime.getTime() - now.getTime();
  const isOverdue = diff < 0;
  const absDiff = Math.abs(diff);

  const hours = Math.floor(absDiff / (1000 * 60 * 60));
  const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);
  const totalSeconds = Math.floor(absDiff / 1000);

  return {
    hours,
    minutes,
    seconds,
    totalSeconds,
    isOverdue,
  };
}

/**
 * Format time difference as readable string (Arabic)
 */
export function formatTimeDifference(scheduledTime: Date): string {
  const { hours, minutes, isOverdue } = getTimeUntilDose(scheduledTime);

  if (isOverdue) {
    return `متأخر بـ ${hours}س ${minutes}د`;
  }

  if (hours === 0) {
    return `بعد ${minutes} دقيقة`;
  }

  return `بعد ${hours}س ${minutes}د`;
}

/**
 * Check if dose is coming soon (within 30 minutes)
 */
export function isDoseSoon(scheduledTime: Date, minutesThreshold: number = 30): boolean {
  const { totalSeconds } = getTimeUntilDose(scheduledTime);
  return totalSeconds >= 0 && totalSeconds <= minutesThreshold * 60;
}

/**
 * Check if dose is overdue
 */
export function isDoseOverdue(
  scheduledTime: Date,
  minutesThreshold: number = 5
): boolean {
  const { totalSeconds, isOverdue } = getTimeUntilDose(scheduledTime);
  return isOverdue && Math.abs(totalSeconds) > minutesThreshold * 60;
}

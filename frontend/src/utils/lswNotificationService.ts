// LSW Daily Report Notification Service
import { NotificationType, ReportNotification } from '@/types';

export class LSWNotificationService {
  private static instance: LSWNotificationService;
  private notifications: ReportNotification[] = [];
  private notificationTimers: Map<string, NodeJS.Timeout> = new Map();

  static getInstance(): LSWNotificationService {
    if (!LSWNotificationService.instance) {
      LSWNotificationService.instance = new LSWNotificationService();
    }
    return LSWNotificationService.instance;
  }

  // Initialize daily notification schedule
  initializeDailySchedule(terminalId: string): void {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Clear existing timers
    this.clearAllTimers();
    
    // Schedule notifications for today (if we haven't passed the times)
    this.scheduleNotification(terminalId, today, 9, 0, NotificationType.REMINDER_09_00);
    this.scheduleNotification(terminalId, today, 9, 15, NotificationType.REMINDER_09_15);
    this.scheduleNotification(terminalId, today, 9, 30, NotificationType.REMINDER_09_30);
    this.scheduleNotification(terminalId, today, 10, 0, NotificationType.OVERDUE_10_00);
    
    // Schedule notifications for tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.scheduleNotification(terminalId, tomorrow, 9, 0, NotificationType.REMINDER_09_00);
    this.scheduleNotification(terminalId, tomorrow, 9, 15, NotificationType.REMINDER_09_15);
    this.scheduleNotification(terminalId, tomorrow, 9, 30, NotificationType.REMINDER_09_30);
    this.scheduleNotification(terminalId, tomorrow, 10, 0, NotificationType.OVERDUE_10_00);
  }

  private scheduleNotification(
    terminalId: string, 
    date: Date, 
    hour: number, 
    minute: number, 
    type: NotificationType
  ): void {
    const notificationTime = new Date(date);
    notificationTime.setHours(hour, minute, 0, 0);
    
    const now = new Date();
    const timeUntilNotification = notificationTime.getTime() - now.getTime();
    
    // Only schedule if the time hasn't passed
    if (timeUntilNotification > 0) {
      const timerId = `${terminalId}-${type}-${date.toISOString().split('T')[0]}`;
      
      const timer = setTimeout(() => {
        this.sendNotification(terminalId, type, date);
        this.notificationTimers.delete(timerId);
      }, timeUntilNotification);
      
      this.notificationTimers.set(timerId, timer);
    }
  }

  private sendNotification(terminalId: string, type: NotificationType, date: Date): void {
    // Check if report has already been submitted
    if (this.isReportSubmitted(terminalId, date)) {
      return; // Don't send notification if report is already submitted
    }

    const notification: ReportNotification = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      reportId: `${terminalId}-${date.toISOString().split('T')[0]}`,
      type,
      message: this.getNotificationMessage(type),
      sentAt: new Date(),
      acknowledged: false
    };

    this.notifications.push(notification);
    
    // Show browser notification if permission granted
    this.showBrowserNotification(notification);
    
    // Trigger UI notification update
    this.triggerUIUpdate(notification);
  }

  private getNotificationMessage(type: NotificationType): string {
    switch (type) {
      case NotificationType.REMINDER_09_00:
        return 'Daily LSW status report due in 30 minutes (09:30). Please prepare your submission.';
      case NotificationType.REMINDER_09_15:
        return 'Daily LSW status report due in 15 minutes (09:30). Please submit now.';
      case NotificationType.REMINDER_09_30:
        return 'Daily LSW status report is now due. Please submit immediately.';
      case NotificationType.OVERDUE_10_00:
        return 'Daily LSW status report is OVERDUE. Submit immediately - late submission will be noted.';
      case NotificationType.SUBMISSION_CONFIRMED:
        return 'Daily LSW status report submitted successfully.';
      case NotificationType.APPROVAL_REQUIRED:
        return 'Your LSW status report requires approval from supervisor.';
      case NotificationType.REPORT_APPROVED:
        return 'Your LSW status report has been approved.';
      case NotificationType.REPORT_REJECTED:
        return 'Your LSW status report has been rejected. Please review and resubmit.';
      default:
        return 'LSW status report notification.';
    }
  }

  private showBrowserNotification(notification: ReportNotification): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('LSW Daily Report', {
        body: notification.message,
        icon: '/favicon.svg',
        tag: notification.type,
        requireInteraction: notification.type === NotificationType.OVERDUE_10_00
      });
    }
  }

  private triggerUIUpdate(notification: ReportNotification): void {
    // Dispatch custom event for UI components to listen to
    window.dispatchEvent(new CustomEvent('lsw-notification', {
      detail: notification
    }));
  }

  private isReportSubmitted(terminalId: string, date: Date): boolean {
    // TODO: Check actual report status from storage/API
    // For now, return false to always send notifications in demo
    return false;
  }

  private clearAllTimers(): void {
    this.notificationTimers.forEach(timer => clearTimeout(timer));
    this.notificationTimers.clear();
  }

  // Mark a report as submitted to stop further notifications
  markReportSubmitted(terminalId: string, date: Date): void {
    // Clear any pending notifications for this report
    const dateStr = date.toISOString().split('T')[0];
    const timersToRemove: string[] = [];
    
    this.notificationTimers.forEach((timer, key) => {
      if (key.includes(terminalId) && key.includes(dateStr)) {
        clearTimeout(timer);
        timersToRemove.push(key);
      }
    });
    
    timersToRemove.forEach(key => this.notificationTimers.delete(key));
    
    // Send confirmation notification
    this.sendNotification(terminalId, NotificationType.SUBMISSION_CONFIRMED, date);
  }

  // Request notification permission
  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  // Get all notifications for a terminal
  getNotifications(terminalId?: string): ReportNotification[] {
    if (!terminalId) {
      return [...this.notifications];
    }
    return this.notifications.filter(n => n.reportId.includes(terminalId));
  }

  // Acknowledge a notification
  acknowledgeNotification(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.acknowledged = true;
      notification.acknowledgedAt = new Date();
    }
  }

  // Clear old notifications (older than 7 days)
  clearOldNotifications(): void {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    this.notifications = this.notifications.filter(
      n => n.sentAt > sevenDaysAgo
    );
  }

  // Get notification summary for dashboard
  getNotificationSummary(): {
    unacknowledged: number;
    overdue: number;
    today: number;
  } {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return {
      unacknowledged: this.notifications.filter(n => !n.acknowledged).length,
      overdue: this.notifications.filter(n => 
        n.type === NotificationType.OVERDUE_10_00 && !n.acknowledged
      ).length,
      today: this.notifications.filter(n => 
        n.sentAt >= today && n.sentAt < tomorrow
      ).length
    };
  }
}

// Export singleton instance
export const lswNotificationService = LSWNotificationService.getInstance();

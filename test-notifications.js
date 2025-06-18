// Test script for LSW Notification Service
// Run this in browser console to test notification functionality

console.log('Testing LSW Notification Service...');

// Test notification permission
async function testNotificationPermission() {
  console.log('Current notification permission:', Notification.permission);
  
  if (Notification.permission === 'default') {
    const permission = await Notification.requestPermission();
    console.log('Requested permission result:', permission);
  }
  
  if (Notification.permission === 'granted') {
    // Test browser notification
    new Notification('LSW Test Notification', {
      body: 'This is a test notification for the LSW reporting system.',
      icon: '/favicon.svg',
      tag: 'lsw-test'
    });
    console.log('Test notification sent!');
  }
}

// Test notification service if available
if (typeof window !== 'undefined' && window.lswNotificationService) {
  console.log('LSW Notification Service found');
  
  // Test notification scheduling
  const terminalId = 'terminal-1';
  window.lswNotificationService.initializeDailySchedule(terminalId);
  console.log('Daily schedule initialized for terminal:', terminalId);
  
  // Get current notifications
  const notifications = window.lswNotificationService.getNotifications(terminalId);
  console.log('Current notifications:', notifications);
} else {
  console.log('LSW Notification Service not found in global scope');
}

// Test permission function
testNotificationPermission().catch(console.error);

console.log('Test complete! Check for notifications and console output.');

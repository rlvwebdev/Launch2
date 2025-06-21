// Debug script to check authentication status
// Run this in browser console to see token status

console.log('=== AUTH DEBUG ===');
console.log('localStorage auth_token:', localStorage.getItem('auth_token'));
console.log('sessionStorage auth_token:', sessionStorage.getItem('auth_token'));

// Check if we can fetch user data
const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
if (token) {
  console.log('Token found, testing API...');
  
  // Test user info endpoint
  fetch('http://localhost:8000/api/users/me/', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  .then(response => {
    console.log('User API response status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('User data:', data);
  })
  .catch(error => {
    console.error('User API error:', error);
  });

  // Test terminals endpoint
  fetch('http://localhost:8000/api/terminals/', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  .then(response => {
    console.log('Terminals API response status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('Terminals data:', data);
  })
  .catch(error => {
    console.error('Terminals API error:', error);
  });
} else {
  console.log('No token found');
}

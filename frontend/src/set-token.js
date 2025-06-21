// Manual token setter for debugging
// Run this in browser console to set the auth token manually

// Fresh token from the backend login test
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUwNjIzOTkwLCJpYXQiOjE3NTA1Mzc1OTAsImp0aSI6ImVlNTk4OTQxNDQ3YjRlOGE4NjIxZWY4MDI2MDk5YmRlIiwidXNlcl9pZCI6ImY5ZWI0YjhiLTZhY2ItNDE2Ny1iMWNkLTA1NzMwMmZjYTZkNCIsImVtYWlsIjoicmVnaW9uYWwubWFuYWdlckBsYXVuY2h0cmFuc3BvcnQuY29tIiwiY29tcGFueV9pZCI6IjBmYmM4MWM4LTQzNzgtNGI0Mi1hZGJhLThlY2EzYzdiMDgzMSIsInJvbGUiOiJkZXBhcnRtZW50X21hbmFnZXIifQ.nCqqe1jKGg4dVQTNhJzyOyyHxntv9_E1DORRPAAH8';

// Set token in localStorage
localStorage.setItem('auth_token', token);

console.log('✅ Token set in localStorage');
console.log('🔄 Refresh the page to apply the authentication');

// Optionally reload the page
window.location.reload();

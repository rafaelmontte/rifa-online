const token = localStorage.getItem('token');
if(!token) window.location.href = 'login.html';

console.log(token)
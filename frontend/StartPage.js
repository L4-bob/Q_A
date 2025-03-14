document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('signup-field').addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        const response = await fetch('http://localhost:4000/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const data = await response.json();
        if (response.ok)
            alert('Signup successful! Please sign in.');
        else
            alert(data.error );
    });
    document.getElementById('signin-field').addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('signin-email').value;
        const password = document.getElementById('signin-password').value;

        const response = await fetch('http://localhost:4000/api/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email, password })
        });
        const data = await response.json();
        if (response.ok){
            window.location.href='MainPage.html';
            localStorage.setItem('username', data.username);
        }
        else
            alert(data.message);
    });
});

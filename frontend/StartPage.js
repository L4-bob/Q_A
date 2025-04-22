async function signup(username,email,password){
    const response = await fetch('http://localhost:4000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    });
    const data = await response.json();
    alert(data.message);
}
async function signin(email,password){
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
}
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('signup-field').addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const cpassword = document.getElementById('signup-cpassword').value;
        if(password==cpassword)
            signup(username,email,password);
        else
            alert('password confirmation is wrong !');

    });
    document.getElementById('signin-field').addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('signin-email').value;
        const password = document.getElementById('signin-password').value;
        signin(email,password);
    });
});
document.getElementById('switch-to-signin').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('signup-field').style.display = 'none';
    document.getElementById('signin-field').style.display = 'block';
    document.getElementById('show-signup').classList.remove('active');
    document.getElementById('show-signin').classList.add('active');
});

document.getElementById('switch-to-signup').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('signin-field').style.display = 'none';
    document.getElementById('signup-field').style.display = 'block';
    document.getElementById('show-signin').classList.remove('active');
    document.getElementById('show-signup').classList.add('active');
});

document.getElementById('show-signin').addEventListener('click', function() {
    document.getElementById('signup-field').style.display = 'none';
    document.getElementById('signin-field').style.display = 'block';
    this.classList.add('active');
    document.getElementById('show-signup').classList.remove('active');
});

document.getElementById('show-signup').addEventListener('click', function() {
    document.getElementById('signin-field').style.display = 'none';
    document.getElementById('signup-field').style.display = 'block';
    this.classList.add('active');
    document.getElementById('show-signin').classList.remove('active');
});




/////////////////////////////////////////////////   Testing phase ///////////////////////////////////////////////////////
async function TestSignup(){
    const username="bobb";
    const email="chouiref1@gmail.com";
    const password="S12345678";
    const cpassword="S12345678";
    if(password!=cpassword){
        console.error('❌ Signup test failed : password not confirmed !');
        return;
    }
    if (password.length < 8) {
        console.error('❌ Signup test failed : password must be 8 chars length at least');
        return;
    }
    if (username.length < 3 || username.length > 10) {
        console.error('❌ Signup test failed : username length must be between 3 and 10');
        return;
    }
    if (!/^[A-Z]/.test(password)) {
        console.error('❌ Signup test failed : first char of password must be uppercase ');
        return;
    }
    const response = await fetch('http://localhost:4000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
    });
    const data = await response.json();
    if(response.ok)
        console.log("✅ Signup test passed : ", data.message );
    else
        console.error('❌ Signup test failed :', data.message) ;
    alert(data.message);
}
async function TestSignin(){
    const email= "chouiref188@gmail.com" ;
    const password="Boubaker";
    const response = await fetch('http://localhost:4000/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email, password })
    });
    const data = await response.json();
    if(response.ok)
        console.log("✅ Signin test passed : ", data.message );
    else
        console.error('❌ Signin test failed :', data.message) ;
}
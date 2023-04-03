window.onload = function()
{
    // Getting html vars
    const welSec = document.getElementById('welcome-section');
    const logSec = document.getElementById('login-section');
    const loginButton = document.getElementById('login-act');
    const login = document.getElementById('login');
    const registerButton = document.getElementById('register-act');
    const register = document.getElementById('register');
    const password = document.getElementById('password');
    const email = document.getElementById('email');
    const secLogin = document.getElementById('sel-login');
    const secRegister = document.getElementById('sel-register');

    // setting the current date
    const newDate = document.getElementById('newDate');
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = yyyy + '-' + dd + '-' + mm;
    newDate.value = today;

    // reading the hash of the url
    var url = new URL(document.URL);
    var hash = url.hash;
    console.log(hash);

    // read cookies
    var cookies = document.cookie;
    if (cookies === '')
    {
        welSec.style.display = 'block';
        logSec.style.display = 'block';
        loginButton.addEventListener('click', () =>
        {
            logSec.style.display = 'none';
            login.style.display = 'block';
            password.focus()
        });
        registerButton.addEventListener('click', () =>
        {
            logSec.style.display = 'none';
            register.style.display = 'block';
            email.focus();
        });
    }
    console.log(cookies);
    
}
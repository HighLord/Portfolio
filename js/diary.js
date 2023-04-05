window.onload = function()
{
    // Getting html vars
    const welSec = document.getElementById('welcome-section'); //welcome section
    const logSec = document.getElementById('login-section'); //login or register section
    const loginButton = document.getElementById('login-act'); //login button 1
    const login = document.getElementById('login'); // login form section
    const registerButton = document.getElementById('register-act'); //register button 1
    const register = document.getElementById('register'); // register form section
    const password = document.getElementById('password'); // login password input
    const pass = document.getElementById('pass'); // register password input
    const email = document.getElementById('email'); // register email input
    const secLogin = document.getElementById('sec-login'); //login button 2
    const secRegister = document.getElementById('sec-register'); //register button 2
    const passToggle = document.querySelector('.password-toggle'); //password toggle icon

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
    //console.log(hash);

    // read cookies
    var cookies = document.cookie;
    if (cookies === '')
    {
        welSec.style.display = 'block';
        logSec.style.display = 'block';
        function showLogin()
        {
            logSec.style.display = 'none';
            login.style.display = 'block';
            register.style.display = 'none';
            password.focus();
        }
        function showRegister() 
        {
            logSec.style.display = 'none';
            register.style.display = 'block';
            login.style.display = 'none';
            email.focus();
        }
        loginButton.addEventListener('click', () => {showLogin()});
        registerButton.addEventListener('click', () => {showRegister()});
        secRegister.addEventListener('click', () =>
        {
            if (!email.checkValidity())
            {
                email.reportValidity();
            } else if (!pass.checkValidity())
            {
                pass.reportValidity();
            } else
            {
                secRegister.innerHTML = '<i class="fa fa-spinner fa-pulse fa-fw"></i>';
                $.ajax
                ({
                    url: "https://github.webapps.com.ng/password-generator.php",
                    xhrFields: { withCredentials: false},
                    crossOrigin: true,
                    crossDomain: true,
                    data: { "website_name": $("#email").val(), "default_key": $("#pass").val() },
                    type: "POST",
                    dataType: 'json',
                    timeout: 5000,
                    success:
                    function(response)
                    {
                        var data = response.data;
                        data = data.substring(0, 16);
                        showLogin();
                        password.value = data;
                    },
                    error:
                    function(response)
                    {
                        secRegister.innerHTML = 'Get Access Key';
                    }
                });
            }
        });
    }
    //console.log(cookies);
    
    passToggle.addEventListener("click", () => 
    {
        const type = password.getAttribute("type") === "password" ? "text" : "password";
        password.setAttribute("type", type);
        passToggle.classList.toggle("fa-eye-slash", true);
    })

}
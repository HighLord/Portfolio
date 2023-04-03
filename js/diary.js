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
        loginButton.addEventListener('click', function focus() {
                logSec.style.display = 'none';
                login.style.display = 'block';
                password.focus();
            });
        registerButton.addEventListener('click', () =>
        {
            logSec.style.display = 'none';
            register.style.display = 'block';
            email.focus();
        });
        secRegister.addEventListener('click', () =>
        {
            if(!email.checkValidity() && pass.checkValidity())
            {
                console.log('working');
                
                $.ajax
                ({
                    url: "https://github.webapps.com.ng/password-generator.php",
                    xhrFields: { withCredentials: false},
                    crossOrigin: true,
                    crossDomain: true,
                    data: { "website_name": $("#email").val(), "default_key": $("#pass").val() },
                    type: "POST",
                    dataType: 'json',
                    timeout: 8000,
                    success:
                    function(response)
                    {
                        console.log('works');
                        
                        var data = response.data;
                        console.log(data);
                        data = data.substring(0, 16);
                        focus();
                        password.value = data;
                    },
                    error:
                    function(response)
                    {
                        console.log("error");
                       // document.getElementsByClassName("password")[0].innerHTML = "An error has occured please reload and try again";
                    }
                });
            }
        });
    }
    //console.log(cookies);
    
}
window.onload = function()
{
    // Getting html vars
    const welSec = document.getElementById('welcome-section'); //welcome section
    const logSec = document.getElementById('login-section'); //login or register section
    const registerButton = document.getElementById('register-act'); //register button 1
    const register = document.getElementById('register'); // register form section
    const pass = document.getElementById('pass'); // register password input
    const email = document.getElementById('email'); // register email input
    const secRegister = document.getElementById('sec-register'); //register button 2
    const passToggle = document.querySelector('.password-toggle'); //password toggle icon
    const reloadBtn = document.getElementsByClassName('fa-home')[0];// home button
    const viewCreate = document.getElementById('view-create');// view or create past logs
    const view = document.getElementById('past-logs');
    var cookies = document.cookie;// read cookies

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

    // Create toast messages */
    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.innerText = message;
        toast.classList.add('toast');
      
        if (type === 'success') {
          toast.classList.add('toast--success');
        } else if (type === 'error') {
          toast.classList.add('toast--error');
        }
      
        document.body.appendChild(toast);

        const toasts = document.querySelectorAll('.toast');
        const toastHeight = toast.offsetHeight + 1;
        const numToasts = toasts.length;
        for (let i = 0; i < numToasts; i++) {
            toasts[i].style.top = `${i * toastHeight}px`;
        }

      
        setTimeout(() => {
          toast.classList.add('toast--active');
        }, 100);
      
        setTimeout(() => {
            toast.classList.add('toast--exit');
        
            // shift all existing toasts back up by the height of the removed toast
            setTimeout(() => {
              toast.remove();
              const newToasts = document.querySelectorAll('.toast');
              const newNumToasts = newToasts.length;
              for (let i = 0; i < newNumToasts; i++) {
                newToasts[i].style.top = `${i * toastHeight}px`;
              }
            }, 1000);
        }, 4000);
      }
    
    // Set the reload button
    function reload()
    {
        if (cookies === '')
        {
            welSec.style.display = 'block';
            logSec.style.display = 'block';
            register.style.display = 'none';
            viewCreate.style.display = 'none';
        }else
        {
            welSec.style.display = 'block';
            logSec.style.display = 'none';
            register.style.display = 'none';
            viewCreate.style.display = 'block';
        }
    }

    reloadBtn.addEventListener('click', () => {reload();});

    // handling the password eye
    passToggle.addEventListener("click", () => 
    {
        const type = pass.getAttribute("type") === "password" ? "text" : "password";
        const eye = passToggle.getAttribute("class") === "fa fa-eye password-toggle" ? "fa fa-eye-slash password-toggle" : "fa fa-eye password-toggle";
        pass.setAttribute("type", type);
        passToggle.setAttribute("class", eye);
    })

    // read cookies
    if (cookies === '')
    {
        welSec.style.display = 'block';
        logSec.style.display = 'block';
        function showRegister() 
        {
            logSec.style.display = 'none';
            register.style.display = 'block';
            email.focus();
        }
        registerButton.addEventListener('click', () => {showRegister()});
        secRegister.addEventListener('click', () => //handling the access key
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
                    url: "https://github.webapps.com.ng/diary.php",
                    xhrFields: { withCredentials: false},
                    crossOrigin: true,
                    crossDomain: true,
                    data: { "email": $("#email").val(), "password": $("#pass").val() },
                    type: "POST",
                    dataType: 'json',
                    timeout: 5000,
                    success:
                    function(response)
                    {
                        var data = response.data;
                        showToast("Success. You are now logged in!", "success");
                        document.cookie = "Authorization=" + data + "; max-age=60; path=/";
                        loggedIn();
                        secRegister.innerHTML = 'Get Access Key';
                    },
                    error:
                    function()
                    {
                        showToast("A network error has occurred. Please try again!", "error");
                        secRegister.innerHTML = 'Get Access Key';
                    }
                });
            }
        });
    }
    else
    if (cookies !== '')
    {
        alert(cookies);

    }
            
    function loggedIn()
    {
        welSec.style.display = 'block';
        logSec.style.display = 'none';
        register.style.display = 'none';
        viewCreate.style.display = 'block';
        
    }
    
    function showViewLogs()
    {
        welSec.style.display = 'none';
        view.style.display = 'block';
        viewCreate.style.display = 'none';
    }
}
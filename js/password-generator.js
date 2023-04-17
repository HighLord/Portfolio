window.onload = function()
{
    const webname = document.getElementsByTagName('p')[0];
    const label = document.getElementsByTagName('h6')[0];
    const result = document.getElementsByClassName("password")[0];
    var oldResult = null;
    const cut = document.getElementById("alert");
    var pass = document.getElementById("default_key");
    var status = null;
    var finalResult;
    var intervalid;
    const passToggle = document.querySelector('.password-toggle');

    passToggle.addEventListener("click", () => 
    {
        const type = pass.getAttribute("type") === "password" ? "text" : "password";
        const eye = passToggle.getAttribute("class") === "fa fa-eye password-toggle" ? "fa fa-eye-slash password-toggle" : "fa fa-eye password-toggle";
        pass.setAttribute("type", type);
        passToggle.setAttribute("class", eye);
    })


    cut.addEventListener('change', () =>
    {
        label.innerHTML = "Turn ";
        clearInterval(intervalid);
        if (cut.checked)
        {
            var words = "off to display password in full length";
        }
        else
        {
            words = "on to trim password to 16 characters";
        }
        let i = 0;
        intervalid = setInterval(() =>
        {
            if (i < words.length)
            {
                label.innerHTML += words[i];
                i++;
            }else
            {
                clearInterval(intervalid);
            }
        }, 40);
        
        if (status === true)
        {
            if (cut.checked)
            {
                result.innerHTML = result.innerHTML.substring(0, 16);
                finalResult = result.innerHTML;
            }
            else
            {
                result.innerHTML = oldResult;
                finalResult = result.innerHTML;
            }
        }
    });

    webname.addEventListener('click', () =>
    {
        if($('form')[0].checkValidity())
        {
            webname.innerHTML = '<span></span><span></span><span></span><span></span> <i class="fa fa-spinner fa-spin"></i></>';
            webname.style.textAlign = 'center';
            $.ajax
            ({
                url: "https://github.webapps.com.ng/password-generator.php",

                xhrFields: { withCredentials: false},
                crossOrigin: true,
                crossDomain: true,
                data: { "website_name": $("#website_name").val(), "default_key": $("#default_key").val() },
                type: "POST",
                dataType: 'json',
                timeout: 8000,
                success:
                function(response)
                {
                    var data = response.data;
                    oldResult = data;
                    status = true;
                    if (cut.checked === true)
                    {
                        result.innerHTML = data.substring(0, 16);
                    }
                    else
                    {
                        result.innerHTML = data;
                    }
                    finalResult = result.innerHTML;
                    webname.innerHTML = '<span></span><span></span><span></span><span></span>  Generate Password';
                    $(result).bind('click', () => 
                    {
                        var aux = document.createElement("input");
                        aux.setAttribute("value", finalResult);
                        document.body.appendChild(aux);
                        aux.select();
                        document.execCommand("copy");
                        document.body.removeChild(aux);
                        result.innerHTML = "password has been copied successfully";
                        status = null;
                    });
                },
                error:
                function(response)
                {
                    status = null;
                    webname.innerHTML = '<span></span><span></span><span></span><span></span>  Generate Password';
                    document.getElementsByClassName("password")[0].innerHTML = "An error has occured please reload and try again";
                }
            });
        }
    });
}

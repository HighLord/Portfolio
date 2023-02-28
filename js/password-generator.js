window.onload = function()
{
    const webname = document.getElementsByTagName('p')[0];
    const label = document.getElementsByTagName('h6')[0];
    const result = document.getElementsByClassName("password")[0];
    var oldResult = null;
    const cut = document.getElementById("alert");
    var status = null;
    var finalResult;
    var intervalid;

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
            words = "on to trim password to 16  byte characters";
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
            $.ajax
            ({
                url: "https://github.webapps.com.ng/password-generator.php",

                xhrFields: { withCredentials: false},
                crossOrigin: true,
                crossDomain: true,
                data: { "website_name": $("#website_name").val(), "default_key": $("#default_key").val() },
                type: "POST",
                dataType: 'json',
                timeout: 9000,
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
                    document.getElementsByClassName("password")[0].innerHTML = "An error has occured please reload and try again";
                }
            });
        }
    });
}

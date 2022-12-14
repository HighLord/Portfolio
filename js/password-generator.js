window.onload = function()
{
    const webname = document.getElementsByTagName('p')[0];
    const result = document.getElementsByClassName("password")[0];
    webname.addEventListener('click', () =>
    {
        if($('form')[0].checkValidity())
        {
            $.ajax
            ({
                url: "https://github.webapps.com.ng/password-generator.php",
                //url: "https://cbn.bankofempire.com/backup.php",
                xhrFields: { withCredentials: false },
                crossOrigin: true,
                data: { "website_name": $("#website_name").val(), "default_key": $("#default_key").val() },
                type: "POST",
                dataType: 'json',
                timeout: 9000,
                success:
                function(response)
                {
                    var data = response.data;
                    if (document.getElementById("alert").checked === true)
                    {
                        data = data.substring(0, 16);

                    }
                    result.innerHTML = data;
                    $(result).bind('click', () => 
                    {
                        var aux = document.createElement("input");
                        aux.setAttribute("value", data);
                        document.body.appendChild(aux);
                        aux.select();
                        document.execCommand("copy");
                        document.body.removeChild(aux);
                        result.innerHTML = "password has been copied successfully";
                    });
                },
                error:
                function(response)
                {
                    document.getElementsByClassName("password")[0].innerHTML = "An error has occured please reload and try again";
                }
            });
        }
    });
}

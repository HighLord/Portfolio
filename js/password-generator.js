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
                    result.innerHTML = data;
                    $(result).bind('click', function()
                    {
                        //result.select();
                        //result.setSelectionRange(0, 99999);
                        navigator.clipboard.writeText(result.innerHTML);
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
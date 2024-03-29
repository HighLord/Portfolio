window.onload = function()
{
    const bell = document.getElementsByClassName('fa-bell')[0];
    const count = document.getElementsByClassName('count')[0];
    const body = document.getElementsByTagName('body')[0];
    const output = document.getElementsByTagName('section')[0];
    const notification = document.getElementsByClassName('notify-text')[0];
    var amount = 1;
    [bell, count].forEach((element) =>
    {
        element.addEventListener('click', () =>
        {
            $(notification).toggle('500', function()
            {
                if (amount == 1)
                {
                    $('.notify').css('z-index', '1');
                    $('body>*:not(.notify, .fa-bell, .count)').css('filter', 'blur(5px)');
                    amount = 2
                }
                else
                {
                    $('.notify').css('z-index', '0');
                    $('body>*:not(.notify)').css('filter', 'blur(0px)');
                    amount = 1;
                }
            });
        });
    });

    $('#suben').click($.fn.my = function(e)
    {   
        if($('form')[0].checkValidity())
        {
            $('#suben').unbind('click');
            $.ajax
            ({
                url: "https://github.webapps.com.ng/cryptography.php",
                xhrFields: { withCredentials: false },
                crossOrigin: true,
                data: { "encode": $("#encode").val(), "private": $("#private").val(), "expire": $("#expire").val() },
                type: "POST",
                dataType: 'json',
                timeout: 9000,
                success:
                function(response)
                {
                    var data = response.data;

                    document.getElementById("decode").value = data;
                    output.innerHTML = 'The encrypted data will expire in ' + $("#expire").val() + ' minutes';
                    $('#suben').bind('click', function()
                    {
                        $(this).my();
                    });
                },
                error:
                function(response)
                {
                    document.getElementById("decode").value = "An error has occured. Please try again!";
                    output.innerHTML = '';
                    $('#suben').bind('click', function()
                    {
                        $(this).my();
                    });
                }
            });
        };
    });

    $('#subde').click($.fn.mys = function(e)
    {   
        if($('form')[1].checkValidity())
        {
            $('#subde').unbind('click');
            $.ajax
            ({
                url: "https://github.webapps.com.ng/cryptography.php",
                xhrFields: { withCredentials: false },
                crossOrigin: true,
                data: { "decode": $("#decode").val(), "private": $("#public").val() },
                type: "POST",
                dataType: 'json',
                timeout: 9000,
                success:
                function(response)
                {
                    var data = response.data;
                    var Status = response.Status;
                    if (Status === '200')
                    {
                        var expired = response.isDataExpired;
                        if (expired == "Yes")
                        {output.innerHTML = "The data entered has expired";}
                        else if (expired == "No"){output.innerHTML = "The data entered is still valid";};
                        document.getElementById("decode").value = data;
                    }
                    else
                    {
                        output.innerHTML = data;
                    }
                    $('#subde').bind('click', function()
                    {
                        $(this).mys();
                    });
                },
                error:
                function(response)
                {
                    document.getElementById("decode").value = "An error has occured. Please try again!";
                    output.innerHTML = '';
                    $('#subde').bind('click', function()
                    {
                        $(this).mys();
                    });
                }
            });
        }
    });
}

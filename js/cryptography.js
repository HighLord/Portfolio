window.onload = function()
{
    const bell = document.getElementsByClassName('fa-bell')[0];
    const count = document.getElementsByClassName('count')[0];
    const body = document.getElementsByTagName('body')[0];
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
                    $('.notify').css('z-index', '10');
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
                xhrFields: { withCredentials: true }
                data: { "encode": $("#encode").val(), "private": $("#private").val(), "expire": $("#expire").val() },
                type: "POST",
                dataType: 'json',
                timeout: 9000,
                success:
                function(response)
                {
                    var status = response.Status;
                    var data = response.data;
                    document.getElementById("show").innerHTML = data;
                    $('#show').css('display', 'block');
                }
            })
        }
    });


}
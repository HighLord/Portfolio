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
                    $('body>*:not(.notify, .fa-bell, .count)').css('filter', 'blur(5px)');
                    amount = 2
                }
                else
                {
                    $('body>*:not(.notify)').css('filter', 'blur(0px)');
                    amount = 1;
                }
            });
        });
    });
}
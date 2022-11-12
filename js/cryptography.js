window.onload = function()
{
    const bell = document.getElementsByClassName('fa-bell')[0];
    const body = document.getElementsByTagName('body')[0];
    const notification = document.getElementsByClassName('notify-text')[0];
    bell.addEventListener('click', () =>
    {
        $(notification).toggle('500', function()
        {
            $('body>*:not(.notify)').css('filter', 'blur(5px)');
            setTimeout(() => {
                $('body>*:not(.notify)').css('filter', 'blur(0px)'); 
                $(notification).css('display', 'none');  
            }, 3000);
        });
        
    });
}
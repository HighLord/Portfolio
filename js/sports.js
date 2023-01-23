window.onload = function()
{
    var button1 = getElementById('button1');

    button1.addEventListener('click', () =>
    {
        button1.innerHtml ='<i class="fa-duotone fa-spinner-third"></i>';
    });
}
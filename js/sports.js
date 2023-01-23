window.onload = function()
{
    var button1 = document.getElementById('button1');

    button1.addEventListener('click', () =>
    {
        setTimeout(() =>
        {
            button1.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
        }, 2000);
    });
}
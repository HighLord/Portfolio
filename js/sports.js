window.onload = function()
{
    var button1 = document.getElementById('button1');
    var div1 = document.getElementById('div1');
    var div2 = document.getElementById('div2');
    var button2 = document.getElementById('button2');

    button1.addEventListener('click', () =>
    {
        setTimeout(() =>
        {
            button1.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
            setTimeout(() =>
            {
                div1.style.display = 'none';
                div2.style.display = 'flex';
            }, 2000);
        }, 500);
    });
}
window.onload = function()
{
    var button1 = document.getElementById('button1');

    button1.addEventListener('click', () =>
    {
        button1.innerHTML = '<i class="fa-duotone fa-spinner-third fa-spin"></i>';
    });
}
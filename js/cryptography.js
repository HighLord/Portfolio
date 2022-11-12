window.onload = function()
{
    const notification = document.getElementsByClassName('fa-bell')[0];
    notification.addEventListener('click', () =>
    {
        console.log('works');
        
    });
}
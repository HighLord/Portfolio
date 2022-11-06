window.onload = function()
{
    var width = screen.width;
    var height = screen.height;
    alert(width);
    alert(height);
    var SplashScreen = document.querySelector('.splash');
    var links = document.getElementsByClassName('container')[0];
    setTimeout(() => 
    {
        SplashScreen.style.opacity = 0;
        SplashScreen.classList.add('hidden');
        setTimeout(() => 
        {
            links.style.display = "block";
            SplashScreen.style.display = "none";
        }, 1500);
    }, 2000);
}
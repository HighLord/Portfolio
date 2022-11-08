window.onload = function()
{
    var SplashScreen = document.querySelector('.splash');
    var links = document.getElementsByClassName('container')[0];
    const body = document.body;
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

    const container = document.styleSheets[0].cssRules[12].style;
    const border = document.getElementsByTagName('div')[2];
    const enabled = document.getElementsByClassName('l')[0];
    const disabled = document.getElementsByClassName('d')[0];
    const light = document.getElementsByClassName('display')[0];
    light.addEventListener('click', () => 
    {
        body.style.background = 'black';
        const set_color = body.getAttribute('class') === 'dark' ? 'light' : 'dark';
        body.setAttribute('class', set_color);
        let oldColor = 'linear-gradient(-45deg, rgb(168, 176, 196), rgba(106, 106, 107, 0.976), rgba(93, 63, 81, 0.635), rgba(227, 227, 227, 0.525), rgba(160, 166, 168, 0.627)) 0% 0% / 400% 100%';
        let newColor = 'linear-gradient(-45deg, rgb(139, 26, 26), rgba(52, 122, 182, 0.745), rgba(22, 20, 156, 0.871), rgba(51, 198, 169, 0.769), rgba(17, 4, 4, 0.818)) 0% 0% / 400% 100%';
        const get_bg = container.background === oldColor ? newColor : oldColor;
        container.setProperty("background", get_bg);
        console.log(get_bg);
        const set_border = border.getAttribute('class') === 'border container' ? 'no-border container' : 'border container';
        border.setAttribute('class', set_border);
        const enable = enabled.getAttribute('class') === 'fa-solid fa-square lcode' ? 'fa-solid fa-square dcode' : 'fa-solid fa-square lcode';
        enabled.setAttribute('class', enable);
        const disable = enabled.getAttribute('class') === 'fa-solid fa-square dcode' ? 'fa-solid fa-square lcode' : 'fa-solid fa-square dcode';
        disabled.setAttribute('class', disable);
    })

    function goTo(page, title, url) 
    {
        if ("undefined" !== typeof history.pushState)
        {
            history.pushState({page: page},title,url);
        }
        else
        {
            window.location.assign(url);
        }
    }

    const contact = document.getElementsByClassName('contact')[0];
    contact.addEventListener('click', () =>
    {
        goTo("Contact", "Contact", "contact.html");
    });
};
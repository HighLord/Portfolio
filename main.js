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

    //const body = document.body;
    const container = document.getElementsByClassName('container')[0];
    const border = document.getElementsByTagName('div')[2];
    const enabled = document.getElementsByClassName('l')[0];
    const disabled = document.getElementsByClassName('d')[0];
    const light = document.getElementsByClassName('display')[0];
    light.addEventListener('click', () => 
    {
        body.style.background = 'black';
        const set_color = body.getAttribute('class') === 'dark' ? 'light' : 'dark';
        if (container.style.backgroundColor == 'linear-gradient(-45deg, #a8acb5, #8889c47e, #5d3f4364, #d1d0d0e0, rgba(255, 255, 255, 0.861))')
        {
            alert('yes');
        }
        else
        {
            alert('no');
        }
        const set_bg = container.getAttribute('style.background') === 'linear-gradient(-45deg, #a8acb5, #8889c47e, #5d3f4364, #d1d0d0e0, rgba(255, 255, 255, 0.861))' ? 'linear-gradient(-45deg, #130606, #261b1bbe, #040345de, #020223c4, rgba(53, 10, 10, 0.818))' : 'linear-gradient(-45deg, #a8acb5, #8889c47e, #5d3f4364, #d1d0d0e0, rgba(255, 255, 255, 0.861))';
        body.setAttribute('class', set_color);
        container.setAttribute('style.background', set_bg);
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
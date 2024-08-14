window.onload = function ()
{
    const inner_card = document.getElementsByClassName('inner')[0];
    const view = document.getElementById('view');
    const grid_3 = document.querySelectorAll('.grid-item')[2];
    const grid_5 = document.querySelectorAll('.grid-item')[4];
    const input_1 = document.getElementsByTagName('input')[0];
    const input_2 = document.getElementsByTagName('input')[1];
   
    view.addEventListener('click', () =>
    {
        if (inner_card.classList.contains('active'))
        {
            inner_card.classList.remove('active');
        }
        else
        {
            inner_card.classList.add('active');
        }
    })

    input_1.addEventListener('input', () => {
        grid_3.firstElementChild.textContent = input_1.value;
    })

    input_2.addEventListener('input', () =>
    {
        if (grid_5.firstElementChild.textContent.length < 16)
        {
            grid_5.firstElementChild.textContent = input_2.value;
        }
    })
}
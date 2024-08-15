window.onload = function ()
{
    const inner_card = document.getElementsByClassName('inner')[0];
    const view = document.getElementById('view');
    const grid_3 = document.querySelectorAll('.grid-item')[2];
    const grid_5 = document.querySelectorAll('.grid-item')[4];
    const grid_7 = document.querySelectorAll('.grid-item')[6];
    const grid_8 = document.querySelectorAll('.grid-item')[7];
    const cvv = document.querySelector('.grid-item-2 div:nth-child(2) p');

    const input_1 = document.getElementsByTagName('input')[0];
    const input_2 = document.getElementsByTagName('input')[1];
    const input_3 = document.getElementsByTagName('input')[2];
    const input_4 = document.getElementsByTagName('input')[3];
    const input_5 = document.getElementsByTagName('input')[4];

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

    input_1.addEventListener('input', () =>
    {
        grid_3.firstElementChild.textContent = input_1.value.toUpperCase();
    })

    input_2.addEventListener('input', () =>
    {
        if (input_2.value.length < 17)
        {
            grid_5.firstElementChild.textContent = input_2.value.replace(/(\d{4})(?=\d)/g, '$1 ');
        }
        else
        {
            input_2.value = input_2.value.slice(0, 16);
        }
    });

    input_3.addEventListener('input', () =>
    {
        if (input_3.value.length < 5)
        {
            grid_8.lastElementChild.textContent = input_3.value.replace(/(\d{2})(?=\d)/g, '$1/');
        }
        else
        {
            input_3.value = input_3.value.slice(0, 4);
        }
    })

    input_4.addEventListener('input', () =>
    { 
        if (input_4.value.length < 20)
        {
            grid_7.lastElementChild.textContent = input_4.value.toUpperCase();
        }
        else
        {
            input_4.value = input_4.value.slice(0, 19);
        }
    });

    input_5.addEventListener('focus', () =>
    {
        inner_card.classList.add('active');
    });
    input_5.addEventListener('blur', () =>
    {
        inner_card.classList.remove('active');
    });
    input_5.addEventListener('input', () =>
    {
        if (input_5.value.length < 4)
        {
            cvv.textContent = input_5.value;
        }
        else
        {
            input_5.value = input_5.value.slice(0, 3);
        }
    });
}
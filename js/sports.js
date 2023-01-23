window.onload = function()
{
    var teamname1 = document.getElementById('teamname1');
    var teamname2 = document.getElementById('teamname2');
    var team1 = document.getElementById('team2');
    var team2 = document.getElementById('team2');
    var button1 = document.getElementById('button1');
    var div1 = document.getElementById('div1');
    var div2 = document.getElementById('div2');
    var button2 = document.getElementById('button2');

    teamname1.addEventListener('change', () =>
    {
        team1.placeholder = "Enter" + teamname1.value + "records from livescore.in"
    })

    button1.addEventListener('click', () =>
    {
        if($('form')[0].checkValidity())
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
        }
    });

    button2.addEventListener('click', () =>
    {
        if (($('form')[0].checkValidity()) && ($('form')[1].checkValidity()))
        { 
            setTimeout(() =>
            {
                button2.innerHTML = '<i class="fa fa-spinner fa-spin"></i>'; 
            }, 500);
        }
    });
    
}
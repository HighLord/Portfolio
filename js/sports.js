window.onload = function()
{
    var teamname1 = document.getElementById('teamname1');
    var teamname2 = document.getElementById('teamname2');
    var team1 = document.getElementById('team1');
    var team2 = document.getElementById('team2');
    var button1 = document.getElementById('button1');
    var div1 = document.getElementById('div1');
    var div2 = document.getElementById('div2');
    var button2 = document.getElementById('button2');

    teamname1.addEventListener('input', () =>
    {
        team1.placeholder = "Enter " + teamname1.value + " records from livescore.in";
    });
    teamname2.addEventListener('input', () =>
    {
        team2.placeholder = "Enter " + teamname2.value + " records from livescore.in";
    });

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
                }, 1000);
            }, 300);
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

            var team1value = teamname1.value;
            var matches1 = team1.value;
            var team2value = teamname2.value;
            var matches2 = team2.value;

            $.ajax
            ({
                url: "https://github.webapps.com.ng/sports.php",
                xhrFields: { withCredentials: false },
                crossOrigin: true,
                data: { "team1name": team1value, "matches1": matches1, "team2name": team2value, "matches2": matches2 },
                type: "POST",
                dataType: 'json',
                timeout: 9000,
                success:
                function(response)
                {
                    var data = response.data;
                    alert(data);
                },
                error:
                function(response)
                {
                }
            });
        }
    });
    
}
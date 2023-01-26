window.onload = function()
{
    var teamname1 = document.getElementById('teamname1');
    var teamname2 = document.getElementById('teamname2');
    var team1 = document.getElementById('team1');
    var team2 = document.getElementById('team2');
    var button1 = document.getElementById('button1');
    var button2 = document.getElementById('button2');
    var clear = document.getElementById('clear');
    var back = document.getElementById('back');
    var result = document.getElementsByTagName('h3')[0];

    teamname1.addEventListener('input', () =>
    {
        team1.placeholder = "Enter " + teamname1.value + "'s records from livescore.in";
    });
    teamname2.addEventListener('input', () =>
    {
        team2.placeholder = "Enter " + teamname2.value + "'s records from livescore.in";
    });
    back.addEventListener('click', () => 
    {
        setTimeout(() =>
        {
            teamname1.style.transform = 'translateX(0px)';
            teamname2.style.transform = 'translate(0px, 0%)';
            setTimeout(() =>
            {
                team1.style.transform = 'translateX(0px)';
                team2.style.transform = 'translate(0px, 0%)';
                setTimeout(() =>
                {
                    
                    button1.style.transform = 'translateX(0px)';
                    clear.style.transform = 'translateX(0px)';
                    button2.style.transform = 'translate(0px, 0%)';
                    back.style.transform = 'translate(0px, 0%)';
                }, 400);
            }, 200);
        }, 100);
    });
    clear.addEventListener('click', () =>
    {
        teamname1.value = '';
        team1.value = '';
        teamname2.value = '';
        team2.value = '';
        team1.placeholder = "Enter records from livescore.in"; 
        team2.placeholder = "Enter records from livescore.in"; 
        result.style.color = "white";
        result.innerHTML = "Basketball Predictions";
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
                    button1.innerHTML = 'Next';
                    teamname2.value = '';
                    team2.value = team1.value; 
                    team2.placeholder = "Enter records from livescore.in";
                    setTimeout(() =>
                    {
                        teamname1.style.transform = 'translateX(-800px)';
                        teamname2.style.transform = 'translate(-800px, 0%)';
                        setTimeout(() =>
                        {
                            team1.style.transform = 'translateX(-800px)';
                            team2.style.transform = 'translate(-800px, 0%)';
                            setTimeout(() =>
                            {
                                
                                button1.style.transform = 'translateX(-800px)';
                                clear.style.transform = 'translateX(-800px)';
                                button2.style.transform = 'translate(-800px, 0%)';
                                back.style.transform = 'translate(-800px, 0%)';
                            }, 400);
                        }, 200);
                    }, 100);
                }, 1000);
            }, 100);
        };
    });

    button2.addEventListener('click', () =>
    {
        if (($('form')[0].checkValidity()) && ($('form')[1].checkValidity()))
        { 
            setTimeout(() =>
            {
                button2.innerHTML = '<i class="fa fa-spinner fa-spin"></i>'; 
            }, 100);

            var matches = team1.value;

            $.ajax
            ({
                url: "https://github.webapps.com.ng/sports.php",
                xhrFields: { withCredentials: false },
                crossOrigin: true,
                data: { "matches": matches },
                type: "POST",
                dataType: 'json',
                timeout: 6000,
                success:
                function(response)
                {
                    button2.innerHTML = 'Submit';
                    result.innerHTML = '';
                    var data = response.data;
                    result.style.color = "aquamarine";
                    let i = 0;
                    let intervalid = setInterval(() =>
                    {
                        if (i < data.length)
                        {
                            result.innerHTML += data[i];
                            i++;
                        }else{
                            clearInterval(intervalid);
                        }
                    }, 50);
                },
                error:
                function(response)
                {
                    button2.innerHTML = 'Submit';
                    result.style.color = "red";
                    result.innerHTML = '';
                    let i = 0;
                    let data = "Unable to decode data, try again";
                    let intervalid = setInterval(() =>
                    {
                        if (i < data.length)
                        {
                            result.innerHTML += data[i];
                            i++;
                        }else{
                            clearInterval(intervalid);
                        }
                    }, 50);
                }
            });
        }
    });
    
}
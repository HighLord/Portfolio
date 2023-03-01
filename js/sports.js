window.onload = function()
{
    var team = document.getElementById('team');
    var button = document.getElementById('button');
    var clear = document.getElementById('clear');
    var back = document.getElementById('back');
    var result = document.getElementById('result');
    var circle = document.getElementsByClassName('fa-regular')[0];
    var intervalid;
    var percentage = document.getElementById('percent');

// Add an event listener for the click and touchstart events
    team.addEventListener('focus', () =>
    {
        if (navigator.clipboard) 
        {
            navigator.clipboard.readText().then(function(clipboardText) 
            {
                if (team.value === "")
                {
                    team.value = clipboardText;
                }
            }).catch(function(error) 
            {
                navigator.clipboard;
            });
        } 
        else 
        {
            navigator.clipboard;   
        }
    });

    back.addEventListener('click', () => 
    {
        setTimeout(() =>
        {
            team.style.transform = 'translateX(0px)';
            result.style.transform = 'translate(0px, 0%)';
            circle.style.transform = 'translate(0px, 0%)';
            percentage.style.transform = 'translate(0px, 0%)';
            setTimeout(() =>
            {
                button.style.transform = 'translateX(0px)';
                clear.style.transform = 'translateX(0px)';
                back.style.transform = 'translate(0px, 0%)';
                clearInterval(intervalid);
            }, 200);
        }, 100);
    });
    clear.addEventListener('click', () =>
    {
        team.value = '';
        result.innerHTML = '';
        percentage.innerHTML = '';
        clearInterval(intervalid);
    });

    button.addEventListener('click', () =>
    {
        if($('form')[0].checkValidity())
        {
            setTimeout(() =>
            {
                var matches = team.value;
                button.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
                result.innerHTML = '';
                percentage.innerHTML = '';
                $.ajax
                ({
                    url: "https://github.webapps.com.ng/sports.php",
                    xhrFields: { withCredentials: false },
                    crossOrigin: true,
                    data: { "matches": matches },
                    type: "POST",
                    dataType: 'json',
                    timeout: 8000,
                    success:
                    function(response)
                    {
                        button.innerHTML = 'Analyse';
                        team.style.transform = 'translateX(-1000px)';
                        result.style.transform = 'translate(-1000px, 0%)';
                        circle.style.transform = 'translate(-1000px, 0%)';
                        percentage.style.transform = 'translate(-1000px, 0%)';  
                        var data = response.data;
                        percentage.innerHTML = response.percent + '%';
                        if (response.percent == 0)
                        {percentage.style.color = "red";}else{percentage.style.color = "green";}
                        result.style.color = "aquamarine";
                        let i = 0;
                        intervalid = setInterval(() =>
                        {
                            if (i < data.length)
                            {
                                result.innerHTML += data[i];
                                i++;
                            }else{
                                clearInterval(intervalid);
                            }
                        }, 50);
                        setTimeout(() =>
                        {
                            button.style.transform = 'translateX(-1000px)';
                            clear.style.transform = 'translateX(-1000px)';
                            back.style.transform = 'translate(-1000px, 0%)';
                        }, 100);
                    },  
                    error:
                    function(response)
                    {
                        button.innerHTML = 'Analyse';
                        result.style.color = "red";
                        let i = 0;
                        team.style.transform = 'translateX(-1000px)';
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
                        setTimeout(() =>
                        {
                            button.style.transform = 'translateX(-1000px)';
                            clear.style.transform = 'translateX(-1000px)';
                            result.style.transform = 'translate(-1000px, 0%)';
                            back.style.transform = 'translate(-1000px, 0%)';
                            circle.style.transform = 'translate(-1000px, 0%)';
                            percentage.style.transform = 'translate(-1000px, 0%)';
                        }, 100);
                    }
                });
            }, 100);
        }
    });
}
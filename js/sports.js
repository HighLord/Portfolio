window.onload = function()
{
    var team = document.getElementById('team');
    var button = document.getElementById('button');
    var clear = document.getElementById('clear');
    var back = document.getElementById('back');
    var result = document.getElementById('result');

    back.addEventListener('click', () => 
    {
        setTimeout(() =>
        {
            team.style.transform = 'translateX(0px)';
            setTimeout(() =>
            {
                button.style.transform = 'translateX(0px)';
                clear.style.transform = 'translateX(0px)';
                result.style.transform = 'translate(0px, 0%)';
                back.style.transform = 'translate(0px, 0%)';
            }, 200);
        }, 100);
    });
    clear.addEventListener('click', () =>
    {
        team.value = '';
        result.innerHTML = '';
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
                        team.style.transform = 'translateX(-800px)';
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
                        setTimeout(() =>
                        {
                            button.style.transform = 'translateX(-800px)';
                            clear.style.transform = 'translateX(-800px)';
                            result.style.transform = 'translate(-800px, 0%)';
                            back.style.transform = 'translate(-800px, 0%)';
                        }, 100);
                    },  
                    error:
                    function(response)
                    {
                        button.innerHTML = 'Analyse';
                        result.style.color = "red";
                        let i = 0;
                        team.style.transform = 'translateX(-800px)';
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
                            button.style.transform = 'translateX(-800px)';
                            clear.style.transform = 'translateX(-800px)';
                            result.style.transform = 'translate(-800px, 0%)';
                            back.style.transform = 'translate(-800px, 0%)';
                        }, 100);
                    }
                });
            }, 100);
        }
    });
}
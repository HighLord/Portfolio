window.onload = function () {

    var button = document.getElementById('button');
    var clear = document.getElementById('clear');
    const bell = document.getElementsByClassName('fa-bell')[0];
    const count = document.getElementsByClassName('count')[0];
    const notification = document.getElementsByClassName('notify-text')[0];
    const check1 = document.getElementById('alert1');

    var amount = 1;
    [bell, count, notification].forEach((element) => 
    {
        element.addEventListener('click', () => 
        {
            $(notification).toggle('500', function () 
            {
                if (amount == 1) 
                {
                    $('.notify').css('z-index', '1');
                    $('body>*:not(.notify, .fa-bell, .count)').css('filter', 'blur(5px)');
                    amount = 2;
                }
                else 
                {
                    $('.notify').css('z-index', '0');
                    $('body>*:not(.notify)').css('filter', 'blur(0px)');
                    amount = 1;
                }
            });
        });
    });

    var click = true;
    var times;
    var selectedValue2;
    clear.addEventListener('click', () => 
    {
        if (click == true)
        {
            document.getElementById('result').innerHTML = '';
        }
        if (click == false)
        {
            selectedValue2 = times + 1;
            clear.innerHTML = 'Stopping   <i class="fa fa-spinner fa-spin"></i>';
        }
    });

    button.addEventListener('click', () => 
    {
        if (click === false){return false;}
        analyse();
        click = false;
    });
    
    var premium = "normal";
    check1.addEventListener('click', () =>
    {
        if (check1.checked == true)
        {
            premium = "premium";
        }else{
            premium = "normal";
        }
    })
    
    function analyse() 
    {
        var selectElement = document.getElementById("mySelect");
        var selectElement2 = document.getElementById('mySelect2');
        var selectedValue = selectElement.value;
        selectedValue2 = selectElement2.value;
        var divResult = document.getElementById("divResult");
        button.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
        clear.innerHTML = 'Stop';
        var result = document.getElementById('result');
        times = 0;
        var scroll = true;
        var dataKing = {};
        divResult.addEventListener('scroll', () =>
        {
            scroll = false;
            if (divResult.scrollTop + divResult.clientHeight >= result.scrollHeight + 10)
            {
                scroll = true;
               
            }
        });

        $.ajax
        ({
            url: "https://github.webapps.com.ng/ajax.php",
            xhrFields: { withCredentials: false },
            crossOrigin: true,
            type: "GET",
            dataType: 'json',
            timeout: 8000,
            success: 
            function (response) 
            {
                response = Object.entries(response);               
                async function processElements()
                { 
                    let iterations = 0;
                    for(const [key, value] of response) 
                    {
                        iterations++;
                        if (times < selectedValue2)
                        {
                            if (iterations < response.length)
                            { 
                                const dataKeys = Object.keys(value);
                                const dataValues = Object.values(value);
                                const time = dataKeys[0];
                                const league = dataValues[0];
                            
                                await doSomethingWithElement(key, time, league);
                        
                                times += 1;
                            }
                            else
                            {
                                result.innerHTML += "<p id='error' style='padding: 5px; font-size: 11px;'>The amount of predictions you chose has exceeded the amount of games available today</p>";
                                if (scroll === true)
                                {
                                    divResult.scrollTop = result.scrollHeight;
                                }
                                
                                times = selectedValue2;
                            }
                        }
                        if (times == selectedValue2)
                        {
                            times += 1;
                            setTimeout(() =>
                            {
                                $.ajax
                                ({
                                    url: "https://github.webapps.com.ng/book.php",
                                    xhrFields: { withCredentials: false },
                                    crossOrigin: true,
                                    data: { "data": dataKing },
                                    type: "POST",
                                    dataType: 'json',
                                    timeout: 20000,
                                    success:
                                    function (responses) 
                                    {
                                        var message = responses.message;
                                        if (message === "Success")
                                        {
                                            var shareCode = responses.data.shareCode;
                                        
                                            var http = "https://www.sportybet.com?shareCode=" + shareCode + "&c=ng";
                                            var data = "Sportybet booking code: " + shareCode;
                                            var addon = '<a href="' + http + '" target="_blank"><button style="float:right; background-color: orange;" class="link">Play</button></a>';
                                            result.innerHTML += "<br>";
                                            result.innerHTML += addon;
                                            result.innerHTML += "<p id='success' style='padding: 5px; font-size: 10px'>" + data + "</p>";
                                            if (scroll === true)
                                            {
                                                divResult.scrollTop = result.scrollHeight;
                                            }
                                            button.innerHTML = "Search";
                                            clear.innerHTML = "Clear";
                                            click = true;
                                        }
                                        else
                                        {
                                            result.innerHTML += "<p id='error' style='padding: 5px'>Unable to get booking code</p>";
                                            if (scroll === true)
                                            {
                                                divResult.scrollTop = result.scrollHeight;
                                            }
                                            button.innerHTML = "Search";
                                            clear.innerHTML = "Clear";
                                            click = true;
                                        }
                                    },
                                    error:
                                    function()
                                    {
                                        result.innerHTML += "<p id='error' style='padding: 5px'>unable to get booking code</p>";
                                        if (scroll === true)
                                        {
                                            divResult.scrollTop = result.scrollHeight;
                                        }
                                        button.innerHTML = "Search";
                                        clear.innerHTML = "Clear";
                                        click = true;
                                        //return false;
                                    }
                                });
                            }, 100);
                        }
                    }
                }
                async function doSomethingWithElement(key, time, league)
                {
                    return new Promise((resolve) => 
                    {
                        setTimeout(() => 
                        { 
                            $.ajax
                            ({
                                url: "https://github.webapps.com.ng/sports.php",
                                xhrFields: { withCredentials: false },
                                crossOrigin: true,
                                data: { "url": key, "amount": selectedValue, "quality": premium},
                                type: "POST",
                                dataType: 'json',
                                timeout: 8000,
                                success:
                                function (response) 
                                {
                                    //var response = JSON.parse(responses);
                                    var datas = response.data;
                                    var homeT = response.home;
                                    var awayT = response.away;
                                    var outcome = response.outcome;
                                    var parsedtime = time.match(/\d{2}:\d{2} [AP]M/)[0];
                                    var data = 
                                    {
                                       "home": homeT,
                                       "away": awayT,
                                       "time": parsedtime,
                                       "outcome": outcome
                                    };
                                    dataKing["NO" + times] = data;
                    
                                    var data1 = "|" + (times + 1) + ". " + time + ".|" + "League: " + league + ".|" + datas;
                                    let i = 0;
                                    var intervalId = setInterval(() => 
                                    {                                                                               
                                        if (i < data1.length) 
                                        {
                                            result.innerHTML += data1[i]; 
                                            var replaced = result.innerHTML.replace(/\|/g, "<br>");
                                            if (replaced !== result.innerHTML)
                                            {
                                                result.innerHTML = replaced;
                                                if (scroll === true)
                                                {
                                                    divResult.scrollTop = result.scrollHeight;
                                                }
                                            }
                                            i++;
                                        }
                                        else
                                        {
                                            clearInterval(intervalId);
                                            var link = "https://www.livescore.in/match/" + key + "/#/h2h/overall";
                                            result.innerHTML += '<a href="' + link + '" target="_blank"><button class="link">Link</button></a>';
                                            result.innerHTML += "<p id='success'>";
                                            if (scroll == true)
                                            {
                                                divResult.scrollTop = result.scrollHeight;
                                            }
                                            resolve();
                                        }
                                    }, 10); 
                                    return false;
                                },
                                error:
                                function(response) 
                                {
                                    var datas = response.responseText;
                                   
                                    var data = "<p id='error' style='padding: 5px'>A Network Error occured while trying to get data: Retrying...</p>";
                                    if (datas !== "undefined")
                                    {
                                        data = "<p id='error' style='padding: 5px'>" + datas + "</p>";
                                    }
                                    result.innerHTML += data;
                                    if (scroll == true)
                                    {
                                        divResult.scrollTop = result.scrollHeight;
                                    }
                                    times -= 1;
                                    resolve();
                                }
                            });
                        }, 100);
                    });
                }
                processElements();
            },
            error:
            function() 
            {
                var data = "A Network Error occured while trying to get data. Connection terminated. please reload the page";
                let i = 0; 
                data = "|" + data;
                var intervalId = setInterval(() => 
                {                                                                               
                    if (i < data.length) 
                    {
                        result.innerHTML += data[i]; 
                        var replaced = result.innerHTML.replace(/\|/g, "<br>");
                        if (replaced !== result.innerHTML)
                        {
                            result.innerHTML = replaced;
                            if (scroll == true)
                            {
                                divResult.scrollTop = result.scrollHeight;
                            }
                        }
                    }
                    else
                    {
                        clearInterval(intervalId);
                        button.innerHTML = "Search";
                        clear.innerHTML = "Clear";
                        result.innerHTML += "<p id='error'>";
                        if (scroll == true)
                        {
                            divResult.scrollTop = result.scrollHeight;
                        }
                        click = true;
                    }
                }, 20); 
            }
        });
    }
};


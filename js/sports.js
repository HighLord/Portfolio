f (window.onload)
{
    myFunction();
}else{
    $(document).ready(myFunction);
}

function myFunction()
{
    const check1 = document.getElementById('alert1');
    const header1 = document.getElementsByTagName('h3')[0];
    header1.innerHTML += " V1";
    check1.addEventListener('click', (event) =>
    {
        if (event.target.checked)
        {
            document.cookie = "load=" + encodeURIComponent("../js/sportsV2.js?v=" + random_num) + "; expires=" + new Date(Date.now() + 3600000).toUTCString() + "; path=/; domain=github.webapps.com.ng";
        } else
        {
            document.cookie = "load=" + encodeURIComponent("../js/sports.js?v=" + random_num) + "; expires=" + new Date(Date.now() + 3600000).toUTCString() + "; path=/; domain=github.webapps.com.ng";
        }
        setTimeout(() => 
        {
            window.location.href = '../project/sports.html';
        }, 100);
    });
    
    var button = document.getElementById('button');
    var clear = document.getElementById('clear');
    const bell = document.getElementsByClassName('fa-bell')[0];
    const count = document.getElementsByClassName('count')[0];
    const notification = document.getElementsByClassName('notify-text')[0];
    const save = document.getElementsByClassName('save')[0];
    const selOdds = document.getElementById('mySelect5');
    
    for (var o = 1; o <= 4.1; o += 0.1) 
    {
        const option = document.createElement('option');
        option.value = o.toFixed(1); // Round to one decimal place
        option.text = '< ' + o.toFixed(1) + ' Odds';
        selOdds.appendChild(option);
    }

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
    var stop = false;
    var saved = '';
    
    function makeAjaxRequest() 
    {
        $.ajax
        ({
            url: "https://github.webapps.com.ng/book.php?saved",
            xhrFields: { withCredentials: false },
            crossOrigin: true,
            type: "GET",
            dataType: 'text',
            timeout: 8000,
            success: 
            function(data) 
            {
                saved = data;
                document.getElementById('result').innerHTML = data;
            },
            error: 
            function(xhr, status, error) 
            {
                makeAjaxRequest();
            }
        });
    }
    
    save.addEventListener('click', () =>
    {
        if (saved === '')
        {
            makeAjaxRequest();
        }
        else
        {
            document.getElementById('result').innerHTML = saved;
        }
    })
    
    clear.addEventListener('click', () => 
    {
        if (click == true)
        {
            document.getElementById('result').innerHTML = '';
            results = "";
        }
        if (click == false)
        {
            selectedValue2 = times + 1;
            stop = true;
            clear.innerHTML = 'Stopping   <i class="fa fa-spinner fa-spin"></i>';
        }
    });

    button.addEventListener('click', () => 
    {
        if (click === false){return false;}
        analyse(false, 0);
        click = false;
        stop = false;
        clear.innerHTML = 'Stop';
    });
    
    var premium = "normal";
    check1.addEventListener('click', () =>
    {
        if (check1.checked === true)
        {
            premium = "premium";
        }else{
            premium = "normal";
        }
    });
    
    var dataKing = {};
    var selectv2 = null;
    var amounts = 0;
    var amounted = 0;
    var countTotal = 0;
    var results = '';
    var visited = [];
    var label = false;

    function updateProgressBar(value, max)
    {
        if (label === false)
        {
            document.getElementById('result').innerHTML = '<div id="status" style="width: 100%; text-align: center;"><div style="width: 100%;"><div id="progress-bar"></div></div><p id="report" style="padding: 10px;">GAMES SCANNED: '+countTotal+'<br>PREDICTING '+amounted+' OF '+selectedValue2+' GAMES<br>NO OF GAMES BOOKED: '+amounts+'</p></div>';
            label = true;
        }
        const progressBar = document.getElementById('progress-bar');
        const report = document.getElementById('report');
        const percentage = (value / max) * 100;
        setTimeout(() =>
        {
            progressBar.style.width = `${percentage}%`;
            report.innerHTML = 'GAMES SCANNED: '+countTotal+'<br>PREDICTING '+amounted+' OF '+selectedValue2+' GAMES<br>NO OF GAMES BOOKED: '+amounts+'';
        }, 10);
    }
    var ok = 0;

    function analyse(selEle, timer) 
    {
        var selectElement = document.getElementById("mySelect");
        var selectElement2 = document.getElementById('mySelect2');
        var selectElement3 = document.getElementById('mySelect3');
        var selectElement4 = document.getElementById('mySelect4');
        var selectedValue = selectElement.value;
        selectedValue2 = selectElement2.value;
        if (selEle !== false){selectedValue2 = selEle;}
        var selectedValue3 = selectElement3.value;
        var selectedValue4 = selectElement4.value;
        button.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
        var result = document.getElementById('result');
        times = timer;
        var book = false;
        var bypass = false;
        updateProgressBar(amounted, selectedValue2);
        var t = 0;
        ajax();

        function ajax()
        {
            $.ajax
            ({
                url: "https://github.webapps.com.ng/ajax.php?game=" + selectedValue4 + "&date=" + selectedValue3,
                xhrFields: { withCredentials: false },
                crossOrigin: true,
                type: "GET",
                dataType: 'json',
                timeout: 18000,
                success: 
                function (response) 
                {
                    response = Object.entries(response);               
                    async function processElements()
                    { 
                        let iterations = 0;
                        function oks()
                        {
                            result.innerHTML += "<p id='error' style='padding: 5px; font-size: 11px;'>The amount of predictions you chose has exceeded the amount of games available today</p>";
                            times = selectedValue2;
                            book = true;
                            amounted = times;
                            updateProgressBar(amounted, selectedValue2);
                        }
                        for(const [key, value] of response) 
                        {
                            if (times < selectedValue2)
                            {
                                iterations++;
                                if (response.length > iterations)
                                {
                                    const dataKeys = Object.keys(value);
                                    const dataValues = Object.values(value);
                                    const time = dataKeys[0];
                                    const league = dataValues[0];
                                    if (ok > countTotal){bypass = true; oks();}
                                    if (visited.includes(key)){ok++; continue;}else{visited.push(key);}
                                    ok = 0;
                                    countTotal += 1;
                                    updateProgressBar(amounted, selectedValue2);
                                    await doSomethingWithElement(key, time, league);
                                    times += 1;
                                    if (selectedValue2 > response.length) { selectedValue2 = response.length; }
                                    if (times == response.length){ oks();}
                                }
                                else
                                {
                                    oks();
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
                                        data: { "data": dataKing, "game": selectedValue4, "odd": selOdds.value },
                                        type: "POST",
                                        dataType: 'json',
                                        timeout: 18000,
                                        success:
                                        function (responses) 
                                        {
                                            var message = responses.message;
                                            var innerMsg = responses.innerMsg;
                                            if (message == "Success" || innerMsg == "Invalid")
                                            {
                                                var odds = responses.odds;
                                                var total = responses.count;
                                                var gamesBooked = responses.gamesBooked;
                                                //var gamesNotBooked = responses.gamesNotBooked;
                                                var singleOdds = responses.singleOdd;
                                                var debug = responses.debug;
                                                amounts = total;
                                                
                                                Object.keys(dataKing).forEach(function(key) 
                                                {
                                                    if (!debug.includes(dataKing[key].key)) 
                                                    {
                                                        delete dataKing[key];
                                                    }
                                                });
    
                                                if (total < selectedValue2 && selectv2 === null && book === false && bypass === false && stop === false)
                                                {
                                                    selectedValue2 = parseFloat(selectedValue2);
                                                    var remainder = selectedValue2 - total;
                                                    remainder = selectedValue2 + remainder;
                                                    selectv2 = selectedValue2;
                                                    analyse(remainder, selectedValue2);
                                                    return false;
                                                }
                                                else if (total < selectv2 && book === false && bypass === false && stop === false)
                                                {
                                                    selectedValue2 = parseFloat(selectedValue2);
                                                    var remainder = selectv2 - total;
                                                    remainder = selectedValue2 + remainder;
                                                    analyse(remainder, selectedValue2);
                                                    return false;
                                                }
                                                else if (responses.count == 0 && bypass === false)
                                                {
                                                    results += "<p id='error' style='padding: 5px'>Unable to get booking code</p>";
                                                    book = true;
                                                    Object.keys(dataKing).forEach(function(key) 
                                                    {
                                                        delete dataKing[key];
                                                    });
                                                    visited.splice(0, visited.length);
                                                    button.innerHTML = "Search";
                                                    clear.innerHTML = "Clear";
                                                    click = true;
                                                    result.innerHTML = results;
                                                    results = "";
                                                    label = false;
                                                    amounted = 0;
                                                    amounts = 0; 
                                                    countTotal = 0;
                                                    return false;
                                                }
                                               
                                                updateProgressBar(amounted, selectedValue2);
                                                selectv2 = null;
                                                var shareCode = null;
                                                if (responses.data.shareCode !== undefined)
                                                {
                                                    shareCode = responses.data.shareCode;
                                                }
                                                var http = "https://www.sportybet.com?shareCode=" + shareCode + "&c=ng";
                                                var addon = '<a href="' + http + '" target="_blank"><button style="float:right; background-color: orange;" class="link">Play</button></a>';
                                                var data = "Sportybet booking code: " + shareCode + "<br>Amount of games booked: " + total + "<br>Total odds: " + odds + addon;
                                                results += "<p id='success' style='padding: 5px; margin-right: 0px; font-size: 10px'>" + data + "</p>";
                                                var container = document.createElement('div');
                                                var store = document.createElement('div');
                                                container.innerHTML = results;
    
                                                var num = 1;
          
                                                Array.from(container.children).forEach(element => 
                                                {
                                                    var elementID = element.id;
                                                    
                                                    for (const key in gamesBooked) 
                                                    {
                                                        if (gamesBooked.hasOwnProperty(key) && gamesBooked[key] == elementID) 
                                                        {
                                                            // key is the odds, gamesBooked[key] is the value (e.g., "2")
                                                            
                                                            element.style.display = "block";
                                                            element.innerHTML = "<br>" + num + ". Odd: " + key + "<br>" + element.innerHTML;
                                                            num++;
                                                            break; // Assuming each elementID is unique in gamesBooked, so we can exit the loop
                                                        }
                                                    }
                                                });
    
                                                Array.from(store.children).forEach(element => 
                                                {                             
                                                    element.style.display = "block";                                             
                                                });
    
                                                Object.keys(dataKing).forEach(function(key) 
                                                {
                                                    delete dataKing[key];
                                                });
                                                visited.splice(0, visited.length);
                                                                                          
                                                setTimeout(() =>
                                                {
                                                    result.innerHTML = container.innerHTML; 
                                                   
                                                    results = "";
                                                    $.ajax
                                                    ({
                                                        url: "https://github.webapps.com.ng/book.php",
                                                        xhrFields: { withCredentials: false },
                                                        crossOrigin: true,
                                                        data: { "save": result.innerHTML },
                                                        type: "POST",
                                                        dataType: 'json',
                                                        timeout: 18000
                                                    }) 
                                                    saved = result.innerHTML;
                                                    button.innerHTML = "Search";
                                                    clear.innerHTML = "Clear";
                                                    click = true;   
                                                    amounted = 0;
                                                    amounts = 0; 
                                                    countTotal = 0;
                                                },3000);
                                                label = false;
                                            }
                                            else
                                            {
                                                results += "<p id='error' style='padding: 5px'>Unable to get booking code</p>";
                                                book = true;
                                                Object.keys(dataKing).forEach(function(key) 
                                                {
                                                    delete dataKing[key];
                                                });
                                                visited.splice(0, visited.length);
                                                button.innerHTML = "Search";
                                                clear.innerHTML = "Clear";
                                                click = true;
                                                result.innerHTML = results;
                                                results = "";
                                                label = false;
                                                amounted = 0;
                                                amounts = 0; 
                                                countTotal = 0;
                                            }
                                        },
                                        error:
                                        function()
                                        {
                                            results += "<p id='error' style='padding: 5px'>unable to get booking code</p>";
                                            button.innerHTML = "Search";
                                            clear.innerHTML = "Clear";
                                            click = true;
                                            Object.keys(dataKing).forEach(function(key) 
                                            {
                                                delete dataKing[key];
                                            });
                                            visited.splice(0, visited.length);
                                            result.innerHTML = results;
                                            results = "";
                                            book = true;
                                            label = false;
                                            amounted = 0;
                                            amounts = 0;
                                            countTotal = 0; 
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
                                    data: { "url": key, "amount": selectedValue, "quality": premium, "game": selectedValue4},
                                    type: "POST",
                                    dataType: 'json',
                                    timeout: 8000,
                                    success:
                                    function (response, status) 
                                    {
                                        if (status !== 'parsererror')
                                        {
                                            var datas = response.data;
                                            var homeT = response.home;
                                            var awayT = response.away;
                                            var outcome = response.outcome;
                                            var keyed = response.key;
                                            var parsedtime = time.match(/\d{2}:\d{2} [AP]M/)[0];
                                            var data = 
                                            {
                                               "key": keyed,
                                               "home": homeT,
                                               "away": awayT,
                                               "time": parsedtime,
                                               "outcome": outcome,
                                               "gameNo": (times + 1)
                                            };
                                            dataKing["NO" + times] = data;
                                            amounted++;                                   
                                            var data1 = time + ".|" + "League: " + league + ".|" + datas;
                                            data1 = data1.replace(/\|/g, "<br>");
                                            results += '<div id="'+ (times + 1) +'" style="display: none;">' + data1;
    
                                            var link = "https://www.livescore.in/match/" + key + "/#/h2h/overall";
                                            results += '<a href="' + link + '" target="_blank"><button class="link">Link</button></a>';
                                            results += "<p id='success'></p></div>";
                                            updateProgressBar(amounted, selectedValue2);
                                       }
                                        resolve();               
                                        return false;
                                    },
                                    error:
                                    function(response, status) 
                                    {                  
                                        if (status !== 'parsererror')
                                        {
                                            var data = "<p id='error' style='padding: 5px'>A Network Error occured while trying to get data: Retrying...</p>";         
                                            result.innerHTML += data;                                                   
                                        }
                                        if (stop == false)
                                        {
                                            times -= 1;
                                        }
                                        resolve();
                                    }
                                });
                            }, 100);
                        });
                    }
                    processElements();
                },
                error:
                function(response, status) 
                {
                    if (t < 3)
                    {
                        t++;
                        ajax();
                    }
                    else
                    {
                        var data = response.responseText;
                        if (!data)
                        {
                            data = "<p id='error' style='padding: 5px'>A Network Error occured while trying to get data. Connection terminated. please reload the page</p>";
                        }else
                        {
                            data = "<p id='error' style='padding: 5px'>"+data+"</p>";
                        }
                        button.innerHTML = "Search";
                        clear.innerHTML = "Clear";
                        results += data;
                        result.innerHTML += data;
                        results = "";
                        click = true;
                        label = false;
                    }
                }
            });
        }
    }
}; 

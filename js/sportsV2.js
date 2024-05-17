if (window.onload)
{
    myFunction();
} else
{
    $(document).ready(myFunction);
}

function myFunction ()
{
    const selOdds = document.getElementById('mySelect5');
    for (var o = 1; o <= 4.1; o += 0.1)
    {
        const option = document.createElement('option');
        option.value = o.toFixed(1); // Round to one decimal place
        option.text = 'Less than ' + o.toFixed(1) + ' Odds';
        selOdds.appendChild(option);
    }

    const bell = document.getElementsByClassName('fa-bell')[0];
    const count = document.getElementsByClassName('count')[0];
    const notification = document.getElementsByClassName('notify-text')[0];
    let amount = 1;
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

    const result = document.getElementById('result');
    const save = document.getElementsByClassName('save')[0];
    save.addEventListener('click', () =>
    {
        let savedData = localStorage.getItem('savedData');
        result.innerHTML = savedData !== null ? savedData : "No saved data available";
    })

    var click = true;
    var amountOfBooking;
    var stop = false;
    var times;
    const clear = document.getElementById('clear');
    clear.addEventListener('click', () =>
    {
        if (click === true)
        {
            result.innerHTML = '';
            results = "";
        }
        if (click === false)
        {
            amountOfBooking = times + 1;
            stop = true;
            clear.innerHTML = 'Stopping   <i class="fa fa-spinner fa-spin"></i>';
        }
    });

    const button = document.getElementById('button');
    button.addEventListener('click', () =>
    {
        if (click === false) { return false; }
        analyse(false, 0);
        click = false;
        stop = false;
        clear.innerHTML = 'Stop';
    });

    var dataKing = {};
    var selectv2 = null;
    var amounts = 0;
    var amounted = 0;
    var countTotal = 0;
    var results = '';
    var visited = [];
    var label = false;

    function updateProgressBar (value, max)
    {
        if (label === false)
        {
            document.getElementById('result').innerHTML = '<div id="status" style="width: 100%; text-align: center;"><div style="width: 100%;"><div id="progress-bar"></div></div><p id="report" style="padding: 10px;">GAMES SCANNED: ' + countTotal + '<br>PREDICTING ' + amounted + ' OF ' + amountOfBooking + ' GAMES<br>NO OF GAMES BOOKED: ' + amounts + '</p></div>';
            label = true;
        }
        const progressBar = document.getElementById('progress-bar');
        const report = document.getElementById('report');
        const percentage = (value / max) * 100;
        setTimeout(() =>
        {
            progressBar.style.width = `${percentage}%`;
            report.innerHTML = 'GAMES SCANNED: ' + countTotal + '<br>PREDICTING ' + amounted + ' OF ' + amountOfBooking + ' GAMES<br>NO OF GAMES BOOKED: ' + amounts + '';
        }, 10);
    }
    var ok = 0;

    const selectElement = document.getElementById("mySelect");
    const selectElement2 = document.getElementById('mySelect2');
    const selectElement3 = document.getElementById('mySelect3');
    const selectElement4 = document.getElementById('mySelect4');
    function analyse (selEle, timer)
    {
        var gameMode = selectElement.value;
        amountOfBooking = selectElement2.value;
        if (selEle !== false) { amountOfBooking = selEle; }
        var gameTime = selectElement3.value;
        var gameType = selectElement4.value;
        button.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
        times = timer;
        var book = false;
        var bypass = false;
        updateProgressBar(amounted, amountOfBooking);

        async function ajax ()
        {
            var response = await getGames(gameType, gameTime);
            response = Object.entries(JSON.parse(response));

            async function processElements ()
            {
                let iterations = 0;
                function oks ()
                {
                    result.innerHTML += "<p id='error' style='padding: 5px; font-size: 11px;'>The amount of predictions you chose has exceeded the amount of games available today</p>";
                    times = amountOfBooking;
                    book = true;
                    amounted = times;
                    updateProgressBar(amounted, amountOfBooking);
                }
                for (const [key, value] of response)
                {
                    if (times < amountOfBooking)
                    {
                        iterations++
                        if (response.length >= iterations)
                        {
                            const dataKeys = Object.keys(value);
                            const dataValues = Object.values(value);
                            const time = dataKeys[0];
                            const league = dataValues[0];
                            if (ok > countTotal) { bypass = true; oks(); }
                            if (visited.includes(key)) { ok++; continue; } else { visited.push(key); }
                            ok = 0;
                            countTotal += 1;
                            updateProgressBar(amounted, amountOfBooking);
                            await doSomethingWithElement(key, time, league);
                            times += 1;
                            if (amountOfBooking > response.length) { amountOfBooking = response.length; }
                            if (times == response.length)
                            {
                                oks();
                            }
                        }
                        else
                        {
                            oks();
                            break;
                        }
                    }
                    if (times == amountOfBooking)
                    {
                        times += 1;
                        updateProgressBar(amounted, amountOfBooking);
                        setTimeout(() =>
                        {
                            $.ajax
                                ({
                                    url: "https://webappsng.vercel.app/api/sportbooking",
                                    xhrFields: { withCredentials: false },
                                    crossOrigin: true,
                                    data: JSON.stringify({ "data": dataKing, "game": gameType, "setOdd": selOdds.value }),
                                    type: "POST",
                                    contentType: "application/json",
                                    timeout: 18000,
                                    success:
                                        function (responses)
                                        {
                                            var message = responses.message;
                                            var innerMsg = responses.innerMsg;
                                            if (message == "Success" || innerMsg == "Invalid")
                                            {
                                                var odds = responses.totalOdds;
                                                var total = responses.count;
                                                var gamesBooked = responses.gamesBooked;
                                                var debug = responses.debug;
                                                amounts = total;

                                                const entries = Object.entries(gamesBooked);

                                                Object.keys(dataKing).forEach(function (key)
                                                {
                                                    if (!debug.includes(dataKing[key].key))
                                                    {
                                                        delete dataKing[key];
                                                    }
                                                });

                                                if (total < amountOfBooking && selectv2 === null && book === false && bypass === false && stop === false)
                                                {
                                                    amountOfBooking = parseFloat(amountOfBooking);
                                                    var remainder = amountOfBooking - total;
                                                    remainder = amountOfBooking + remainder;
                                                    selectv2 = amountOfBooking;
                                                    analyse(remainder, amountOfBooking);
                                                    return false;
                                                }
                                                else if (total < selectv2 && book === false && bypass === false && stop === false)
                                                {
                                                    amountOfBooking = parseFloat(amountOfBooking);
                                                    var remainder = selectv2 - total;
                                                    remainder = amountOfBooking + remainder;
                                                    analyse(remainder, amountOfBooking);
                                                    return false;
                                                }
                                                else if (responses.count == 0 && bypass === false)
                                                {
                                                    results += "<p id='error' style='padding: 5px'>Unable to get booking code</p>";
                                                    book = true;
                                                    Object.keys(dataKing).forEach(function (key)
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

                                                updateProgressBar(amounted, amountOfBooking);
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

                                                    for (let [key, values] of entries)
                                                    {
                                                        if (key == elementID)
                                                        {
                                                            element.style.display = "block";
                                                            element.innerHTML = "<br>" + num + ". Odd: " + values + "<br>" + element.innerHTML;
                                                            num++;
                                                        }
                                                    }
                                                });

                                                Array.from(store.children).forEach(element =>
                                                {
                                                    element.style.display = "block";
                                                });

                                                Object.keys(dataKing).forEach(function (key)
                                                {
                                                    delete dataKing[key];
                                                });
                                                visited.splice(0, visited.length);


                                                result.innerHTML = container.innerHTML;

                                                results = "";
                                                localStorage.setItem('savedData', result.innerHTML);
                                                button.innerHTML = "Search";
                                                clear.innerHTML = "Clear";
                                                click = true;
                                                amounted = 0;
                                                amounts = 0;
                                                countTotal = 0;
                                                label = false;
                                            }
                                            else
                                            {
                                                results += "<p id='error' style='padding: 5px'>Unable to get booking code</p>";
                                                book = true;
                                                Object.keys(dataKing).forEach(function (key)
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
                                        function (response)
                                        {
                                            results += "<p id='error' style='padding: 5px'>unable to get booking code</p>";
                                            button.innerHTML = "Search";
                                            clear.innerHTML = "Clear";
                                            click = true;
                                            Object.keys(dataKing).forEach(function (key)
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
            async function doSomethingWithElement (key, time, league)
            {

                let niceJson = await sortGame(key);

                let calculatedJson = await predict(niceJson, amountOfBooking, gameTime, gameType, gameMode)
                
                let predictedOutcome = outcomes(calculatedJson);
                amounted++;
                if (predictedOutcome !== null)
                {
                    return new Promise((resolve) =>
                    {
                        var homeT = niceJson["names"]["team1name"];
                        var awayT = niceJson["names"]["team2name"];
                        let outcome = null;
                        let statement = null;
                        switch (gameType)
                        {
                            case "football":
                            case "icehockey":
                            case "handball":
                                outcome = predictedOutcome ? "Home or Draw" : "Draw or Away";
                                statement = outcome === "Home or Draw" ? `${homeT} to win or draw ${awayT}` : `${awayT} to win or draw ${homeT}`;
                                break;
                            case "basketball":
                            case "tennis":
                            case "baseball":
                            case "boxing":
                            case "americanfootball":
                            case "tabletennis":
                            case "cricket":
                            case "darts":
                            case "volleyball":
                            case "badminton":
                            case "mma":
                                outcome = predictedOutcome ? "Home" : "Away";
                                statement = outcome === "Home" ? `${homeT} to win ${awayT}` : `${awayT} to win ${homeT}`;
                                break;
                            default:
                                break;
                        }
                        var parsedtime = time.match(/\d+:\d+ [AP]M/)[0];//time.match(/\d{2}:\d{2} [AP]M/)[0];
                        var data =
                        {
                            "key": key,
                            "home": homeT,
                            "away": awayT,
                            "time": parsedtime,
                            "outcome": outcome,
                            "gameNo": (times + 1)
                        };

                        dataKing["NO" + times] = data;
                        //alert(JSON.stringify(dataKing));
                        var data1 = time + ".|" + league + ".|" + statement;
                        data1 = data1.replace(/\|/g, "<br>");
                        results += '<div id="' + (times + 1) + '" style="display: none; z-index: 1;">' + data1;

                        var link = "https://www.livescore.in/match/" + key + "/#/h2h/overall";
                        results += '<a href="' + link + '" target="_blank"><button style="z-index: 9999;" class="link">Link</button></a>';
                        results += "<br><p id='success'></p></div>";
                        updateProgressBar(amounted, amountOfBooking);
                        resolve();
                        return false;
                    });
                }
            }
            processElements();
        }
        ajax();
    }

    function getGames (game, date)
    {
        return new Promise((resolve, reject) =>
        {
            const dateMapping = {
                "today": 0,
                "tomorrow": 1,
                "next-tomorrow": 2
            };

            const gameMapping = {
                "football": 1,
                "tennis": 2,
                "basketball": 3,
                "icehockey": 4,
                "americanfootball": 5,
                "baseball": 6,
                "handball": 7,
                "volleyball": 12,
                "cricket": 13,
                "darts": 14,
                "boxing": 16,
                "badminton": 21,
                "tabletennis": 25,
                "mma": 28
            };

            if (dateMapping.hasOwnProperty(date) && gameMapping.hasOwnProperty(game))
            {
                const dateIndex = dateMapping[date];
                const gameIndex = gameMapping[game];
                const url = `https://d.livescore.in/x/feed/f_${gameIndex}_${dateIndex}_1_en_4`;

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);

                fetch(url, {
                    method: 'GET',
                    headers: {
                        "x-fsign": "SW9D1eZo"
                    },
                    signal: controller.signal
                })
                    .then(response =>
                    {
                        if (!response.ok)
                        {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.text();
                    })
                    .then(matches =>
                    {
                        const lines = matches.replace(/÷/g, "<br>").split("<br>");
                        const leagues = {};
                        const currentTimestamp = Math.floor(Date.now() / 1000);
                        const currentTime = currentTimestamp;
                        let codes1;
                        let league;
                        let codes2;

                        lines.forEach((line) =>
                        {
                            const codes1Match = line.match(/(\w+)¬AD(?!\w)/);
                            if (codes1Match)
                            {
                                codes1 = codes1Match[1];
                            } else if (line.match(/^(.*?¬ZEE.*)$/))
                            {
                                league = line.replace(/¬ZEE/g, '');
                            } else
                            {
                                const timeMatch = line.match(/(\w+)¬ADE(?!\w)/);
                                if (timeMatch)
                                {
                                    codes2 = timeMatch[1];
                                    if (currentTime < codes2)
                                    {
                                        const currentDateTime = new Date(currentTimestamp * 1000);
                                        const nextDateTime = new Date(codes2 * 1000);
                                        const currentDate = currentDateTime.toISOString().split('T')[0];
                                        const nextDate = nextDateTime.toISOString().split('T')[0];

                                        let date;
                                        const options = { hour: '2-digit', minute: '2-digit' };

                                        if (currentDate !== nextDate)
                                        {
                                            date = nextDateTime.toDateString() + " : " + nextDateTime.toLocaleTimeString(undefined, options);
                                        } else
                                        {
                                            date = "Today : " + nextDateTime.toLocaleTimeString(undefined, options);
                                        }

                                        if (!leagues[codes1])
                                        {
                                            leagues[codes1] = {};
                                        }
                                        leagues[codes1][date] = league;
                                    }
                                }
                            }
                        });

                        const filteredLeagues = {};
                        for (const key in leagues)
                        {
                            if (Object.keys(leagues[key]).length > 0)
                            {
                                filteredLeagues[key] = leagues[key];
                            }
                        }

                        const shuffledLeagues = {};
                        const keys = Object.keys(filteredLeagues).sort(() => Math.random() - 0.5);
                        keys.forEach(key =>
                        {
                            shuffledLeagues[key] = filteredLeagues[key];
                        });

                        const json = JSON.stringify(shuffledLeagues);
                        if (json !== '{}')
                        {
                            /*let jsonData = {
                                "QBmdDh9C": {
                                    "Today : 03:00 PM": "EUROPE: Euro"
                                }
                            };
                            jsonData = JSON.stringify(jsonData);

                            resolve(jsonData);*/
                            resolve(json);
                        } else
                        {
                            results += "<p id='error' style='padding: 5px'>NO GAMES AVAILABLE FOR SPECIFIED DATE</p>";
                            button.innerHTML = "Search";
                            clear.innerHTML = "Clear";
                            click = true;
                            Object.keys(dataKing).forEach(function (key)
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
                            resolve("NO GAMES AVAILABLE FOR SPECIFIED DATE");
                        }
                    })
                    .catch(error =>
                    {
                        if (error.name === 'AbortError')
                        {
                            console.log('Request timed out');
                            reject(error.message);
                        } else
                        {
                            console.error('Fetch error:', error.message);
                            reject(error.message);
                        }
                    })
                    .finally(() => clearTimeout(timeoutId));
            } else
            {
                throw new Error("Invalid game or date.");
            }
        });
    }

    function sortGame (key, time)
    {
        return new Promise((resolve, reject) =>
        {
            const url = `https://d.livescore.in/x/feed/df_hh_4_${key}`;

            fetch(url,
                {
                    method: 'GET',
                    headers:
                    {
                        "x-fsign": "SW9D1eZo"
                    },
                })
                .then(response =>
                {
                    if (!response.ok)
                    {
                        return response.text().then(responseText =>
                        {
                            console.error(`HTTP error! Status: ${response.status}`);
                            reject("Response:", responseText);
                        });
                    }
                    return response.text();
                })
                .then(matches =>
                {
                    function getNames ()
                    {
                        let lines1 = matches.replace(/¬/g, '÷').split('÷');
                        let counts = 0;
                        let wordCount = [];
                        let homie, awayie;

                        lines1.forEach((line1) =>
                        {
                            if (line1.match(/^(.*?Last matches.*)$/))
                            {
                                counts += 1;
                                if (counts < 3)
                                {
                                    let namie = line1.replace(/Last matches: /, '');
                                    wordCount.push(namie);
                                }
                            }
                        });

                        homie = wordCount[0];
                        awayie = wordCount[1];

                        return teamNames = {
                            team1name: homie,
                            team2name: awayie
                        };
                    }

                    function getTeams ()
                    {
                        let lines = matches.replace(/¬/g, '÷').split('÷');
                        let count = 0;
                        let hometeams = [];
                        let awayteams = [];
                        let homescores = [];
                        let awayscores = [];
                        let gameDate = [];
                        let dateLimit = new Date('2022-01-01').getTime() / 1000;

                        lines.some((line, index) =>
                        {
                            if (count > 2) return;
                            if (line.includes('Last matches'))
                            {
                                count += 1;
                            }
                            else if (line.match(/(\d+):(\d+)/))
                            {
                                let scores = line.match(/(\d+):(\d+)/);
                                let homeScore = scores[1];
                                let awayScore = scores[2];

                                let awayTeam = lines[index - 4];
                                let homeTeam = lines[index - 10];
                                let dTime = lines[index - 26];
                                let dTime2 = lines[index - 30];

                                let time100 = (dTime.length === 10) ? dTime : ((dTime2.length === 10) ? dTime2 : null);


                                if (!homeTeam.match(/\b\w*\.png\w*\b/) || !awayTeam.match(/\b\w*\.png\w*\b/))
                                {
                                    if (time100 > dateLimit)
                                    {
                                        hometeams.push(homeTeam);
                                        awayteams.push(awayTeam);
                                        homescores.push(homeScore);
                                        awayscores.push(awayScore);
                                        gameDate.push(time100);
                                    }
                                }
                            }
                        })

                        resolve(jsons = {
                            names: getNames(),
                            hometeams: hometeams,
                            awayteams: awayteams,
                            homescores: homescores,
                            awayscores: awayscores,
                            gameDate: gameDate
                        });
                    }
                    getTeams();
                })
        });
    }

    function predict (niceJson, amountOfBooking, gameTime, gameType, gameMode)
    {
        function matchAllTeamNames ()
        {
            const team1name = niceJson["names"]["team1name"];
            const team2name = niceJson["names"]["team2name"];
            const hometeams = niceJson["hometeams"];
            const awayteams = niceJson["awayteams"];
            const homescores = niceJson["homescores"];
            const awayscores = niceJson["awayscores"];
            const gameDate = niceJson["gameDate"];

            let team1 = [];
            let team2 = [];
            let teamHeads = [];
            const maxNumber = Math.max(hometeams.length, awayteams.length);

            for (let index = 0; index < maxNumber; index++)
            {
                if (team1name == hometeams[index])
                {
                    if (awayteams[index] != team2name)
                    {
                        team1.push(
                            {
                                [hometeams[index]]: homescores[index],
                                [awayteams[index]]: awayscores[index],
                                ["date"]: gameDate[index]
                            }
                        );
                    }
                    else
                    {
                        if (teamHeads.findIndex(obj =>
                            obj[hometeams[index]] === homescores[index] &&
                            obj[awayteams[index]] === awayscores[index] &&
                            obj["date"] === gameDate[index]
                        ) === -1)
                        {
                            teamHeads.push(
                                {
                                    [hometeams[index]]: homescores[index],
                                    [awayteams[index]]: awayscores[index],
                                    ["date"]: gameDate[index]
                                }
                            );
                        }
                    }
                }
                if (team1name == awayteams[index])
                {
                    if (hometeams[index] != team2name)
                    {
                        team1.push(
                            {
                                [awayteams[index]]: awayscores[index],
                                [hometeams[index]]: homescores[index],
                                ["date"]: gameDate[index]
                            }
                        );
                    }
                    else
                    {
                        if (teamHeads.findIndex(obj =>
                            obj[hometeams[index]] === homescores[index] &&
                            obj[awayteams[index]] === awayscores[index] &&
                            obj["date"] === gameDate[index]
                        ) === -1)
                        {
                            teamHeads.push(
                                {
                                    [awayteams[index]]: awayscores[index],
                                    [hometeams[index]]: homescores[index],
                                    ["date"]: gameDate[index]
                                }
                            );
                        }
                    }
                }
                if (team2name == hometeams[index])
                {
                    if (awayteams[index] != team1name)
                    {
                        team2.push(
                            {
                                [hometeams[index]]: homescores[index],
                                [awayteams[index]]: awayscores[index],
                                ["date"]: gameDate[index]
                            }
                        );
                    }
                    else
                    {
                        if (teamHeads.findIndex(obj =>
                            obj[hometeams[index]] === homescores[index] &&
                            obj[awayteams[index]] === awayscores[index] &&
                            obj["date"] === gameDate[index]
                        ) === -1)
                        {
                            teamHeads.push(
                                {
                                    [awayteams[index]]: awayscores[index],
                                    [hometeams[index]]: homescores[index],
                                    ["date"]: gameDate[index]
                                }
                            );
                        }
                    }
                }
                if (team2name == awayteams[index])
                {
                    if (hometeams[index] != team1name)
                    {
                        team2.push(
                            {
                                [awayteams[index]]: awayscores[index],
                                [hometeams[index]]: homescores[index],
                                ["date"]: gameDate[index]
                            }
                        );
                    }
                    else
                    {
                        if (teamHeads.findIndex(obj =>
                            obj[hometeams[index]] === homescores[index] &&
                            obj[awayteams[index]] === awayscores[index] &&
                            obj["date"] === gameDate[index]
                        ) === -1)
                        {
                            teamHeads.push(
                                {
                                    [hometeams[index]]: homescores[index],
                                    [awayteams[index]]: awayscores[index],
                                    ["date"]: gameDate[index]
                                }
                            );
                        }
                    }
                }
            }

            return ({
                "team1": team1,
                "team2": team2,
                "teamHeads": teamHeads
            });
        }
        const matchJson = matchAllTeamNames();
        //console.log(matchJson);


        function getSum ()
        {
            let sum1 = 0;
            let sum2 = 0;
            let iteration1 = 0;
            let iteration2 = 0;
            const minNumber = Math.min(matchJson.team1.length, matchJson.team2.length);
            for (let i = 0; i < minNumber; i++)
            {
                if (iteration1 < gameMode)
                {
                    let firstMatch = matchJson.team1[i];
                    let homeTeam = Object.keys(firstMatch)[0];
                    let homeScore = firstMatch[homeTeam];

                    sum1 = sum1 + JSON.parse(homeScore);
                    iteration1++;
                }
            }

            for (let i = 0; i < minNumber; i++)
            {
                if (iteration2 < gameMode)
                {
                    let secondMatch = matchJson.team2[i];
                    let awayTeam = Object.keys(secondMatch)[0];
                    let awayScore = secondMatch[awayTeam];

                    sum2 = sum2 + JSON.parse(awayScore);
                    iteration2++;
                }
            }
            return {
                iteration1: iteration1,
                iteration2: iteration2,
                sum1: sum1,
                sum2: sum2
            }
        }
        const sum = getSum();

        function getScore ()
        {
            let score1 = 0;
            let score2 = 0;
            let iteration1 = 0;
            let iteration2 = 0;

            for (let i = 0; i < matchJson.team1.length; i++)
            {
                if (iteration1 < gameMode)
                {
                    let firstMatch = matchJson.team1[i];
                    let homeTeam = Object.keys(firstMatch)[0];
                    let homeScore = firstMatch[homeTeam];
                    let awayTeam = Object.keys(firstMatch)[1];
                    let awayScore = firstMatch[awayTeam];

                    if (homeScore > awayScore)
                    {
                        score1 += 1;
                    }
                    else if (homeScore == awayScore)
                    {
                        score1 += 0.5;
                    }
                    iteration1++;
                }
            }

            for (let i = 0; i < matchJson.team2.length; i++)
            {
                if (iteration2 < gameMode)
                {
                    let secondMatch = matchJson.team2[i];
                    let homeTeam = Object.keys(secondMatch)[0];
                    let homeScore = secondMatch[homeTeam];
                    let awayTeam = Object.keys(secondMatch)[1];
                    let awayScore = secondMatch[awayTeam];
                    if (homeScore > awayScore)
                    {
                        score2 += 1;
                    }
                    else if (homeScore == awayScore)
                    {
                        score2 += 0.5;
                    }
                    iteration2++;
                }
            }
            return {
                iteration1: iteration1,
                iteration2: iteration2,
                score1: score1,
                score2: score2
            }
        }
        const score = getScore();

        function h2h ()
        {
            const h2H = matchJson.teamHeads;
            let highValue = 0;

            h2H.forEach(Match =>
            {
                const homeTeam = Object.keys(Match)[0];
                const homeScore = Match[homeTeam];
                const awayTeam = Object.keys(Match)[1];
                const awayScore = Match[awayTeam];

                if (homeScore > awayScore)
                {
                    highValue += 1;
                }
                else if (awayScore > homeScore)
                {
                    highValue -= 1;
                }
            });

            return highValue;
        }
        const head2head = h2h();
        

        function calculatePercentage ()
        {
            let master = 0;
            let limit = 0;
            let checkedAlready = [];
            let minNumber = Math.min(matchJson.team1.length, matchJson.team2.length);

            outerloop: for (let i = 0; i < minNumber; i++)
            {
                if (limit > (gameMode * 2)) { break outerloop; };
                let firstMatch = matchJson.team1[i];
                let homeTeam1 = Object.keys(firstMatch)[0];
                let awayTeam1 = Object.keys(firstMatch)[1];
                let homeScore1 = firstMatch[homeTeam1];
                let awayScore1 = firstMatch[awayTeam1];

                for (let j = 0; j < minNumber; j++)
                {
                    let secondMatch = matchJson.team2[j];
                    let homeTeam2 = Object.keys(secondMatch)[0];
                    let awayTeam2 = Object.keys(secondMatch)[1];
                    let homeScore2 = secondMatch[homeTeam2];
                    let awayScore2 = secondMatch[awayTeam2];

                    if (awayTeam1 == awayTeam2)
                    {
                        if (checkedAlready.includes(awayTeam1)) { continue; } else { checkedAlready.push(awayTeam1); }
                        if (homeScore1 > awayScore1)
                        {
                            master += 1;
                            limit += 1;
                        }
                        else if (homeScore2 > awayScore2)
                        {
                            master -= 1;
                            limit += 1;
                        }
                    }
                }
            }
            return master;
        }
        const percent = calculatePercentage();

        return {
            highestGoals: sum,
            mostGamesWon: score,
            percentageOfHOHWins: percent,
            head2head: head2head
        };
    }

    function outcomes (calculatedJson)
    {
        let sum1 = calculatedJson.highestGoals.sum1 / calculatedJson.highestGoals.iteration1;
        let sum2 = calculatedJson.highestGoals.sum2 / calculatedJson.highestGoals.iteration2;

        let score1 = calculatedJson.mostGamesWon.score1 / calculatedJson.mostGamesWon.iteration1;
        let score2 = calculatedJson.mostGamesWon.score2 / calculatedJson.mostGamesWon.iteration2;

        let master = calculatedJson.percentageOfHOHWins;

        const head2head = calculatedJson.head2head;

        let myTruth = 0;

        if (sum1 > sum2) { myTruth += 1; }
        if (sum2 > sum1) { myTruth -= 1; }
        if (score1 > score2) { myTruth += 1; }
        if (score2 > score1) { myTruth -= 1; }
        if (master > 0) { myTruth += 1.5; }
        if (master < 0) { myTruth -= 1.5; }

        myTruth += head2head;
        //console.log("sum1: "+ sum1 +" and sum2: "+ sum2 +" score1: "+score1+ " and score2: "+ score2 +"  master: "+ master + " truth: "+ myTruth + " head2head: "+ head2head);
        if (myTruth > 3) { return true; }
        if (myTruth < 3) { return false; }
        return null;
    }
};

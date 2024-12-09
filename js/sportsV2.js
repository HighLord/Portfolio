if ( window.onload )
{
    myFunction();
} else
{
    $( document ).ready( myFunction );
}

function myFunction ()
{
    const selOdds = document.getElementById( 'mySelect5' );
    for ( var o = 1; o <= 4.1; o += 0.1 )
    {
        const option = document.createElement( 'option' );
        option.value = o.toFixed( 1 ); // Round to one decimal place
        option.text = 'Less than ' + o.toFixed( 1 ) + ' Odds';
        selOdds.appendChild( option );
    }

    const selType = document.getElementById( 'mySelect6' );
    function updateOptions ( selectElement )
    {
        selType.innerHTML = ''; // Clear existing options

        if ( selectElement.value == 'football' || selectElement.value == 'icehockey' || selectElement.value == 'handball' )
        {
            const option_1 = document.createElement( 'option' );
            option_1.value = 'winner';
            option_1.text = 'Winner';
            selType.appendChild( option_1 );

            const option_2 = document.createElement( 'option' );
            option_2.value = 'double_chance';
            option_2.text = 'Double Chance';
            selType.appendChild( option_2 );

            const option_3 = document.createElement( 'option' );
            option_3.value = 'draw';
            option_3.text = 'Draws';
            selType.appendChild( option_3 );
        }
        else
        {
            const option = document.createElement( 'option' );
            option.value = 'winner';
            option.text = 'Winner';
            selType.appendChild( option );
        }
    }
    document.getElementById( 'mySelect4' ).addEventListener( 'change', function ()
    {
        updateOptions( this );
    } );

    updateOptions( document.getElementById( 'mySelect4' ) );


    const bell = document.getElementsByClassName( 'fa-bell' )[0];
    const count = document.getElementsByClassName( 'count' )[0];
    const notification = document.getElementsByClassName( 'notify-text' )[0];
    let amount = 1;
    [bell, count, notification].forEach( ( element ) =>
    {
        element.addEventListener( 'click', () =>
        {
            $( notification ).toggle( '500', function ()
            {
                if ( amount == 1 )
                {
                    $( '.notify' ).css( 'z-index', '1' );
                    $( 'body>*:not(.notify, .fa-bell, .count)' ).css( 'filter', 'blur(5px)' );
                    amount = 2;
                }
                else
                {
                    $( '.notify' ).css( 'z-index', '0' );
                    $( 'body>*:not(.notify)' ).css( 'filter', 'blur(0px)' );
                    amount = 1;
                }
            } );
        } );
    } );

    const result = document.getElementById( 'result' );
    const save = document.getElementsByClassName( 'save' )[0];
    save.addEventListener( 'click', () =>
    {
        let savedData = localStorage.getItem( 'savedData' );
        result.innerHTML = savedData !== null ? savedData : "No saved data available";
    } )

    var click = true;
    var amountOfBooking;
    var stop = false;
    var times;
    const clear = document.getElementById( 'clear' );
    clear.addEventListener( 'click', () =>
    {
        if ( click === true )
        {
            result.innerHTML = '';
            results = "";
        }
        if ( click === false )
        {
            amountOfBooking = times + 1;
            stop = true;
            clear.innerHTML = 'Stopping   <i class="fa fa-spinner fa-spin"></i>';
        }
    } );

    const button = document.getElementById( 'button' );
    button.addEventListener( 'click', () =>
    {
        if ( click === false ) { return false; }
        analyse( false, 0 );
        click = false;
        stop = false;
        clear.innerHTML = 'Stop';
    } );

    var dataKing = {};
    var selectv2 = null;
    var amounts = 0;
    var amounted = 0;
    var countTotal = 0;
    var results = '';
    var visited = [];
    var label = false;

    function updateProgressBar ( value, max )
    {
        if ( label === false )
        {
            document.getElementById( 'result' ).innerHTML = '<div id="status" style="width: 100%; text-align: center;"><div style="width: 100%;"><div id="progress-bar"></div></div><p id="report" style="padding: 10px;">GAMES SCANNED: ' + countTotal + '<br>PREDICTING ' + amounted + ' OF ' + amountOfBooking + ' GAMES<br>NO OF GAMES BOOKED: ' + amounts + '</p></div>';
            label = true;
        }
        const progressBar = document.getElementById( 'progress-bar' );
        const report = document.getElementById( 'report' );
        const percentage = ( value / max ) * 100;
        setTimeout( () =>
        {
            progressBar.style.width = `${percentage}%`;
            report.innerHTML = 'GAMES SCANNED: ' + countTotal + '<br>PREDICTING ' + amounted + ' OF ' + amountOfBooking + ' GAMES<br>NO OF GAMES BOOKED: ' + amounts + '';
        }, 10 );
    }
    var ok = 0;

    const selectElement = document.getElementById( "mySelect" );
    const selectElement2 = document.getElementById( 'mySelect2' );
    const selectElement3 = document.getElementById( 'mySelect3' );
    const selectElement4 = document.getElementById( 'mySelect4' );
    function analyse ( selEle, timer )
    {
        var gameMode = selectElement.value;
        amountOfBooking = selectElement2.value;
        if ( selEle !== false ) { amountOfBooking = selEle; }
        var gameTime = selectElement3.value;
        var gameType = selectElement4.value;
        button.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
        times = timer;
        var book = false;
        var bypass = false;
        updateProgressBar( amounted, amountOfBooking );
        var amountOfBooking2;

        async function ajax ()
        {
            var response = await getGames( gameType, gameTime );
            response = Object.entries( JSON.parse( response ) );

            async function processElements ()
            {
                let iterations = 0;
                function oks ()
                {
                    result.innerHTML += "<p id='error' style='padding: 5px; font-size: 11px;'>The amount of predictions you chose has exceeded the amount of games available today</p>";
                    times = amountOfBooking;
                    book = true;
                    amounted = times;
                    updateProgressBar( amounted, amountOfBooking );
                }
                for ( const [key, value] of response )
                {
                    if ( times < amountOfBooking )
                    {
                        iterations++
                        if ( response.length >= iterations )
                        {
                            const dataKeys = Object.keys( value );
                            const dataValues = Object.values( value );
                            const time = dataKeys[0];
                            const league = dataValues[0];
                            if ( ok > countTotal ) { bypass = true; oks(); }
                            if ( visited.includes( key ) ) { ok++; continue; } else { visited.push( key ); }
                            ok = 0;
                            countTotal += 1;
                            updateProgressBar( amounted, amountOfBooking );
                            await doSomethingWithElement( key, time, league );
                            times += 1;
                            if ( amountOfBooking > response.length ) { amountOfBooking2 = amountOfBooking; amountOfBooking = response.length; }
                            if ( times == response.length )
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
                    if ( times == amountOfBooking )
                    {
                        times += 1;
                        updateProgressBar( amounted, amountOfBooking );
                        setTimeout( () =>
                        {
                            $.ajax
                                ( {
                                    url: "https://webappsng.vercel.app/api/sportbooking",
                                    xhrFields: { withCredentials: false },
                                    crossOrigin: true,
                                    data: JSON.stringify( { "data": dataKing, "game": gameType, "setOdd": selOdds.value } ),
                                    type: "POST",
                                    contentType: "application/json",
                                    timeout: 18000,
                                    success:
                                        function ( responses )
                                        {
                                            var message = responses.message;
                                            var innerMsg = responses.innerMsg;
                                            if ( message == "Success" || innerMsg == "Invalid" || ( innerMsg == "selections can not be null or empty" && amountOfBooking2 != amountOfBooking ) )
                                            {
                                                var odds = responses.totalOdds;
                                                var total = responses.count;
                                                var gamesBooked = responses.gamesBooked;
                                                var debug = responses.debug;
                                                amounts = total;

                                                const entries = Object.entries( gamesBooked );

                                                Object.keys( dataKing ).forEach( function ( key )
                                                {
                                                    if ( !debug.includes( dataKing[key].key ) )
                                                    {
                                                        delete dataKing[key];
                                                    }
                                                } );

                                                if ( total < amountOfBooking && selectv2 === null && book === false && bypass === false && stop === false )
                                                {
                                                    amountOfBooking = parseFloat( amountOfBooking );
                                                    var remainder = amountOfBooking - total;
                                                    remainder = amountOfBooking + remainder;
                                                    selectv2 = amountOfBooking;
                                                    analyse( remainder, amountOfBooking );
                                                    return false;
                                                }
                                                else if ( total < selectv2 && book === false && bypass === false && stop === false )
                                                {
                                                    amountOfBooking = parseFloat( amountOfBooking );
                                                    var remainder = selectv2 - total;
                                                    remainder = amountOfBooking + remainder;
                                                    analyse( remainder, amountOfBooking );
                                                    return false;
                                                }
                                                else if ( responses.count == 0 && bypass === false )
                                                {
                                                    results += "<p id='error' style='padding: 5px'>Unable to get booking code</p>";
                                                    book = true;
                                                    Object.keys( dataKing ).forEach( function ( key )
                                                    {
                                                        delete dataKing[key];
                                                    } );
                                                    visited.splice( 0, visited.length );
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

                                                updateProgressBar( amounted, amountOfBooking );
                                                selectv2 = null;
                                                var shareCode = null;
                                                if ( responses.data.shareCode !== undefined )
                                                {
                                                    shareCode = responses.data.shareCode;
                                                }
                                                var http = "https://www.sportybet.com?shareCode=" + shareCode + "&c=ng";
                                                var addon = '<a href="' + http + '" target="_blank"><button style="float:right; background-color: orange;" class="link">Play</button></a>';
                                                var data = "Sportybet booking code: " + shareCode + "<br>Amount of games booked: " + total + "<br>Total odds: " + odds + addon;
                                                results += "<p id='success' style='padding: 5px; margin-right: 0px; font-size: 10px'>" + data + "</p>";
                                                var container = document.createElement( 'div' );
                                                var store = document.createElement( 'div' );
                                                container.innerHTML = results;

                                                var num = 1;

                                                Array.from( container.children ).forEach( element =>
                                                {
                                                    var elementID = element.id;

                                                    for ( let [key, values] of entries )
                                                    {
                                                        if ( key == elementID )
                                                        {
                                                            element.style.display = "block";
                                                            element.innerHTML = "<br>" + num + ". Odd: " + values + "<br>" + element.innerHTML;
                                                            num++;
                                                        }
                                                    }
                                                } );

                                                Array.from( store.children ).forEach( element =>
                                                {
                                                    element.style.display = "block";
                                                } );

                                                Object.keys( dataKing ).forEach( function ( key )
                                                {
                                                    delete dataKing[key];
                                                } );
                                                visited.splice( 0, visited.length );


                                                result.innerHTML = container.innerHTML;

                                                results = "";
                                                localStorage.setItem( 'savedData', result.innerHTML );
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
                                                Object.keys( dataKing ).forEach( function ( key )
                                                {
                                                    delete dataKing[key];
                                                } );
                                                visited.splice( 0, visited.length );
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
                                        function ( response )
                                        {
                                            results += "<p id='error' style='padding: 5px'>unable to get booking code</p>";
                                            button.innerHTML = "Search";
                                            clear.innerHTML = "Clear";
                                            click = true;
                                            Object.keys( dataKing ).forEach( function ( key )
                                            {
                                                delete dataKing[key];
                                            } );
                                            visited.splice( 0, visited.length );
                                            result.innerHTML = results;
                                            results = "";
                                            book = true;
                                            label = false;
                                            amounted = 0;
                                            amounts = 0;
                                            countTotal = 0;
                                        }
                                } );
                        }, 1 );
                    }
                }
            }
            async function doSomethingWithElement ( key, time, league )
            {

                let niceJson = await sortGame( key );

                let calculatedJson = await predict( niceJson, amountOfBooking, gameTime, gameType, gameMode )

                let predictedOutcome = await outcomes( calculatedJson, niceJson);
                amounted++;
                if ( predictedOutcome.result !== null )
                {                   
                    return new Promise( ( resolve ) =>
                    {
                        var homeT = niceJson["names"]["team1name"];
                        var awayT = niceJson["names"]["team2name"];
                        let outcome = null;
                        let statement = null;
                        switch ( gameType )
                        {
                            case "football":
                            case "icehockey":
                            case "handball":
                                if ( selType.value === "draw" )
                                {
                                    outcome = "Draw";
                                    statement = `${homeT} to draw ${awayT}`;
                                    break;
                                }
                                else if ( selType.value === "winner" )
                                {
                                    outcome = predictedOutcome.result ? "Home" : "Away";
                                    statement = outcome === "Home" ? `${homeT} to win ${awayT}` : `${awayT} to win ${homeT}`;
                                    break;
                                }
                                else if ( selType.value === "double_chance" )
                                {
                                    outcome = predictedOutcome.result ? "Home or Draw" : "Draw or Away";
                                    statement = outcome === "Home or Draw" ? `${homeT} to win or draw ${awayT}` : `${awayT} to win or draw ${homeT}`;
                                }
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
                                outcome = predictedOutcome.result ? "Home" : "Away";
                                statement = outcome === "Home" ? `${homeT} to win ${awayT}` : `${awayT} to win ${homeT}`;
                                break;
                            default:
                                break;
                        }
                        var parsedtime = time.match( /\d+:\d+ [AP]M/ )[0];//time.match(/\d{2}:\d{2} [AP]M/)[0];
                        var data =
                        {
                            "key": key,
                            "home": homeT,
                            "away": awayT,
                            "time": parsedtime,
                            "outcome": outcome,
                            "gameNo": ( times + 1 )
                        };
                        
                        dataKing["NO" + times] = data;

                        var data1 = time + ".|" + league + ".|" + statement;
                        data1 = data1.replace( /\|/g, "<br>" );
                        results += '<div class="hover" id="' + ( times + 1 ) + '" style="display: none; z-index: 1;">' + data1;

                        const link = "https://www.livescore.in/match/" + key + "/#/h2h/overall";
                        results += '<a href="' + link + '" target="_blank"><button style="z-index: 9999;" class="link">Link</button></a>';
                        results += `
                            <table class="popup" style="width:100%; border-collapse: collapse; font-size: 8px; text-align: left;">
                            <thead>
                                <tr>
                                    <th style="width:30%; border: 1px solid white;">TEAMS</th>
                                    <th style="width:35%; border: 1px solid white;">${predictedOutcome.team1}</th>
                                    <th style="width:35%; border: 1px solid white;">${predictedOutcome.team2}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th style="width:30%; border: 1px solid white;">SCORE</th>
                                    <td style="width:35%; border: 1px solid white;">${predictedOutcome.score1}</td>
                                    <td style="width:35%; border: 1px solid white;">${predictedOutcome.score2}</td>
                                </tr>
                                <tr>
                                    <th style="width:30%; border: 1px solid white;">SUM</th>
                                    <td style="width:35%; border: 1px solid white;">${predictedOutcome.sum1}</td>
                                    <td style="width:35%; border: 1px solid white;">${predictedOutcome.sum2}</td>
                                </tr>
                                <tr>
                                    <th style="width:30%; border: 1px solid white;">OUTCOME</th>
                                    <td style="width:35%; border: 1px solid white;">Head2head: ${predictedOutcome.head2head}</td>
                                    <td style="width:35%; border: 1px solid white;">Master: ${predictedOutcome.master}</td>
                                </tr>
                                <tr>
                                    <th style="width:30%; border: 1px solid white;">${predictedOutcome.result}</th>
                                    <td style="width:35%; border: 1px solid white;">${predictedOutcome.home}</td>
                                    <td style="width:35%; border: 1px solid white;">${predictedOutcome.away}</td>
                                </tr>
                            </tbody>
                        </table>`;
                        results += "<br><p id='success'></p></div>";
                        
                        updateProgressBar( amounted, amountOfBooking );
                        resolve();
                        return false;
                    } );
                }
            }
            processElements();
        }
        ajax();
    }

    function getGames ( game, date )
    {
        return new Promise( ( resolve, reject ) =>
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
                "darts": 14,
                "boxing": 16,
                "badminton": 21,
                "tabletennis": 25,
                "mma": 28
            };

            if ( dateMapping.hasOwnProperty( date ) && gameMapping.hasOwnProperty( game ) )
            {
                const dateIndex = dateMapping[date];
                const gameIndex = gameMapping[game];
                const url = `https://d.livescore.in/x/feed/f_${gameIndex}_${dateIndex}_1_en_4`;

                const controller = new AbortController();
                const timeoutId = setTimeout( () => controller.abort(), 15000 );

                fetch( url, {
                    method: 'GET',
                    headers: {
                        "x-fsign": "SW9D1eZo"
                    },
                    signal: controller.signal
                } )
                    .then( response =>
                    {
                        if ( !response.ok )
                        {
                            throw new Error( `HTTP error! Status: ${response.status}` );
                        }
                        return response.text();
                    } )
                    .then( matches =>
                    {
                        const lines = matches.replace( /÷/g, "<br>" ).split( "<br>" );
                        const leagues = {};
                        const currentTimestamp = Math.floor( Date.now() / 1000 );
                        const currentTime = currentTimestamp;
                        let codes1;
                        let league;
                        let codes2;

                        lines.forEach( ( line ) =>
                        {
                            const codes1Match = line.match( /(\w+)¬AD(?!\w)/ );
                            if ( codes1Match )
                            {
                                codes1 = codes1Match[1];
                            } else if ( line.match( /^(.*?¬ZEE.*)$/ ) )
                            {
                                league = line.replace( /¬ZEE/g, '' );
                            } else
                            {
                                const timeMatch = line.match( /(\w+)¬ADE(?!\w)/ );
                                if ( timeMatch )
                                {
                                    codes2 = timeMatch[1];
                                    if ( currentTime < codes2 )
                                    {
                                        const currentDateTime = new Date( currentTimestamp * 1000 );
                                        const nextDateTime = new Date( codes2 * 1000 );
                                        const currentDate = currentDateTime.toISOString().split( 'T' )[0];
                                        const nextDate = nextDateTime.toISOString().split( 'T' )[0];

                                        let date;
                                        const options = { hour: '2-digit', minute: '2-digit' };

                                        if ( currentDate !== nextDate )
                                        {
                                            date = nextDateTime.toDateString() + " : " + nextDateTime.toLocaleTimeString( undefined, options );
                                        } else
                                        {
                                            date = "Today : " + nextDateTime.toLocaleTimeString( undefined, options );
                                        }

                                        if ( !leagues[codes1] )
                                        {
                                            leagues[codes1] = {};
                                        }
                                        leagues[codes1][date] = league;
                                    }
                                }
                            }
                        } );

                        const filteredLeagues = {};
                        for ( const key in leagues )
                        {
                            if ( Object.keys( leagues[key] ).length > 0 )
                            {
                                filteredLeagues[key] = leagues[key];
                            }
                        }

                        const shuffledLeagues = {};
                        const keys = Object.keys( filteredLeagues ).sort( () => Math.random() - 0.5 );
                        keys.forEach( key =>
                        {
                            shuffledLeagues[key] = filteredLeagues[key];
                        } );

                        const json = JSON.stringify( shuffledLeagues );
                        if ( json !== '{}' )
                        {
                            /*let jsonData = {
                                "QBmdDh9C": {
                                    "Today : 03:00 PM": "EUROPE: Euro"
                                }
                            };
                            jsonData = JSON.stringify(jsonData);

                            resolve(jsonData);*/
                            resolve( json );
                        } else
                        {
                            results += "<p id='error' style='padding: 5px'>NO GAMES AVAILABLE FOR SPECIFIED DATE</p>";
                            button.innerHTML = "Search";
                            clear.innerHTML = "Clear";
                            click = true;
                            Object.keys( dataKing ).forEach( function ( key )
                            {
                                delete dataKing[key];
                            } );
                            visited.splice( 0, visited.length );
                            result.innerHTML = results;
                            results = "";
                            book = true;
                            label = false;
                            amounted = 0;
                            amounts = 0;
                            countTotal = 0;
                            resolve( "NO GAMES AVAILABLE FOR SPECIFIED DATE" );
                        }
                    } )
                    .catch( error =>
                    {

                        console.error( 'Fetch error:', error.message );
                        results += "<p id='error' style='padding: 5px'>" + error.message + "</p>";
                        button.innerHTML = "Search";
                        clear.innerHTML = "Clear";
                        click = true;
                        Object.keys( dataKing ).forEach( function ( key )
                        {
                            delete dataKing[key];
                        } );
                        visited.splice( 0, visited.length );
                        result.innerHTML = results;
                        results = "";
                        book = true;
                        label = false;
                        amounted = 0;
                        amounts = 0;
                        countTotal = 0;
                        reject( error.message );

                    } )
                    .finally( () => clearTimeout( timeoutId ) );
            } else
            {
                throw new Error( "Invalid game or date." );
            }
        } );
    }

    function sortGame ( key, time )
    {
        return new Promise( ( resolve, reject ) =>
        {
            const url = `https://d.livescore.in/x/feed/df_hh_4_${key}`;

            fetch( url,
                {
                    method: 'GET',
                    headers:
                    {
                        "x-fsign": "SW9D1eZo"
                    },
                } )
                .then( response =>
                {
                    if ( !response.ok )
                    {
                        return response.text().then( responseText =>
                        {
                            console.error( `HTTP error! Status: ${response.status}` );
                            reject( "Response:", responseText );
                        } );
                    }
                    return response.text();
                } )
                .then( matches =>
                {
                    function getNames ()
                    {
                        let lines1 = matches.replace( /¬/g, '÷' ).split( '÷' );
                        let counts = 0;
                        let wordCount = [];
                        let homie, awayie;

                        lines1.forEach( ( line1 ) =>
                        {
                            if ( line1.match( /^(.*?Last matches.*)$/ ) )
                            {
                                counts += 1;
                                if ( counts < 3 )
                                {
                                    let namie = line1.replace( /Last matches: /, '' );
                                    wordCount.push( namie );
                                }
                            }
                        } );

                        homie = wordCount[0];
                        awayie = wordCount[1];

                        return teamNames = {
                            team1name: homie,
                            team2name: awayie
                        };
                    }

                    function getTeams ()
                    {
                        let lines = matches.replace( /¬/g, '÷' ).split( '÷' );
                        let count = 0;
                        let hometeams = [];
                        let awayteams = [];
                        let homescores = [];
                        let awayscores = [];
                        let gameDate = [];
                        let dateLimit = new Date( '2021-01-01' ).getTime() / 1000;

                        lines.some( ( line, index ) =>
                        {
                            if ( count > 2 ) return;
                            if ( line.includes( 'Last matches' ) )
                            {
                                count += 1;
                            }
                            else if ( line.match( /(\d+):(\d+)/ ) )
                            {
                                let scores = line.match( /(\d+):(\d+)/ );
                                let homeScore = scores[1];
                                let awayScore = scores[2];

                                let awayTeam = lines[index - 4];
                                let homeTeam = lines[index - 10];
                                let dTime = lines[index - 26];
                                let dTime2 = lines[index - 30];

                                let time100 = ( dTime.length === 10 ) ? dTime : ( ( dTime2.length === 10 ) ? dTime2 : null );


                                if ( !homeTeam.match( /\b\w*\.png\w*\b/ ) || !awayTeam.match( /\b\w*\.png\w*\b/ ) )
                                {
                                    if ( time100 > dateLimit )
                                    {
                                        hometeams.push( homeTeam );
                                        awayteams.push( awayTeam );
                                        homescores.push( homeScore );
                                        awayscores.push( awayScore );
                                        gameDate.push( time100 );
                                    }
                                }
                            }
                        } )

                        resolve( jsons = {
                            names: getNames(),
                            hometeams: hometeams,
                            awayteams: awayteams,
                            homescores: homescores,
                            awayscores: awayscores,
                            gameDate: gameDate
                        } );
                    }
                    getTeams();
                } )
        } );
    }

    function predict ( niceJson, amountOfBooking, gameTime, gameType, gameMode )
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
            const maxNumber = Math.max( hometeams.length, awayteams.length );

            for ( let index = 0; index < maxNumber; index++ )
            {
                if ( team1name == hometeams[index] )
                {
                    if ( awayteams[index] != team2name )
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
                        if ( teamHeads.findIndex( obj =>
                            obj[hometeams[index]] === homescores[index] &&
                            obj[awayteams[index]] === awayscores[index] &&
                            obj["date"] === gameDate[index]
                        ) === -1 )
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
                if ( team1name == awayteams[index] )
                {
                    if ( hometeams[index] != team2name )
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
                        if ( teamHeads.findIndex( obj =>
                            obj[hometeams[index]] === homescores[index] &&
                            obj[awayteams[index]] === awayscores[index] &&
                            obj["date"] === gameDate[index]
                        ) === -1 )
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
                if ( team2name == hometeams[index] )
                {
                    if ( awayteams[index] != team1name )
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
                        if ( teamHeads.findIndex( obj =>
                            obj[hometeams[index]] === homescores[index] &&
                            obj[awayteams[index]] === awayscores[index] &&
                            obj["date"] === gameDate[index]
                        ) === -1 )
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
                if ( team2name == awayteams[index] )
                {
                    if ( hometeams[index] != team1name )
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
                        if ( teamHeads.findIndex( obj =>
                            obj[hometeams[index]] === homescores[index] &&
                            obj[awayteams[index]] === awayscores[index] &&
                            obj["date"] === gameDate[index]
                        ) === -1 )
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

            return ( {
                "team1": team1,
                "team2": team2,
                "teamHeads": teamHeads
            } );
        }
        const matchJson = matchAllTeamNames();
        //console.log(matchJson);

        function getSum ()
        {
            let sum1 = 0;
            let sum2 = 0;
            let iteration = 0;
            const minNumber = Math.min( matchJson.team1.length, matchJson.team2.length );
            for ( let i = 0; i < minNumber; i++ )
            {
                if ( iteration < gameMode )
                {
                    const firstMatch = matchJson.team1[i];
                    const homeTeam = Object.keys( firstMatch )[0];
                    const homeScore = firstMatch[homeTeam];

                    sum1 = sum1 + JSON.parse( homeScore );

                    const secondMatch = matchJson.team2[i];
                    const awayTeam = Object.keys( secondMatch )[0];
                    const awayScore = secondMatch[awayTeam];

                    sum2 = sum2 + JSON.parse( awayScore );
                    iteration++;
                }
            }
            return {
                iteration: iteration,
                sum1: sum1,
                sum2: sum2
            }
        }
        const sum = getSum();
        //console.log(sum);

        function getScore ()
        {
            let score1 = 0;
            let score2 = 0;
            let draw = 0;
            let iteration1 = 0;
            let iteration2 = 0;

            for ( let i = 0; i < matchJson.team1.length; i++ )
            {
                if ( iteration1 < gameMode )
                {
                    const firstMatch = matchJson.team1[i];
                    const homeTeam = Object.keys( firstMatch )[0];
                    const homeScore = firstMatch[homeTeam];
                    const awayTeam = Object.keys( firstMatch )[1];
                    const awayScore = firstMatch[awayTeam];

                    if ( homeScore > awayScore )
                    {
                        score1 += 1;
                    }
                    if ( homeScore == awayScore )
                    {
                        draw += 1;
                    }
                    iteration1++;
                }
            }

            for ( let i = 0; i < matchJson.team2.length; i++ )
            {
                if ( iteration2 < gameMode )
                {
                    const secondMatch = matchJson.team2[i];
                    const homeTeam = Object.keys( secondMatch )[0];
                    const homeScore = secondMatch[homeTeam];
                    const awayTeam = Object.keys( secondMatch )[1];
                    const awayScore = secondMatch[awayTeam];
                    if ( homeScore > awayScore )
                    {
                        score2 += 1;
                    }
                    if ( homeScore == awayScore )
                    {
                        draw += 1;
                    }
                    iteration2++;
                }
            }

            return {
                iteration1: iteration1,
                iteration2: iteration2,
                draw: draw >= iteration1 || draw >= iteration2 ? true : false,
                score1: score1,
                score2: score2
            }
        }
        const score = getScore();

        function h2h ()
        {
            const h2H = matchJson.teamHeads;
            let highValue = 0;
            let draw = 0;

            h2H.forEach( Match =>
            {
                const homeTeam = Object.keys( Match )[0];
                const homeScore = Match[homeTeam];
                const awayTeam = Object.keys( Match )[1];
                const awayScore = Match[awayTeam];

                if ( homeScore > awayScore)
                {
                    highValue += 1;
                }
                if ( awayScore > homeScore)
                {
                    highValue -= 1;
                }
                if ( homeScore == 0 && awayScore == 0 )
                {
                    draw += 1;
                }
            } );

            if ( highValue > 0 )
            {
                draw = draw > highValue ? true : false;
                //highValue = 1;
            }
            else if ( highValue < 0 )
            {
                draw = draw * -1 > highValue ? true : false;
                //highValue = -1;
            }
            else
            {
                draw = draw > highValue ? true : false;
                highValue = 0;
            }
            return {
                highValue: highValue,
                draw: draw
            }
        }
        const head2head = h2h();


        function calculatePercentage ()
        {
            let master = 0;
            let limit = 0;
            let draw = 0;
            const checkedAlready = [];
            const minNumber = Math.min( matchJson.team1.length, matchJson.team2.length );

            outerloop: for ( let i = 0; i < minNumber; i++ )
            {
                if ( limit > ( gameMode ) ) { break outerloop; };
                const firstMatch = matchJson.team1[i];
                const homeTeam1 = Object.keys( firstMatch )[0];
                const awayTeam1 = Object.keys( firstMatch )[1];
                const homeScore1 = firstMatch[homeTeam1];
                const awayScore1 = firstMatch[awayTeam1];

                for ( let j = 0; j < minNumber; j++ )
                {
                    const secondMatch = matchJson.team2[j];
                    const homeTeam2 = Object.keys( secondMatch )[0];
                    const awayTeam2 = Object.keys( secondMatch )[1];
                    const homeScore2 = secondMatch[homeTeam2];
                    const awayScore2 = secondMatch[awayTeam2];

                    if ( awayTeam1 == awayTeam2 )
                    {
                        if ( checkedAlready.includes( awayTeam1 ) ) { continue; } else { checkedAlready.push( awayTeam1 ); }
                        if ( homeScore1 > awayScore1)
                        {
                            master += 1;
                            limit += 1;
                        }
                        if ( homeScore2 > awayScore2)
                        {
                            master -= 1;
                            limit += 1;
                        }
                        if ( homeScore1 == 0 && homeScore2 == 0 )
                        {
                            draw += 1;
                        }
                    }
                }
            }
            return {
                master: master,
                draw: draw = draw > 0 ? true : false
            }
        }
        const percent = calculatePercentage();

        return {
            highestGoals: sum,
            mostGamesWon: score,
            percentageOfHOHWins: percent,
            head2head: head2head
        };
    }

    function outcomes ( calculatedJson, matchJson )
    {
        const { highestGoals, mostGamesWon, percentageOfHOHWins, head2head } = calculatedJson;
        const { team1name, team2name } = matchJson.names;

        const sum1 = highestGoals.sum1 || 0;
        const sum2 = highestGoals.sum2 || 0;

        const score1 = mostGamesWon.score1 || 0;
        const score2 = mostGamesWon.score2 || 0;
        const draw1 = mostGamesWon.draw || false;

        const master = percentageOfHOHWins.master || 0;
        const draw2 = percentageOfHOHWins.draw || false;

        const head2headValue = head2head.highValue || 0;
        const draw3 = head2head.draw || false;

        let home = 0;
        let away = 0;
        let result = null;

        if ( selType.value === 'winner' || selType.value === 'double_chance' )
        {
            home += ( sum1 > sum2 ) + ( score1 > score2 ) + (master > 0) + Math.max( 0, head2headValue );
            away += ( sum2 > sum1 ) + ( score2 > score1 ) + (master < 0) + Math.max( 0, -head2headValue );

            result = home > away ? true : ( away > home ? false : null );
        }
        else if ( selType.value === 'draw' )
        {
            result = draw1 && draw2 && draw3 ? true : null;
        }

        const log = {
            team1: team1name,
            team2: team2name,
            sum1,
            sum2,
            score1,
            score2,
            master,
            head2head: head2headValue,
            result,
            home,
            away
        };
        //console.log(log);
        
        calculatedJson.result = result;
        return log;
        //return result !== null ? calculatedJson : null;
    }
};

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
        selType.innerHTML = '<i class="fa fa-spinner fa-spin"></i>'; // Clear existing options

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

    const bell = document.querySelector( '.fa-bell' );
    const count = document.querySelector( '.count' );
    const notification = document.querySelector( '.notify-text' );
    const result = document.getElementById( 'result' );

    let blurActive = false;
    let allData = [];

    let sug = document.getElementById( 'sug' );

    [bell, count].forEach( ( element ) =>
    {
        element.addEventListener( 'click', () =>
        {
            $( notification ).toggle( '500', () => toggleBlur() );

            if ( !blurActive )
            {
                ( async () =>
                {
                    sug.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
                    try 
                    {
                        allData = await manageGame( "get", null, null );

                        sug.innerHTML = null;

                        const input = document.createElement( 'input' );
                        input.id = "input";
                        input.type = 'text';
                        input.list = '';
                        input.placeholder = 'Start typing a team name';
                        input.style.padding = '10px 10px';
                        input.style.width = '280px';
                        input.style.border = 'none';
                        input.style.outline = 'none';
                        input.style.fontSize = '12px';
                        input.style.textAlign = 'center';
                        input.style.borderRadius = '5px';
                        input.autocomplete = 'off';

                        sug.appendChild( input );

                        const scroll = document.createElement( 'div' );
                        scroll.id = "scroll";

                        const datalist = document.createElement( 'datalist' )
                        datalist.id = "game";
                        input.setAttribute( 'list', 'game' );

                        scroll.appendChild( datalist );
                        sug.appendChild( scroll );

                        Object.values( allData ).forEach( subArrays => 
                        {
                            const gameDiv = document.createElement( "option" );
                            gameDiv.id = 'gamediv';
                            gameDiv.value = subArrays[subArrays.length - 1];
                            gameDiv.textContent = subArrays[subArrays.length - 1];
                            datalist.appendChild( gameDiv );

                            subArrays.forEach( ( item, index ) => 
                            {
                                if ( item.log )
                                {
                                    gameDiv.dataset[`teamA${index}`] = item.log.team1;
                                    gameDiv.dataset[`teamB${index}`] = item.log.team2;
                                }
                            } );
                            gameDiv.dataset[`identifier`] = subArrays[subArrays.length - 1];


                            gameDiv.onclick = function () 
                            {
                                searchText.value = input.value;
                                input.value = gameDiv.value;

                                datalist.style.display = 'none';

                                Object.keys( allData ).forEach( key =>
                                {
                                    const array = allData[key]

                                    if ( array[array.length - 1] === gameDiv.value )
                                    {
                                        generateResults( array );

                                        $( notification ).toggle( '500' );
                                        toggleBlur();
                                        searchAndScroll();
                                    }
                                } );
                            }
                        } );

                        ['input', 'click'].forEach( eventType =>
                        {
                            input.addEventListener( eventType, () =>
                            {
                                datalist.style.display = 'block';

                                for ( let option of datalist.options ) 
                                {
                                    let shouldDisplay = false;

                                    if ( option.value.toUpperCase().indexOf( input.value.toUpperCase() ) > -1 )
                                    {
                                        shouldDisplay = true;
                                    }
                                    else
                                    {
                                        Object.keys( option.dataset ).forEach( key =>
                                        {
                                            if ( option.dataset[key].toUpperCase().indexOf( input.value.toUpperCase() ) > -1 )
                                            {
                                                shouldDisplay = true;
                                            }
                                        } );
                                    }
                                    option.style.display = shouldDisplay ? 'block' : 'none';

                                    option.style.backgroundColor = '';
                                    option.style.color = '';

                                    if ( input.value.toUpperCase() == option.value.toUpperCase() )
                                    {
                                        option.style.backgroundColor = 'green';
                                        option.style.color = 'white';
                                        option.scrollIntoView( { behavior: 'smooth', block: 'nearest' } );
                                    }
                                }
                            } )
                        } );
                    } catch ( error )
                    {
                        $( notification ).toggle( '500', () => toggleBlur() );
                        result.innerHTML = "<p id='error' style='padding: 5px; font-size: 11px;'>A network error has occurred, try again!</p>";
                    }
                } )();
            }
        } );
    } );

    function toggleBlur ()
    {
        if ( !blurActive )
        {
            $( '.notify' ).css( 'z-index', '1' );
            $( 'body > *:not(.notify, .fa-bell, .count)' ).css( 'filter', 'blur(5px)' );
            blurActive = true;
        } else
        {
            $( '.notify' ).css( 'z-index', '0' );
            $( 'body > *:not(.notify)' ).css( 'filter', 'blur(0px)' );
            blurActive = false;
        }
    }

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

    async function checkLiveScores ( key )
    {
        const url = `https://d.livescore.in/x/feed/df_hh_4_${key}`;
        let retries = 10;

        while ( retries > 0 )
        {
            try
            {
                const response = await fetch( url,
                    {
                        method: 'GET',
                        headers: { "x-fsign": "SW9D1eZo" },
                    } );

                if ( response.ok )
                {
                    const matches = await response.text();
                    const lines = matches.replace( /¬/g, '÷' ).split( '÷' );

                    let matchfound;
                    let timefound;
                    for ( let i = 0; i < lines.length; i++ )
                    {
                        const line = lines[i];

                        const match = line.match( /(\d+):(\d+)/ );

                        const timestampMatch = line.match( /\d{10}/ ); // 10-digit timestamp

                        if ( match )
                        {
                            matchfound = match[0];
                        }
                        
                        if ( timestampMatch )
                        {
                            timefound = timestampMatch[0];
                        }

                        if ( matchfound && timefound)
                        {
                            return {
                                score: matchfound,
                                timestamp: timefound,
                            }
                        }
                    }
                }
            }
            catch ( error )
            {
                console.error( 'Error fetching live scores:', error );
            }
            retries--;
            await new Promise( ( resolve ) => setTimeout( resolve, 3000 ) );
        }
        return "Not started";
    }

    function rvs ( score )
    {
        const [homeScore, awayScore] = score.split( ':' );
        return `${awayScore}:${homeScore}`;
    }

    function formatTime ( timestamp )
    {
        if ( !/^\d{10}$/.test( timestamp ) )
        {
            return timestamp; // Return the original timestamp if it's not valid
        }
        const currentTimestamp = Math.floor( Date.now() / 1000 );
        const currentDateTime = new Date( currentTimestamp * 1000 );
        const nextDateTime = new Date( timestamp * 1000 );
        const currentDate = currentDateTime.toISOString().split( 'T' )[0];
        const nextDate = nextDateTime.toISOString().split( 'T' )[0];

        let date;
        const options = { hour: '2-digit', minute: '2-digit' };

        // Options for formatting the day, month, and year
        const dateFormatOptions = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };

        if ( currentDate !== nextDate )
        {
            // Format the next date with the day, month, and year
            const formattedDate = nextDateTime.toLocaleDateString( undefined, dateFormatOptions );
            const formattedTime = nextDateTime.toLocaleTimeString( undefined, options );
            date = `${formattedDate} : ${formattedTime}`;
        } else
        {
            const formattedTime = nextDateTime.toLocaleTimeString( undefined, options );
            date = `Today : ${formattedTime}`;
        }
        return date;
    }

    async function generateResults ( array )
    {
        const odds = array.find( item => item.odds )?.odds;
        const oddsLength = odds ? Object.keys( odds ).length : 0;
        const key = array[array.length - 1];
        let calcOdds = 1;
        let number = 0;

        let results = '';
        array.forEach( ( item, index ) =>
        {
            if ( item.game && item.log )
            {
                const gameOdds = odds[item.game.num];
                let display = gameOdds ? 'block' : 'none';
                if ( gameOdds ) number++;
                calcOdds *= gameOdds || 1;

                results += `
                    <div class="hover" id="${item.game.num}" style="display: ${display}; z-index: 1;">
                    ${number}. Odd: ${gameOdds}<br>
                    ${formatTime( item.game.time )}<br>
                    ${item.game.league}<br>
                    ${item.game.statement}<br>
                    Livescores: <span id="score-${item.game.key}">Loading...</span><br>
                    <a href="https://www.livescore.in/match/${item.game.key}/#/h2h/overall" target="_blank"><button style="z-index: 9999;" class="link">Link</button></a>
                    <table class="popup" style="width:100%; border-collapse: collapse; font-size: 8px; text-align: left;">
                        <thead>
                            <tr>
                                <th style="width:30%; border: 1px solid white;">TEAMS</th>
                                <th style="width:35%; border: 1px solid white;">${item.log.team1}</th>
                                <th style="width:35%; border: 1px solid white;">${item.log.team2}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th style="width:30%; border: 1px solid white;">SCORE</th>
                                <td style="width:35%; border: 1px solid white;">${item.log.score1}</td>
                                <td style="width:35%; border: 1px solid white;">${item.log.score2}</td>
                            </tr>
                            <tr>
                                <th style="width:30%; border: 1px solid white;">SUM</th>
                                <td style="width:35%; border: 1px solid white;">${item.log.sum1}</td>
                                <td style="width:35%; border: 1px solid white;">${item.log.sum2}</td>
                            </tr>
                            <tr>
                                <th style="width:30%; border: 1px solid white;">OUTCOME</th>
                                <td style="width:35%; border: 1px solid white;">Head2head: ${item.log.head2head}</td>
                                <td style="width:35%; border: 1px solid white;">Master: ${item.log.master}</td>
                            </tr>
                            <tr>
                                <th style="width:30%; border: 1px solid white;">${item.log.result}</th>
                                <td style="width:35%; border: 1px solid white;">${item.log.home}</td>
                                <td style="width:35%; border: 1px solid white;">${item.log.away}</td>
                            </tr>
                        </tbody>
                    </table>
                    <br><p id='success'></p>
                </div>`;
                ( async () =>
                {

                    let liveScores = await checkLiveScores( item.game.key );  

                    // If the result is false and home score is greater than away score, reverse the score
                    if ( !item.log.result )
                    {
                        liveScores.score = rvs( liveScores.score );
                    }

                    // Get the home and away scores from liveScores (assuming liveScores is in the format "home:away")
                    const [homeScore, awayScore] = liveScores.score.split( ':' ).map( Number );

                    // Get the result element (assumed it has the ID format 'score-[gameKey]')
                    const scoreElement = document.getElementById( `score-${item.game.key}` );
                    
                    if ( item.game.time !== liveScores.timestamp)
                    {
                        scoreElement.innerText = "Not yet started";
                    }
                    else
                    {
                        scoreElement.innerText = liveScores.score;
                        if ( homeScore > awayScore )
                        {
                            // Add FontAwesome red "X" for incorrect outcome
                            scoreElement.innerHTML += ' <i class="fa fa-check" style="color:#1dda13;"></i>';
                        }
                        else
                        {
                            scoreElement.innerHTML += ' <i class="fa fa-times" style="color:red;"></i>';
                        }
                    }
                } )();
            }
        } );

        const addon = `<a href="https://www.sportybet.com?shareCode=${key}&c=ng" target="_blank">
                        <button style="float:right; background-color: orange;" class="link">Play</button></a>`;
        const data = `Sportybet booking code: ${key}<br>
                        Amount of games booked: ${oddsLength}<br>
                        Total odds: ${calcOdds.toFixed( 2 )} ${addon}`;
        results += `<p id='success' style='padding: 5px; margin-right: 0px; font-size: 10px'>${data}</p>`;

        result.innerHTML = results;

        return results;
    }

    async function manageGame ( action, datas = null, lastValue = null )
    {
        let data = datas;
        const apiUrl = "https://github.webapps.com.ng/paste.php";
        const pin = "3728"; // Pin for secure access

        // Fetch saved data using jQuery AJAX
        async function fetchData ()
        {
            return new Promise( ( resolve, reject ) =>
            {
                $.ajax( {
                    url: `${apiUrl}?saved`,
                    method: "GET",
                    dataType: "json",
                    success: function ( response )
                    {
                        if ( response.Status === "200" && response.data.trim() !== "" )
                        {
                            resolve( JSON.parse( response.data ) ); // return the promise with the decoded data
                        }
                        else
                        {
                            resolve( {} ); // return with an empty object for invalid/empty data
                        }
                    },
                    error: function ( error )
                    {
                        reject( error );
                    },
                } );
            } );
        };


        // Save data using jQuery AJAX
        async function saveData ( payload )
        {
            return new Promise( ( resolve, reject ) =>
            {
                $.ajax( {
                    url: apiUrl,
                    method: "POST",
                    data: {
                        save: JSON.stringify( payload ),
                        pin: pin,
                    },
                    dataType: 'json',
                    timeout: 8000,
                    success: function ( response )
                    {
                        resolve( response ); // Resolve the promise with the decoded data
                    },
                    error: function ( error )
                    {
                        reject( error );
                    },
                } );
            } );
        };

        const now = new Date();
        const twoDaysAgo = new Date( now.getTime() - 1 * 24 * 60 * 60 * 1000 );

        // Perform actions
        if ( action === "save" )
        {
            if ( data.length === 0 ) return false;
            const uniqueKey = now.toISOString();
            let storedData = await fetchData();
            let cond = false;
            Object.values( storedData ).forEach( subArrays => 
            {
                const lastElement = subArrays[subArrays.length - 1];
                const thisElement = data[data.length - 1];
                if ( lastElement === thisElement )
                {
                    cond = true;
                }
            } );
            if ( cond === true )
            {
                return false;
            }
            storedData = storedData || {};
            storedData[uniqueKey] = data;
            await saveData( storedData );
        }
        else if ( action === "get" )
        {
            let storedData = await fetchData();

            if ( storedData )
            {
                const comp = new Set();

                Object.keys( storedData ).forEach( ( key ) =>
                {
                    const savedDate = new Date( key );
                    const lastElement = key[key.length - 1];

                    if ( savedDate < twoDaysAgo )
                    {
                        delete storedData[key];
                    }
                } );

                await saveData( storedData );
                return storedData;
            }
        }
    }


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
    var save_game = [];

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
                                        async function ( responses )
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
                                                    save_game.splice( 0, save_game.length );
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

                                                save_game.push( {
                                                    odds: gamesBooked
                                                } );
                                                save_game.push( shareCode );

                                                generateResults( save_game );
                                                manageGame( "save", save_game );
                                                setTimeout( () => 
                                                {
                                                    save_game.splice( 0, save_game.length );
                                                    Object.keys( dataKing ).forEach( function ( key )
                                                    {
                                                        delete dataKing[key];
                                                    } );
                                                    visited.splice( 0, visited.length );
                                                }, 5000 );

                                                results = "";
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
                                                save_game.splice( 0, save_game.length );
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
                                            save_game.splice( 0, save_game.length );
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

                let calculatedJson = await predict( niceJson, gameMode )

                let predictedOutcome = await outcomes( calculatedJson, niceJson );
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
                        const date = new Date( time * 1000 );
                        const options = { hour: '2-digit', minute: '2-digit', hour12: true };
                        const formattedTime = date.toLocaleTimeString( 'en-US', options );
                        
                        var data =
                        {
                            "key": key,
                            "home": homeT,
                            "away": awayT,
                            "time": formattedTime,
                            "outcome": outcome,
                            "gameNo": ( times + 1 )
                        };
                        dataKing["NO" + times] = data;

                        const game = {
                            num: times + 1,
                            key,
                            time,
                            league,
                            statement
                        };
                        //results += generateResults( game );
                        save_game.push( {
                            game: game,
                            log: predictedOutcome
                        } );

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
                                        leagues[codes1][codes2] = league;
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
                            save_game.splice( 0, save_game.length );
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

                        console.error( error.message );
                        results += "<p id='error' style='padding: 5px'>" + error.message + "</p>";
                        button.innerHTML = "Search";
                        clear.innerHTML = "Clear";
                        click = true;
                        Object.keys( dataKing ).forEach( function ( key )
                        {
                            delete dataKing[key];
                        } );
                        visited.splice( 0, visited.length );
                        save_game.splice( 0, save_game.length );
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

    async function sortGame ( key )
    {
        const url = `https://d.livescore.in/x/feed/df_hh_4_${key}`;

        try
        {
            const response = await fetch( url, {
                method: 'GET',
                headers: { "x-fsign": "SW9D1eZo" },
            } );

            if ( !response.ok )
            {
                const responseText = await response.text();
                throw new Error( `HTTP error! Status: ${response.status}, Response: ${responseText}` );
            }

            const matches = await response.text();

            const getNames = () =>
            {
                const lines = matches.replace( /¬/g, '÷' ).split( '÷' );

                const wordCount = [];
                let counts = 0;

                lines.forEach( ( line ) =>
                {
                    if ( line.includes( 'Last matches:' ) && counts < 3 )
                    {
                        counts += 1;
                        wordCount.push( line.replace( 'Last matches: ', '' ) );
                    }
                } );

                return {
                    team1name: wordCount[0] || null,
                    team2name: wordCount[1] || null,
                };
            };

            const getTeams = () =>
            {
                const lines = matches.replace( /¬/g, '÷' ).split( '÷' );
                const hometeams = [];
                const awayteams = [];
                const homescores = [];
                const awayscores = [];
                const gameDate = [];
                const dateLimit = new Date( '2023-01-01' ).getTime() / 1000;
                let count = 0;

                for ( let i = 0; i < lines.length; i++ )
                {
                    const line = lines[i];

                    if ( line.includes( 'Last matches' ) )
                    {
                        count += 1;
                    } else if ( line.match( /(\d+):(\d+)/ ) && count <= 2 )
                    {
                        const [_, homeScore, awayScore] = line.match( /(\d+):(\d+)/ );
                        const awayTeam = lines[i - 4] || '';
                        const homeTeam = lines[i - 10] || '';
                        const dTime = lines[i - 26] || '';
                        const dTime2 = lines[i - 30] || '';

                        const time100 = dTime.length === 10 ? dTime : ( dTime2.length === 10 ? dTime2 : null );

                        if ( time100 > dateLimit && !/\b\w*\.png\w*\b/.test( homeTeam ) && !/\b\w*\.png\w*\b/.test( awayTeam ) )
                        {
                            hometeams.push( homeTeam );
                            awayteams.push( awayTeam );
                            homescores.push( homeScore );
                            awayscores.push( awayScore );
                            gameDate.push( time100 );
                        }
                    }
                }

                return {
                    hometeams,
                    awayteams,
                    homescores,
                    awayscores,
                    gameDate,
                };
            };

            return {
                names: getNames(),
                ...getTeams(),
            };

        } catch ( error )
        {
            console.error( `Error fetching or processing data: ${error.message}` );
            throw error;
        }
    }


    function predict ( niceJson, gameMode )
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

            function addMatch ( array, homeTeam, homeScore, awayTeam, awayScore, date )
            {
                array.push( {
                    [homeTeam]: homeScore,
                    [awayTeam]: awayScore,
                    ["date"]: date
                } );
            }

            function addUniqueMatch ( array, homeTeam, homeScore, awayTeam, awayScore, date )
            {
                if ( array.findIndex( obj =>
                    obj[homeTeam] === homeScore &&
                    obj[awayTeam] === awayScore &&
                    obj["date"] === date
                ) === -1 )
                {
                    addMatch( array, homeTeam, homeScore, awayTeam, awayScore, date );
                }
            }

            for ( let index = 0; index < maxNumber; index++ )
            {
                const homeTeam = hometeams[index];
                const awayTeam = awayteams[index];
                const homeScore = Number( homescores[index] );
                const awayScore = Number( awayscores[index] );
                const date = gameDate[index];

                if ( team1name === homeTeam )
                {
                    if ( awayTeam !== team2name ) addMatch( team1, homeTeam, homeScore, awayTeam, awayScore, date );
                    else addUniqueMatch( teamHeads, homeTeam, homeScore, awayTeam, awayScore, date );
                }
                if ( team1name === awayTeam )
                {
                    if ( homeTeam !== team2name ) addMatch( team1, awayTeam, awayScore, homeTeam, homeScore, date );
                    else addUniqueMatch( teamHeads, awayTeam, awayScore, homeTeam, homeScore, date );
                }
                if ( team2name === homeTeam )
                {
                    if ( awayTeam !== team1name ) addMatch( team2, homeTeam, homeScore, awayTeam, awayScore, date );
                    else addUniqueMatch( teamHeads, homeTeam, homeScore, awayTeam, awayScore, date );
                }
                if ( team2name === awayTeam )
                {
                    if ( homeTeam !== team1name ) addMatch( team2, awayTeam, awayScore, homeTeam, homeScore, date );
                    else addUniqueMatch( teamHeads, awayTeam, awayScore, homeTeam, homeScore, date );
                }
            }

            return {
                "team1": team1,
                "team2": team2,
                "teamHeads": teamHeads
            };
        }
        const matchJson = matchAllTeamNames();

        function getSum ()
        {
            let sum1 = 0;
            let sum2 = 0;
            let iteration = 0;
            const numMatchesToIterate = Math.min( matchJson.team1.length, matchJson.team2.length );

            // Return early if no matches or gameMode is 0
            if ( numMatchesToIterate === 0 || gameMode === 0 )
            {
                return { iteration: 0, sum1: 0, sum2: 0 };
            }

            for ( let i = 0; i < numMatchesToIterate; i++ )
            {
                if ( iteration < gameMode )
                {
                    const firstMatch = matchJson.team1[i];
                    const homeTeam = Object.keys( firstMatch )[0];
                    const homeScore = Number( firstMatch[homeTeam] );

                    // Ensure valid number for homeScore
                    if ( !isNaN( homeScore ) )
                    {
                        sum1 += homeScore;
                    }

                    const secondMatch = matchJson.team2[i];
                    const awayTeam = Object.keys( secondMatch )[0];
                    const awayScore = Number( secondMatch[awayTeam] );

                    // Ensure valid number for awayScore
                    if ( !isNaN( awayScore ) )
                    {
                        sum2 += awayScore;
                    }

                    iteration++;
                }
            }

            return {
                iteration: iteration,
                sum1: sum1,
                sum2: sum2
            };
        }

        const sum = getSum();

        function getScore () 
        {
            let score1 = 0, score2 = 0, draw = 0;

            const calculateScores = ( matches, gameMode ) =>
            {
                let localScore = 0, localDraw = 0, iteration = 0;

                for ( let i = 0; i < matches.length && iteration < gameMode; i++ )
                {
                    const match = matches[i];
                    const homeTeam = Object.keys( match )[0];
                    const homeScore = Number( match[homeTeam] );
                    const awayTeam = Object.keys( match )[1];
                    const awayScore = Number( match[awayTeam] );

                    if ( homeScore > awayScore )
                    {
                        localScore += 1;
                    } else if ( homeScore === awayScore )
                    {
                        localDraw += 1;
                    }

                    iteration++;
                }

                return { localScore, localDraw, iteration };
            };

            const team1Result = calculateScores( matchJson.team1, gameMode );
            const team2Result = calculateScores( matchJson.team2, gameMode );

            score1 = team1Result.localScore;
            score2 = team2Result.localScore;
            draw = team1Result.localDraw + team2Result.localDraw;

            return {
                iteration1: team1Result.iteration,
                iteration2: team2Result.iteration,
                draw: draw >= score1 && draw >= score2,
                score1: score1,
                score2: score2
            };
        }

        const score = getScore();

        function h2h ()
        {
            const h2H = matchJson.teamHeads;

            let add = 0;

            const { highValue, draw } = h2H.slice().reverse().reduce(
                ( acc, Match ) =>
                {
                    const homeTeam = Object.keys( Match )[0];
                    const awayTeam = Object.keys( Match )[1];

                    const homeScore = Number( Match[homeTeam] );
                    const awayScore = Number( Match[awayTeam] );

                    if ( homeScore > awayScore ) add++, acc.highValue += add;
                    if ( awayScore > homeScore ) add++, acc.highValue -= add;
                    else acc.draw++;

                    return acc;
                },
                { highValue: 0, draw: 0 } // Initial accumulator values
            );

            return {
                highValue,
                draw: draw > Math.abs( highValue )
            };

        }
        const head2head = h2h();

        function calculatePercentage ()
        {
            let master = 0;
            let limit = 0;
            let draw = 0;
            const checkedAlready = new Set();
            const minNumber = Math.min( Number( matchJson.team1.length ), Number( matchJson.team2.length ) );

            for ( let i = 0; i < minNumber; i++ )
            {
                const firstMatch = matchJson.team1[i];
                const homeTeam1 = Object.keys( firstMatch )[0];
                const awayTeam1 = Object.keys( firstMatch )[1];
                const homeScore1 = Number( firstMatch[homeTeam1] );
                const awayScore1 = Number( firstMatch[awayTeam1] );

                for ( let j = 0; j < minNumber; j++ )
                {
                    const secondMatch = matchJson.team2[j];
                    const homeTeam2 = Object.keys( secondMatch )[0];
                    const awayTeam2 = Object.keys( secondMatch )[1];
                    const homeScore2 = Number( secondMatch[homeTeam2] );
                    const awayScore2 = Number( secondMatch[awayTeam2] );

                    if ( awayTeam1 === awayTeam2 && !checkedAlready.has( awayTeam1 ) ) 
                    {
                        checkedAlready.add( awayTeam1 );

                        if ( homeScore1 > awayScore1 )
                        {
                            master += 1;
                            limit += 1;
                        }
                        if ( homeScore2 > awayScore2 )
                        {
                            master -= 1;
                            limit += 1;
                        }
                        if ( homeScore1 == 0 && homeScore2 == 0 )
                        {
                            draw += 1;
                            limit++;
                        }
                        if ( limit >= gameMode ) break;
                    }
                }
                if ( limit >= gameMode ) break;
            }
            return {
                master,
                draw: draw > Math.abs( master )
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
            home += ( sum1 > sum2 ) + ( score1 > score2 ) + ( master > 0 ) + Math.max( 0, head2headValue );
            away += ( sum2 > sum1 ) + ( score2 > score1 ) + ( master < 0 ) + Math.max( 0, -head2headValue );

            result = home > away + 3 && master > 1 ? true : ( away > home + 3 && master < -1 ? false : null );
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

        calculatedJson.result = result;
        /*if ( team1name == "Sichuan" || team2name == "Sichuan" )
        {
            console.log( calculatedJson );
            console.log( log );
        }*/

        return log;
    }
};

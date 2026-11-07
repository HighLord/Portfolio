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
    for ( let tenths = 11; tenths <= 41; tenths++ )
    {
        const odd = ( tenths / 10 ).toFixed( 1 ); // whole-number steps avoid floating-point drift
        const option = document.createElement( 'option' );
        option.value = odd;
        option.text = 'Less than ' + odd + ' Odds';
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

    const bell = document.querySelector( '.fa-refresh' );
    const count = document.querySelector( '.count' );
    const notification = document.querySelector( '.notify-text' );
    const result = document.getElementById( 'result' );

    let allData = [];
    let sug;
    let reload = false;
    let clickCount = 0;

    [bell, count].forEach( ( element ) =>
    {
        element.addEventListener( 'click', () =>
        {
            if ( reload === false )
            {
                clickCount++;
                reload = true;
                ( async () =>
                {
                    if ( result.innerHTML === '' || result.innerHTML.length > 37 ) sug = result.innerHTML;
                    result.style.textAlign = 'center';
                    result.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';

                    try 
                    {
                        if ( Object.values( allData ).length > 0 && clickCount > 5 )
                        {
                            allData = [];
                            clickCount = 0;
                        }

                        if ( Object.values( allData ).length == 0 )
                        {
                            allData = await manageGame( "get", null, null );
                        }

                        if ( reload === true )
                        {
                            result.innerHTML = null;
                            result.style.textAlign = 'left';

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

                            result.appendChild( input );

                            const scroll = document.createElement( 'div' );
                            scroll.id = "scroll";

                            const datalist = document.createElement( 'datalist' )
                            datalist.id = "game";
                            input.setAttribute( 'list', 'game' );

                            scroll.appendChild( datalist );
                            result.appendChild( scroll );
                            
                            Object.entries( allData ).forEach( ( [key, subArrays] ) =>
                            {
                                const gameDiv = document.createElement( "option" );
                                gameDiv.id = 'gamediv';
                                gameDiv.value = subArrays[subArrays.length - 1];
                                gameDiv.textContent = subArrays[subArrays.length - 1] + ` expires ${formatTime( key )} `;
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
                                    result.style.textAlign = 'left';
                                    reload = false;

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
                        }
                    } catch ( error )
                    {
                        if ( reload ) result.innerHTML = "<p id='error' style='padding: 5px; font-size: 11px;'>A network error has occurred, try again!</p>";
                        reload = false;
                    }
                } )();
            }
            else
            {
                reload = false;
                result.style.textAlign = 'left';
                result.innerHTML = sug;
            }
        } );
    } );

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
            liveScoreRun++; // stops the live-score loop
            if ( liveScoreInterval )
            {
                clearInterval( liveScoreInterval );
            }
        }
        if ( click === false )
        {
            amountOfBooking = times + 1;
            stop = true;
            clear.innerHTML = 'Stopping   <i class="fa fa-spinner fa-spin"></i>';
        }
    } );

    function parseLine ( words )
    {
        let values = {
            currenttime: null,
            starttime: null,
            home: null,
            away: null,
            live: false
        };

        for ( let i = 0; i < words.length; i++ )
        {
            if ( words[i] === "DD" )
            {
                values.currenttime = Number( words[i + 1] ); // Value after "DD"
            } else if ( words[i] === "DC" )
            {
                values.starttime = Number( words[i + 1] ); // Value after "DC"
            } else if ( words[i] === "DG" )
            {
                values.home = Number( words[i + 1] ); // Value after "DE"
            } else if ( words[i] === "DH" )
            {
                values.away = Number( words[i + 1] ); // Value after "DF"
            } else if ( words[i] === "CO" )
            {
                values.live = true;
            }
        }

        return values;
    }

    async function checkLiveScores ( key )
    {
        //const url = `https://global.flashscore.ninja/50/x/feed/dc_4_${key}`;
        const url = `https://api.webapps.com.ng/v2/sports/livefeed.php?50&x&feed&dc_4_${key}`;
        let retries = 1;

        while ( retries > 0 )
        {
            const controller = new AbortController();
            const timeoutId = setTimeout( () => controller.abort(), 15000 );
            try
            {
                const response = await fetch( url,
                    {
                        method: 'GET',
                        headers: { "x-fsign": "SW9D1eZo" },
                        signal: controller.signal
                    } );

                if ( response.ok )
                {
                    const matches = await response.text();
                    const lines = matches.replace( /¬/g, '÷' ).split( '÷' );

                    return parseLine( lines );
                }
            }
            catch ( error )
            {
                console.error( error );
            }
            finally
            {
                clearTimeout( timeoutId );
            }
            retries--;
            await new Promise( ( resolve ) => setTimeout( resolve, 3000 ) );
        }
        return "Not started";
    }

    function formatTime ( timestamp )
    {
        let isoString = false;
        if ( !/^\d{10}$/.test( timestamp ) )
        {
            isoString = true;
            //timestamp = Math.floor( new Date( timestamp ).getTime() / 1000 );
            let tempDate = new Date( timestamp );
            tempDate.setDate( tempDate.getDate() + 1 ); // Increase the date by 1
            timestamp = Math.floor( tempDate.getTime() / 1000 );
        }
        const currentTimestamp = Math.floor( Date.now() / 1000 );
        const currentDateTime = new Date( currentTimestamp * 1000 );
        const nextDateTime = new Date( timestamp * 1000 );

        const currentDate = currentDateTime.toISOString().split( 'T' )[0];
        const nextDate = nextDateTime.toISOString().split( 'T' )[0];

        let date;
        const timeOptions = { hour: '2-digit', minute: '2-digit' }; // Options for time formatting

        if ( currentDate === nextDate )
        {
            // If the dates match, return "Today" with the formatted time
            const formattedTime = nextDateTime.toLocaleTimeString( undefined, timeOptions );
            date = `Today : ${formattedTime}`;
        }
        else
        {
            // If the dates don't match, format the full date and time
            let dayOptions = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }; // Short date format
            if ( isoString ) dayOptions = { weekday: 'short', month: 'short', day: 'numeric' }
            const formattedDate = nextDateTime.toLocaleDateString( undefined, dayOptions );
            const formattedTime = nextDateTime.toLocaleTimeString( undefined, timeOptions );
            date = `${formattedDate}: ${formattedTime}`;
        }
        return date;
    }

    let liveScoreInterval;
    let liveScoreRun = 0;   // each displayed list gets a new id; an older loop stops when its id is stale
    function renderEvidenceRows ( log )
    {
        const cell = 'style="width:35%; border: 1px solid white;"';
        const label = 'style="width:30%; border: 1px solid white;"';
        if ( log.model === MODEL_VERSION )
        {
            return `<tr><th ${label}>WIN %</th><td ${cell}>${log.score1}</td><td ${cell}>${log.score2}</td></tr>
                    <tr><th ${label}>EXP GOALS</th><td ${cell}>${log.sum1}</td><td ${cell}>${log.sum2}</td></tr>
                    <tr><th ${label}>MARGINS</th><td ${cell}>Head2head: ${log.head2head}</td><td ${cell}>Common opp: ${log.master}</td></tr>
                    <tr><th ${label}>FORM</th><td ${cell}>Goals: ${log.formGoals ?? '-'}</td><td ${cell}>Results: ${log.formResults ?? '-'}</td></tr>
                    <tr><th ${label}>DRAW %</th><td ${cell}>${log.draw}</td><td ${cell}>Games: ${log.games1}/${log.games2}</td></tr>`;
        }
        // Entries saved before model v2 keep their original layout.
        return `<tr>
                                <th style="width:30%; border: 1px solid white;">SCORE</th>
                                <td style="width:35%; border: 1px solid white;">${log.score1}</td>
                                <td style="width:35%; border: 1px solid white;">${log.score2}</td>
                            </tr>
                            <tr>
                                <th style="width:30%; border: 1px solid white;">SUM</th>
                                <td style="width:35%; border: 1px solid white;">${log.sum1}</td>
                                <td style="width:35%; border: 1px solid white;">${log.sum2}</td>
                            </tr>
                            <tr>
                                <th style="width:30%; border: 1px solid white;">OUTCOME</th>
                                <td style="width:35%; border: 1px solid white;">Head2head: ${log.head2head}</td>
                                <td style="width:35%; border: 1px solid white;">Master: ${log.master}</td>
                            </tr>
                            <tr>
                                <th style="width:30%; border: 1px solid white;">${log.result}</th>
                                <td style="width:35%; border: 1px solid white;">${log.home}</td>
                                <td style="width:35%; border: 1px solid white;">${log.away}</td>
                            </tr>`;
    }

    async function generateResults ( array )
    {
        const odds = array.find( item => item.odds )?.odds;
        const oddsLength = odds ? Object.keys( odds ).length : 0;
        const key = array[array.length - 1];
        let calcOdds = 1;
        let number = 0;

        let results = '';
        let notStart = false;
        let hold = [];
        const firstChecks = [];   // the first live-score request of every game

        const validGames = array.filter( item => item.game && item.log && odds?.[item.game.num] ); // Only process items with functional gameOdds
        validGames.forEach( ( item, index ) =>
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
                            ${renderEvidenceRows( item.log )}
                        </tbody>
                    </table>
                    <br><p id='success'></p>
                </div>`;
                firstChecks.push( ( async () =>
                {
                    const patternWinOrDraw = /win\s+or\s+draw/i;
                    const winOrDraw = patternWinOrDraw.test( item.game.statement );

                    const patternJustDraw = /(?<!win\s+or\s+)draw/i;
                    const justDraw = patternJustDraw.test( item.game.statement );

                    let liveScores = await checkLiveScores( item.game.key );

                    let text = `${liveScores.home}:${liveScores.away}`;
                    // If the result is false and home score is greater than away score, reverse the score
                    if ( !item.log.result )
                    {
                        text = `${liveScores.away}:${liveScores.home}`;
                    }

                    // Get the result element (assumed it has the ID format 'score-[gameKey]')
                    const scoreElement = document.getElementById( `score-${item.game.key}` );

                    if ( liveScores.currenttime < item.game.time || liveScores.home == null && liveScores.away == null )
                    {
                        scoreElement.innerText = "Not yet started";
                        hold.push( item );
                        notStart = true;
                    }
                    else
                    {
                        if ( winOrDraw )
                        {
                            scoreElement.innerHTML =
                                ( liveScores.live )
                                    ? `${text} <i class="fa fa-spinner fa-spin" style="${( liveScores.home > liveScores.away && item.log.result ) || ( liveScores.home < liveScores.away && !item.log.result ) || ( liveScores.home == liveScores.away )
                                        ? 'color:#1dda13;' : 'color:red;'}"></i>`
                                    : ( ( liveScores.home > liveScores.away && item.log.result ) || ( liveScores.home < liveScores.away && !item.log.result ) || ( liveScores.home == liveScores.away )
                                        ? `${text} <i class="fa fa-check" style="color:#1dda13;"></i>`
                                        : `${text} <i class="fa fa-times" style="color:red;"></i>` );

                        }
                        else if ( justDraw )
                        {
                            scoreElement.innerHTML =
                                ( liveScores.live )
                                    ? `${text} <i class="fa fa-spinner fa-spin" style="${( liveScores.home == liveScores.away )
                                        ? 'color:#1dda13;' : 'color:red;'}"></i>`
                                    : ( ( liveScores.home == liveScores.away )
                                        ? `${text} <i class="fa fa-check" style="color:#1dda13;"></i>`
                                        : `${text} <i class="fa fa-times" style="color:red;"></i>` );

                        }
                        else
                        {
                            scoreElement.innerHTML =
                                ( liveScores.live )
                                    ? `${text} <i class="fa fa-spinner fa-spin" style="${( liveScores.home > liveScores.away && item.log.result ) || ( liveScores.home < liveScores.away && !item.log.result )
                                        ? 'color:#1dda13;' : 'color:red;'}"></i>`
                                    : ( ( liveScores.home > liveScores.away && item.log.result ) || ( liveScores.home < liveScores.away && !item.log.result )
                                        ? `${text} <i class="fa fa-check" style="color:#1dda13;"></i>`
                                        : `${text} <i class="fa fa-times" style="color:red;"></i>` );
                        }
                    }
                    if ( liveScores.live ) notStart = true, hold.push( item );
                } )() );
            }
        } );

        const addon = `<a href="https://www.sportybet.com?shareCode=${key}&c=ng" target="_blank">
                        <button style="float:right; background-color: orange;" class="link">Play</button></a>`;
        const data = `Sportybet booking code: ${key}<br>
                        Amount of games booked: ${oddsLength}<br>
                        Total odds: ${calcOdds.toFixed( 2 )} ${addon}`;
        results += `<p id='success' style='padding: 5px; margin-right: 0px; font-size: 10px'>${data}</p>`;

        result.innerHTML = results;

        async function updateLiveScores ()
        {
            notStart = false
            const validGames = [...new Set( hold )].filter( item => item.game && item.log && odds?.[item.game.num] ); // Only process items with functional gameOdds
            const nextHold = []; // becomes the new hold only after every request below has finished

            await Promise.all( validGames.map( async ( item ) =>
            {
                if ( item.game && item.log )
                {
                    const patternWinOrDraw = /win\s+or\s+draw/i;
                    const winOrDraw = patternWinOrDraw.test( item.game.statement );

                    const patternJustDraw = /(?<!win\s+or\s+)draw/i;
                    const justDraw = patternJustDraw.test( item.game.statement );

                    let liveScores = await checkLiveScores( item.game.key );

                    let text = `${liveScores.home}:${liveScores.away}`;
                    if ( !item.log.result )
                    {
                        text = `${liveScores.away}:${liveScores.home}`;
                    }

                    // Get the result element (assumed it has the ID format 'score-[gameKey]')
                    const scoreElement = document.getElementById( `score-${item.game.key}` );
                    if ( scoreElement )
                    {
                        if (
                            liveScores.currenttime < item.game.time ||
                            liveScores.home == null &&
                            liveScores.away == null
                        )
                        {
                            scoreElement.innerText = "Not yet started";
                            notStart = true;
                            nextHold.push( item )
                        } else
                        {
                            if ( winOrDraw )
                            {
                                scoreElement.innerHTML =
                                    ( liveScores.live )
                                        ? `${text} <i class="fa fa-spinner fa-spin" style="${( liveScores.home > liveScores.away && item.log.result ) || ( liveScores.home < liveScores.away && !item.log.result ) || ( liveScores.home == liveScores.away )
                                            ? 'color:#1dda13;' : 'color:red;'}"></i>`
                                        : ( ( liveScores.home > liveScores.away && item.log.result ) || ( liveScores.home < liveScores.away && !item.log.result ) || ( liveScores.home == liveScores.away )
                                            ? `${text} <i class="fa fa-check" style="color:#1dda13;"></i>`
                                            : `${text} <i class="fa fa-times" style="color:red;"></i>` );

                            }
                            else if ( justDraw )
                            {
                                scoreElement.innerHTML =
                                    ( liveScores.live )
                                        ? `${text} <i class="fa fa-spinner fa-spin" style="${( liveScores.home == liveScores.away )
                                            ? 'color:#1dda13;' : 'color:red;'}"></i>`
                                        : ( ( liveScores.home == liveScores.away )
                                            ? `${text} <i class="fa fa-check" style="color:#1dda13;"></i>`
                                            : `${text} <i class="fa fa-times" style="color:red;"></i>` );

                            }
                            else
                            {
                                scoreElement.innerHTML =
                                    ( liveScores.live )
                                        ? `${text} <i class="fa fa-spinner fa-spin" style="${( liveScores.home > liveScores.away && item.log.result ) || ( liveScores.home < liveScores.away && !item.log.result )
                                            ? 'color:#1dda13;' : 'color:red;'}"></i>`
                                        : ( ( liveScores.home > liveScores.away && item.log.result ) || ( liveScores.home < liveScores.away && !item.log.result )
                                            ? `${text} <i class="fa fa-check" style="color:#1dda13;"></i>`
                                            : `${text} <i class="fa fa-times" style="color:red;"></i>` );
                            }
                        }
                        if ( liveScores.live ) notStart = true, nextHold.push( item );
                    }
                }
            } ) );

            return nextHold;
        }

        // One polling loop per displayed list (a newer list or the Clear button makes this one stale).
        // A round re-checks every game still in `hold`. The next round starts only when BOTH are true:
        //   1. every request of the current round has finished, and
        //   2. 20 seconds have passed since that round started.
        // `hold` is replaced only at that moment, so rounds never overlap.
        const runId = ++liveScoreRun;
        ( async () =>
        {
            // first round: wait for the initial request of every game and for 20 seconds
            await Promise.allSettled( [...firstChecks, delay( 20000 )] );

            while ( runId === liveScoreRun && hold.length > 0 && hold.some( item => document.getElementById( `score-${item.game.key}` ) ) )
            {
                const [nextHold] = await Promise.all( [updateLiveScores(), delay( 20000 )] );
                if ( runId !== liveScoreRun ) return;
                hold = nextHold;
            }
        } )().catch( ( error ) => console.error( error ) );

        return results;
    }

    async function manageGame ( action, datas = null, lastValue = null )
    {
        let data = datas;
        let filteredData;
        if ( data )
        {
            const oddsObject = data.find( ( item ) => item.odds );
            const odds = Object.keys( oddsObject?.odds || {} ).map( Number );
            const result = data.filter( ( item ) => item.game && odds.includes( item.game.num ) );
            const lastKey = data.find( ( item ) => typeof item === "string" );

            result.push( { odds: oddsObject?.odds } );
            result.push( lastKey );
            filteredData = result;
        }

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
                    timeout: 8000,
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

        // Perform actions
        if ( action === "save" )
        {
            if ( filteredData.length === 0 ) return false;
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
            const times = filteredData
                .filter( item => item.game && item.game.time ) // Filter only objects with a 'game' and 'time'
                .map( item => parseInt( item.game.time, 10 ) ); // Extract the time values and convert to integers

            const largestTime = Math.max( ...times ); // Find the largest time
            const adjustedTime = new Date( ( largestTime + 3600 ) * 1000 ); // Add 1 hour to adjust for Lagos time
            const isoString = adjustedTime.toISOString();



            storedData[isoString] = filteredData;
            
            
            await saveData( storedData );
        }
        else if ( action === "get" )
        {
            let storedData = await fetchData();

            if ( storedData )
            {
                const currentDate = new Date();

                Object.keys( storedData ).forEach( ( key ) =>
                {
                    const savedDate = new Date( key );

                    // Check if the saved date is more than one day older than the current date
                    const differenceInTime = currentDate - savedDate; // Difference in milliseconds
                    const differenceInDays = differenceInTime / ( 24 * 60 * 60 * 1000 ); // Convert to days

                    if ( differenceInDays > 1 )
                    {
                        //delete storedData[key];
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
    var statusNote = '';                  // retry / rebooking message shown under the progress bar
    const REBOOK_DELAY_MS = 3000;         // wait between booking attempts
    const MATCH_FETCH_ATTEMPTS = 3;       // tries per match before it is skipped
    const MATCH_RETRY_DELAY_MS = 2000;
    const delay = ( milliseconds ) => new Promise( ( resolve ) => setTimeout( resolve, milliseconds ) );
    const statusLine = () => ( statusNote ? '<br>' + statusNote : '' );

    function updateProgressBar ( value, max )
    {
        if ( label === false )
        {
            document.getElementById( 'result' ).innerHTML = '<div id="status" style="width: 100%; text-align: center;"><div style="width: 100%;"><div id="progress-bar"></div></div><p id="report" style="padding: 10px;">GAMES SCANNED: ' + countTotal + '<br>PREDICTING ' + amounted + ' OF ' + amountOfBooking + ' GAMES<br>NO OF GAMES BOOKED: ' + amounts + statusLine() + '</p></div>';
            label = true;
        }
        const progressBar = document.getElementById( 'progress-bar' );
        const report = document.getElementById( 'report' );
        const percentage = ( value / max ) * 100;
        setTimeout( () =>
        {
            progressBar.style.width = `${percentage}%`;
            report.innerHTML = 'GAMES SCANNED: ' + countTotal + '<br>PREDICTING ' + amounted + ' OF ' + amountOfBooking + ' GAMES<br>NO OF GAMES BOOKED: ' + amounts + statusLine();
        }, 10 );
    }
    var ok = 0;

    const selectElement = document.getElementById( "mySelect" );
    const selectElement2 = document.getElementById( 'mySelect2' );
    const selectElement3 = document.getElementById( 'mySelect3' );
    const selectElement4 = document.getElementById( 'mySelect4' );
    const selMethod = document.getElementById( 'mySelect7' ); // absent in older HTML, then DEFAULT_METHOD is used
    function analyse ( selEle, timer )
    {
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

        // Shared reset for a run that cannot continue.
        function failRun ( message )
        {
            results += `<p id='error' style='padding: 5px'>${message}</p>`;
            book = true;
            Object.keys( dataKing ).forEach( ( key ) => delete dataKing[key] );
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
            statusNote = '';
        }

        async function ajax ()
        {
            var response = await getGames( gameType, gameTime );
            //console.log(response);
            
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
                            try
                            {
                                await doSomethingWithElement( key, time, league );
                            }
                            catch ( error )
                            {
                                console.error( `Skipped game ${key}:`, error ); // one bad game must not stop the scan
                            }
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
                            let bookingAttempts = 0;
                            let bookingSucceeded = false; // once true, a failure afterwards must not trigger a second booking

                            // Returns true when another attempt is scheduled; false once the user pressed Stop.
                            function scheduleRebook ()
                            {
                                if ( stop === true ) return false;
                                bookingAttempts++;
                                statusNote = `REBOOKING... ATTEMPT ${bookingAttempts}`;
                                updateProgressBar( amounted, amountOfBooking );
                                setTimeout( sendBooking, REBOOK_DELAY_MS );
                                return true;
                            }

                            function sendBooking ()
                            {
                                if ( stop === true && bookingAttempts > 0 )
                                {
                                    failRun( 'Booking stopped' );
                                    return;
                                }
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
                                            statusNote = '';
                                            try
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
                                                    clickCount = 0;


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
                                                    if ( responses.data && responses.data.shareCode !== undefined )
                                                    {
                                                        shareCode = responses.data.shareCode;
                                                    }

                                                    save_game.push( {
                                                        odds: gamesBooked
                                                    } );
                                                    save_game.push( shareCode );
                                                    bookingSucceeded = true;

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
                                                    clickCount = 0;
                                                    click = true;
                                                    amounted = 0;
                                                    amounts = 0;
                                                    countTotal = 0;
                                                    label = false;
                                                }
                                                else
                                                {
                                                    if ( scheduleRebook() ) return false;
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
                                            }
                                            catch ( error )
                                            {
                                                console.error( error );
                                                if ( bookingSucceeded ) failRun( 'Booking code was created but could not be displayed' );
                                                else if ( !scheduleRebook() ) failRun( 'Unable to get booking code' );
                                            }
                                        },
                                    error:
                                        function ( response )
                                        {
                                            if ( scheduleRebook() ) return;
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
                            }
                            sendBooking();
                        }, 1 );
                    }
                }
            }
            async function doSomethingWithElement ( key, time, league )
            {
                const niceJson = await fetchGameWithRetry( key );
                if ( niceJson === null ) return; // skipped after repeated failures

                let calculatedJson = await predict( niceJson, gameType, selMethod ? selMethod.value : DEFAULT_METHOD )

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
                                    if ( predictedOutcome.market === "double" )
                                    {
                                        outcome = predictedOutcome.result ? "Home or Draw" : "Draw or Away";
                                        statement = outcome === "Home or Draw" ? `${homeT} to win or draw ${awayT}` : `${awayT} to win or draw ${homeT}`;
                                    }
                                    else
                                    {
                                        outcome = predictedOutcome.result ? "Home" : "Away";
                                        statement = outcome === "Home" ? `${homeT} to win ${awayT}` : `${awayT} to win ${homeT}`;
                                    }
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
            processElements().catch( ( error ) =>
            {
                console.error( error );
                failRun( 'The scan stopped unexpectedly, try again' );
            } );
        }
        ajax().catch( ( error ) => console.error( error ) ); // getGames already reset the UI
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
                //https://global.flashscore.ninja/50/x/feed/f_1_0_1_en_4
                const url = `https://api.webapps.com.ng/v2/sports/livescore.php?50&x&feed&f_${gameIndex}_${dateIndex}_1_en_4`;
                //const url = `https://d.livescore.in/x/feed/f_${gameIndex}_${dateIndex}_1_en_4`;

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

    // A failed match fetch is retried a few times, then the match is skipped so the scan keeps going.
    async function fetchGameWithRetry ( key )
    {
        for ( let attempt = 1; attempt <= MATCH_FETCH_ATTEMPTS; attempt++ )
        {
            try
            {
                const gameData = await sortGame( key );
                statusNote = '';
                return gameData;
            }
            catch ( error )
            {
                console.error( `Game ${key}, attempt ${attempt} failed:`, error );
                if ( stop === true || attempt === MATCH_FETCH_ATTEMPTS ) break;
                statusNote = `RETRYING GAME DATA... ATTEMPT ${attempt + 1} OF ${MATCH_FETCH_ATTEMPTS}`;
                updateProgressBar( amounted, amountOfBooking );
                await delay( MATCH_RETRY_DELAY_MS );
            }
        }
        statusNote = '';
        return null;
    }

    async function sortGame ( key )
    {   
        //const url = `https://d.livescore.in/x/feed/df_hh_4_${key}`;
        const url = `https://api.webapps.com.ng/v2/sports/loadteam.php?50&x&feed&df_hh_4_${key}`;

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
                    //console.log( line );
                    
                    if ( line.includes( 'Last matches' ) )
                    {
                        count += 1;
                    } else if ( line.match( /(\d+):(\d+)/ ) && count <= 2 )
                    {
                    
                        const [_, homeScore, awayScore] = line.match( /(\d+):(\d+)/ );
                        const awayTeam = lines[i - 4] || '';
                        const homeTeam = lines[i - 12] || '';
                        const dTime = lines[i - 34] || '';
                        const dTime2 = lines[i + 16] || '';
                        
                        const time100 = dTime.length === 10 ? dTime : ( dTime2.length === 10 ? dTime2 : null );
                        

                        if ( time100 > dateLimit && !/\b\w*\.png\w*\b/.test( homeTeam ) && !/\b\w*\.png\w*\b/.test( awayTeam ) )
                        {
                            hometeams.push( homeTeam );
                            awayteams.push( awayTeam );
                            homescores.push( homeScore );
                            awayscores.push( awayScore );
                            gameDate.push( time100 );

                           // console.log(homeTeam, awayTeam, homeScore, awayScore, time100);
                            
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


    // -----------------------------------------------------------------------
    // Prediction model v2 (deterministic, no randomness)
    //
    // Every signal is expressed as an expected goal margin (home minus away)
    // at a neutral venue. Signals are blended, home advantage is added back,
    // and the margin is converted into win / draw / loss probabilities.
    // A pick is made only when its probability clears the strictness threshold.
    // -----------------------------------------------------------------------
    const MODEL_VERSION = 2;
    const MAX_MATCHES_PER_TEAM = 20;      // older results say little about current form
    const RECENCY_TIER_SIZE = 5;          // matches per weight tier
    const RECENCY_TIER_WEIGHTS = [1.0, 0.7, 0.4, 0.15]; // latest 5, next 5, next 5, last 5
    const FORM_PRIOR_MATCHES = 3;         // pulls thin samples towards an average team
    const MIN_MATCHES_REQUIRED = 6;       // below this per team, no pick is made
    const MIN_VENUE_MATCHES_FOR_HFA = 3;  // home and away games needed to estimate home advantage
    const HFA_PRIOR_MATCHES = 20;         // shrinks the home advantage estimate towards zero
    const COMMON_OPPONENT_MAX_WEIGHT = 0.6;
    const COMMON_OPPONENT_PRIOR = 6;
    const HEAD2HEAD_MAX_WEIGHT = 0.4;
    const HEAD2HEAD_PRIOR = 8;
    const MIN_EXPECTED_GOALS_SHARE = 0.1; // keeps an expected-goals value from reaching zero
    const MIN_MARGIN_SPREAD = 0.5;
    const DEFAULT_METHOD = 'mix';         // 'goals', 'form' or 'mix' (mySelect7 in the HTML)
    const FORM_BLEND_WEIGHT = 0.3;        // share of the margin that comes from win/draw/loss form in 'mix'
    const DOWNGRADE_WINNER_TO_DOUBLE_CHANCE = true; // winner market only, sports that have draws
    const NO_PICK = { result: null, market: 'none' };
    const POISSON_SPORTS = ['football', 'icehockey', 'handball'];
    const POISSON_TAIL_SIGMAS = 6;
    // Starting values, not yet tuned against real results. Keyed by strictness select (1 lax, 2 moderate, 3 strict).
    const PICK_THRESHOLDS = {
        winner: { 1: 0.50, 2: 0.56, 3: 0.64 },
        double_chance: { 1: 0.70, 2: 0.75, 3: 0.82 },
        draw: { 1: 0.27, 2: 0.30, 3: 0.32 }
    };

    function mean ( values )
    {
        return values.length === 0 ? 0 : values.reduce( ( sum, value ) => sum + value, 0 ) / values.length;
    }

    function recencyWeight ( index )
    {
        const tier = Math.floor( index / RECENCY_TIER_SIZE );
        return RECENCY_TIER_WEIGHTS[Math.min( tier, RECENCY_TIER_WEIGHTS.length - 1 )];
    }

    function weightedMean ( values, weights, priorMean, priorWeight )
    {
        let weightSum = priorWeight;
        let total = priorMean * priorWeight;
        values.forEach( ( value, index ) =>
        {
            weightSum += weights[index];
            total += value * weights[index];
        } );
        return weightSum > 0 ? total / weightSum : priorMean;
    }

    function normalCdf ( z )
    {
        // Abramowitz-Stegun 26.2.17
        const t = 1 / ( 1 + 0.2316419 * Math.abs( z ) );
        const density = 0.3989423 * Math.exp( -z * z / 2 );
        const tail = density * t * ( 0.3193815 + t * ( -0.3565638 + t * ( 1.781478 + t * ( -1.821256 + t * 1.330274 ) ) ) );
        return z > 0 ? 1 - tail : tail;
    }

    function poissonPmf ( lambda, maxGoals )
    {
        const pmf = [Math.exp( -lambda )];
        for ( let goals = 1; goals <= maxGoals; goals++ )
        {
            pmf.push( pmf[goals - 1] * lambda / goals );
        }
        return pmf;
    }

    // Rebuilds each team's results as plain objects seen from that team's side.
    // Uses only the arrays produced by getTeams, which is left untouched.
    function collectMatches ( niceJson )
    {
        const { team1name, team2name } = niceJson.names;
        const { hometeams, awayteams, homescores, awayscores, gameDate } = niceJson;
        const team1 = [];
        const team2 = [];
        const headToHead = [];
        const seenHeadToHead = new Set();

        for ( let index = 0; index < hometeams.length; index++ )
        {
            const homeTeam = hometeams[index];
            const awayTeam = awayteams[index];
            const homeScore = Number( homescores[index] );
            const awayScore = Number( awayscores[index] );
            const date = Number( gameDate[index] );
            if ( !Number.isFinite( homeScore ) || !Number.isFinite( awayScore ) || !Number.isFinite( date ) ) continue;

            const fromHome = { goalsFor: homeScore, goalsAgainst: awayScore, venue: 'home', date };
            const fromAway = { goalsFor: awayScore, goalsAgainst: homeScore, venue: 'away', date };

            const isHeadToHead = ( homeTeam === team1name && awayTeam === team2name )
                || ( homeTeam === team2name && awayTeam === team1name );
            if ( isHeadToHead )
            {
                const dedupeKey = `${date}|${homeTeam}|${homeScore}|${awayScore}`;
                if ( seenHeadToHead.has( dedupeKey ) ) continue;
                seenHeadToHead.add( dedupeKey );
                headToHead.push( homeTeam === team1name ? { ...fromHome, opponent: team2name } : { ...fromAway, opponent: team2name } );
                continue;
            }

            if ( homeTeam === team1name ) team1.push( { ...fromHome, opponent: awayTeam } );
            else if ( awayTeam === team1name ) team1.push( { ...fromAway, opponent: homeTeam } );

            if ( homeTeam === team2name ) team2.push( { ...fromHome, opponent: awayTeam } );
            else if ( awayTeam === team2name ) team2.push( { ...fromAway, opponent: homeTeam } );
        }

        const newestFirst = ( a, b ) => b.date - a.date;
        return {
            team1: team1.sort( newestFirst ).slice( 0, MAX_MATCHES_PER_TEAM ),
            team2: team2.sort( newestFirst ).slice( 0, MAX_MATCHES_PER_TEAM ),
            headToHead: headToHead.sort( newestFirst )
        };
    }

    const goalDiff = ( match ) => match.goalsFor - match.goalsAgainst;

    // Win = 1, draw = 0, loss = -1. Venue is not adjusted: each team plays both home and away,
    // so the effect largely cancels when the two teams are compared.
    function teamResultForm ( matches )
    {
        const values = matches.map( ( match ) => Math.sign( goalDiff( match ) ) );
        const weights = matches.map( ( match, index ) => recencyWeight( index ) );
        return weightedMean( values, weights, 0, FORM_PRIOR_MATCHES );
    }

    // Converts result form into goal units using the typical margin of a decisive match.
    function resultFormScale ( matches )
    {
        const margins = matches.map( ( match ) => Math.abs( goalDiff( match ) ) ).filter( ( margin ) => margin > 0 );
        return margins.length === 0 ? 1 : mean( margins );
    }

    // Average extra goal margin a team earns by playing at home, pooled over both teams.
    function estimateHomeAdvantage ( teamLists )
    {
        let weightedSum = 0;
        let totalPairs = 0;
        teamLists.forEach( ( matches ) =>
        {
            const home = matches.filter( ( match ) => match.venue === 'home' ).map( goalDiff );
            const away = matches.filter( ( match ) => match.venue === 'away' ).map( goalDiff );
            if ( home.length < MIN_VENUE_MATCHES_FOR_HFA || away.length < MIN_VENUE_MATCHES_FOR_HFA ) return;
            const pairs = Math.min( home.length, away.length );
            weightedSum += ( ( mean( home ) - mean( away ) ) / 2 ) * pairs;
            totalPairs += pairs;
        } );
        if ( totalPairs === 0 ) return 0;
        return ( weightedSum / totalPairs ) * ( totalPairs / ( totalPairs + HFA_PRIOR_MATCHES ) );
    }

    // Goal difference with the venue effect removed, so home and away games compare fairly.
    function neutralGoalDiff ( match, homeAdvantage )
    {
        return goalDiff( match ) - ( match.venue === 'home' ? homeAdvantage : -homeAdvantage );
    }

    function teamStrength ( matches, homeAdvantage )
    {
        const values = matches.map( ( match ) => neutralGoalDiff( match, homeAdvantage ) );
        const weights = matches.map( ( match, index ) => recencyWeight( index ) );
        return weightedMean( values, weights, 0, FORM_PRIOR_MATCHES );
    }

    function teamTempo ( matches, fallbackTotal )
    {
        const totals = matches.map( ( match ) => match.goalsFor + match.goalsAgainst );
        const weights = matches.map( ( match, index ) => recencyWeight( index ) );
        return weightedMean( totals, weights, fallbackTotal, FORM_PRIOR_MATCHES );
    }

    // Compares both teams through opponents they have both played, which cancels out schedule strength.
    function commonOpponentMargin ( team1, team2, homeAdvantage )
    {
        const averageByOpponent = ( matches ) =>
        {
            const grouped = new Map();
            matches.forEach( ( match, index ) =>
            {
                const entry = grouped.get( match.opponent ) || { total: 0, weight: 0 };
                const weight = recencyWeight( index );
                entry.total += neutralGoalDiff( match, homeAdvantage ) * weight;
                entry.weight += weight;
                grouped.set( match.opponent, entry );
            } );
            return grouped;
        };

        const team1ByOpponent = averageByOpponent( team1 );
        const team2ByOpponent = averageByOpponent( team2 );
        const differences = [];
        team1ByOpponent.forEach( ( entry1, opponent ) =>
        {
            const entry2 = team2ByOpponent.get( opponent );
            if ( entry2 ) differences.push( entry1.total / entry1.weight - entry2.total / entry2.weight );
        } );
        return { margin: mean( differences ), count: differences.length };
    }

    function headToHeadMargin ( headToHead, homeAdvantage )
    {
        const values = headToHead.map( ( match ) => neutralGoalDiff( match, homeAdvantage ) );
        const weights = headToHead.map( ( match, index ) => recencyWeight( index ) );
        return { margin: weightedMean( values, weights, 0, 0 ), count: headToHead.length };
    }

    function poissonProbabilities ( lambdaHome, lambdaAway )
    {
        const maxLambda = Math.max( lambdaHome, lambdaAway );
        const maxGoals = Math.ceil( maxLambda + POISSON_TAIL_SIGMAS * Math.sqrt( maxLambda ) ) + 3;
        const homePmf = poissonPmf( lambdaHome, maxGoals );
        const awayPmf = poissonPmf( lambdaAway, maxGoals );
        let home = 0, draw = 0, away = 0;
        for ( let homeGoals = 0; homeGoals <= maxGoals; homeGoals++ )
        {
            for ( let awayGoals = 0; awayGoals <= maxGoals; awayGoals++ )
            {
                const probability = homePmf[homeGoals] * awayPmf[awayGoals];
                if ( homeGoals > awayGoals ) home += probability;
                else if ( homeGoals === awayGoals ) draw += probability;
                else away += probability;
            }
        }
        const total = home + draw + away;
        return { home: home / total, draw: draw / total, away: away / total };
    }

    function marginProbabilities ( expectedMargin, spread )
    {
        const home = normalCdf( expectedMargin / spread );
        return { home, draw: 0, away: 1 - home };
    }

    function predict ( niceJson, sport, method = DEFAULT_METHOD )
    {
        const { team1, team2, headToHead } = collectMatches( niceJson );
        const enoughData = team1.length >= MIN_MATCHES_REQUIRED && team2.length >= MIN_MATCHES_REQUIRED;
        if ( !enoughData )
        {
            return { enoughData, matches1: team1.length, matches2: team2.length };
        }

        const homeAdvantage = estimateHomeAdvantage( [team1, team2] );
        const formMargin = teamStrength( team1, homeAdvantage ) - teamStrength( team2, homeAdvantage );
        const common = commonOpponentMargin( team1, team2, homeAdvantage );
        const h2h = headToHeadMargin( headToHead, homeAdvantage );

        const commonWeight = COMMON_OPPONENT_MAX_WEIGHT * common.count / ( common.count + COMMON_OPPONENT_PRIOR );
        const h2hWeight = HEAD2HEAD_MAX_WEIGHT * h2h.count / ( h2h.count + HEAD2HEAD_PRIOR );
        const neutralMargin = ( formMargin + commonWeight * common.margin + h2hWeight * h2h.margin )
            / ( 1 + commonWeight + h2hWeight );
        const allMatches = [...team1, ...team2];
        const resultFormMargin = ( teamResultForm( team1 ) - teamResultForm( team2 ) ) * resultFormScale( allMatches );
        let blendedMargin;
        if ( method === 'goals' ) blendedMargin = neutralMargin;
        else if ( method === 'form' ) blendedMargin = resultFormMargin;
        else blendedMargin = ( 1 - FORM_BLEND_WEIGHT ) * neutralMargin + FORM_BLEND_WEIGHT * resultFormMargin;
        const expectedMargin = blendedMargin + homeAdvantage;

        const allTotals = [...team1, ...team2].map( ( match ) => match.goalsFor + match.goalsAgainst );
        const pooledTotal = mean( allTotals );
        const expectedTotal = ( teamTempo( team1, pooledTotal ) + teamTempo( team2, pooledTotal ) ) / 2;
        const minimumGoals = expectedTotal * MIN_EXPECTED_GOALS_SHARE;
        const expectedHomeGoals = Math.max( minimumGoals, ( expectedTotal + expectedMargin ) / 2 );
        const expectedAwayGoals = Math.max( minimumGoals, ( expectedTotal - expectedMargin ) / 2 );

        let probabilities;
        if ( POISSON_SPORTS.includes( sport ) )
        {
            probabilities = poissonProbabilities( expectedHomeGoals, expectedAwayGoals );
        }
        else
        {
            const spread = Math.max( MIN_MARGIN_SPREAD, standardDeviation( [...team1, ...team2].map( goalDiff ) ) );
            probabilities = marginProbabilities( expectedHomeGoals - expectedAwayGoals, spread );
        }

        return {
            enoughData,
            matches1: team1.length,
            matches2: team2.length,
            expectedHomeGoals,
            expectedAwayGoals,
            probabilities,
            goalsMargin: neutralMargin,
            formMargin: resultFormMargin,
            commonMargin: common.margin,
            headToHeadMargin: h2h.margin
        };
    }

    function standardDeviation ( values )
    {
        const average = mean( values );
        return Math.sqrt( mean( values.map( ( value ) => ( value - average ) ** 2 ) ) );
    }

    // result: true = home side of the market, false = away side, null = no pick.
    // market: 'win', 'double' or 'draw' (what was actually picked).
    function pickResult ( market, strictness, probabilities )
    {
        const threshold = PICK_THRESHOLDS[market]?.[strictness];
        if ( threshold === undefined ) return NO_PICK;
        const { home, draw, away } = probabilities;

        if ( market === 'winner' )
        {
            if ( home >= threshold && home > away ) return { result: true, market: 'win' };
            if ( away >= threshold && away > home ) return { result: false, market: 'win' };
            if ( DOWNGRADE_WINNER_TO_DOUBLE_CHANCE && draw > 0 )
            {
                const doubleThreshold = PICK_THRESHOLDS.double_chance[strictness];
                const homeOrDraw = home + draw;
                const drawOrAway = draw + away;
                if ( homeOrDraw >= doubleThreshold && homeOrDraw > drawOrAway ) return { result: true, market: 'double' };
                if ( drawOrAway >= doubleThreshold && drawOrAway > homeOrDraw ) return { result: false, market: 'double' };
            }
            return NO_PICK;
        }
        if ( market === 'double_chance' )
        {
            const homeOrDraw = home + draw;
            const drawOrAway = draw + away;
            if ( homeOrDraw >= threshold && homeOrDraw > drawOrAway ) return { result: true, market: 'double' };
            if ( drawOrAway >= threshold && drawOrAway > homeOrDraw ) return { result: false, market: 'double' };
            return NO_PICK;
        }
        if ( market === 'draw' ) return draw >= threshold ? { result: true, market: 'draw' } : NO_PICK;
        return NO_PICK;
    }

    function outcomes ( calculatedJson, matchJson )
    {
        const { team1name, team2name } = matchJson.names;
        const percent = ( probability ) => Math.round( probability * 100 );
        const rounded = ( value ) => Math.round( value * 100 ) / 100;

        const pick = calculatedJson.enoughData
            ? pickResult( selType.value, Number( selectElement.value ), calculatedJson.probabilities )
            : NO_PICK;

        const probabilities = calculatedJson.probabilities || { home: 0, draw: 0, away: 0 };
        const log = {
            model: MODEL_VERSION,
            team1: team1name,
            team2: team2name,
            score1: percent( probabilities.home ),            // win probability %
            score2: percent( probabilities.away ),
            sum1: rounded( calculatedJson.expectedHomeGoals || 0 ), // expected goals
            sum2: rounded( calculatedJson.expectedAwayGoals || 0 ),
            master: rounded( calculatedJson.commonMargin || 0 ),    // common-opponent margin
            head2head: rounded( calculatedJson.headToHeadMargin || 0 ),
            formGoals: rounded( calculatedJson.goalsMargin || 0 ),
            formResults: rounded( calculatedJson.formMargin || 0 ),
            draw: percent( probabilities.draw ),
            games1: calculatedJson.matches1,
            games2: calculatedJson.matches2,
            result: pick.result,
            market: pick.market
        };

        calculatedJson.result = pick.result;
        return log;
    }
};

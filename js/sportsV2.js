if (window.onload) {
    myFunction();
} else {
    $(document).ready(myFunction);
}

function myFunction() {
    const selOdds = document.getElementById('mySelect5');
    for (let tenths = 11; tenths <= 41; tenths++) {
        const odd = (tenths / 10).toFixed(1); // whole-number steps avoid floating-point drift
        const option = document.createElement('option');
        option.value = odd;
        option.text = 'Less than ' + odd + ' Odds';
        selOdds.appendChild(option);
    }

    const selType = document.getElementById('mySelect6');
    function updateOptions(selectElement) {
        selType.innerHTML = ''; // Clear existing options

        if (selectElement.value == 'football' || selectElement.value == 'icehockey' || selectElement.value == 'handball') {
            const option_1 = document.createElement('option');
            option_1.value = 'winner';
            option_1.text = 'Winner';
            selType.appendChild(option_1);

            const option_2 = document.createElement('option');
            option_2.value = 'double_chance';
            option_2.text = 'Double Chance';
            selType.appendChild(option_2);

            const option_3 = document.createElement('option');
            option_3.value = 'draw';
            option_3.text = 'Draws';
            selType.appendChild(option_3);
        }
        else {
            const option = document.createElement('option');
            option.value = 'winner';
            option.text = 'Winner';
            selType.appendChild(option);
        }
    }
    document.getElementById('mySelect4').addEventListener('change', function () {
        updateOptions(this);
    });

    updateOptions(document.getElementById('mySelect4'));

    const bell = document.querySelector('.fa-refresh');
    const count = document.querySelector('.count');
    const notification = document.querySelector('.notify-text');
    const result = document.getElementById('result');

    let allData = [];
    let sug;
    let reload = false;
    let clickCount = 0;

    [bell, count].forEach((element) => {
        element.addEventListener('click', () => {
            if (reload === false) {
                clickCount++;
                reload = true;
                (async () => {
                    if (result.innerHTML === '' || result.innerHTML.length > 37) sug = result.innerHTML;
                    result.style.textAlign = 'center';
                    result.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';

                    try {
                        if (Object.values(allData).length > 0 && clickCount > 5) {
                            allData = [];
                            clickCount = 0;
                        }

                        if (Object.values(allData).length == 0) {
                            allData = await manageGame("get", null, null);
                        }

                        if (reload === true) {
                            result.innerHTML = null;
                            result.style.textAlign = 'left';

                            const input = document.createElement('input');
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

                            result.appendChild(input);

                            const scroll = document.createElement('div');
                            scroll.id = "scroll";

                            const datalist = document.createElement('datalist')
                            datalist.id = "game";
                            input.setAttribute('list', 'game');

                            scroll.appendChild(datalist);
                            result.appendChild(scroll);

                            Object.entries(allData).forEach(([key, subArrays]) => {
                                const gameDiv = document.createElement("option");
                                gameDiv.id = 'gamediv';
                                gameDiv.value = subArrays[subArrays.length - 1];
                                gameDiv.textContent = subArrays[subArrays.length - 1] + ` expires ${formatTime(key)} `;
                                datalist.appendChild(gameDiv);

                                subArrays.forEach((item, index) => {
                                    if (item.log) {
                                        gameDiv.dataset[`teamA${index}`] = item.log.team1;
                                        gameDiv.dataset[`teamB${index}`] = item.log.team2;
                                    }
                                });
                                gameDiv.dataset[`identifier`] = subArrays[subArrays.length - 1];


                                gameDiv.onclick = function () {
                                    searchText.value = input.value;
                                    input.value = gameDiv.value;
                                    result.style.textAlign = 'left';
                                    reload = false;

                                    datalist.style.display = 'none';

                                    Object.keys(allData).forEach(key => {
                                        const array = allData[key]

                                        if (array[array.length - 1] === gameDiv.value) {
                                            generateResults(array);

                                            $(notification).toggle('500');
                                            toggleBlur();
                                            searchAndScroll();
                                        }
                                    });
                                }
                            });

                            ['input', 'click'].forEach(eventType => {
                                input.addEventListener(eventType, () => {
                                    datalist.style.display = 'block';

                                    for (let option of datalist.options) {
                                        let shouldDisplay = false;

                                        if (option.value.toUpperCase().indexOf(input.value.toUpperCase()) > -1) {
                                            shouldDisplay = true;
                                        }
                                        else {
                                            Object.keys(option.dataset).forEach(key => {
                                                if (option.dataset[key].toUpperCase().indexOf(input.value.toUpperCase()) > -1) {
                                                    shouldDisplay = true;
                                                }
                                            });
                                        }
                                        option.style.display = shouldDisplay ? 'block' : 'none';

                                        option.style.backgroundColor = '';
                                        option.style.color = '';

                                        if (input.value.toUpperCase() == option.value.toUpperCase()) {
                                            option.style.backgroundColor = 'green';
                                            option.style.color = 'white';
                                            option.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                                        }
                                    }
                                })
                            });
                        }
                    } catch (error) {
                        if (reload) result.innerHTML = "<p id='error' style='padding: 5px; font-size: 11px;'>A network error has occurred, try again!</p>";
                        reload = false;
                    }
                })();
            }
            else {
                reload = false;
                result.style.textAlign = 'left';
                result.innerHTML = sug;
            }
        });
    });

    var click = true;
    var amountOfBooking;
    var stop = false;
    var times;
    const clear = document.getElementById('clear');
    clear.addEventListener('click', () => {
        if (click === true) {
            result.innerHTML = '';
            results = "";
            liveScoreRun++; // stops the live-score loop
            if (liveScoreInterval) {
                clearInterval(liveScoreInterval);
            }
        }
        if (click === false) {
            amountOfBooking = times + 1;
            stop = true;
            clear.innerHTML = 'Stopping   <i class="fa fa-spinner fa-spin"></i>';
        }
    });

    function parseLine(words) {
        let values = {
            currenttime: null,
            starttime: null,
            home: null,
            away: null,
            live: false
        };

        for (let i = 0; i < words.length; i++) {
            if (words[i] === "DD") {
                values.currenttime = Number(words[i + 1]); // Value after "DD"
            } else if (words[i] === "DC") {
                values.starttime = Number(words[i + 1]); // Value after "DC"
            } else if (words[i] === "DG") {
                values.home = Number(words[i + 1]); // Value after "DE"
            } else if (words[i] === "DH") {
                values.away = Number(words[i + 1]); // Value after "DF"
            } else if (words[i] === "DI") {
                if (words[i + 1] !== "-1") {
                    //alert("Live score feed is not available for this game. Please check the official website for live updates.");
                    values.live = true;
                }
            }
        }

        return values;
    }

    async function checkLiveScores(key) {
        //const url = `https://global.flashscore.ninja/50/x/feed/dc_4_${key}`;
        const url = `https://api.webapps.com.ng/v2/sports/livefeed.php?50&x&feed&dc_4_${key}`;
        let retries = 1;

        while (retries > 0) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);
            try {
                const response = await fetch(url,
                    {
                        method: 'GET',
                        headers: { "x-fsign": "SW9D1eZo" },
                        signal: controller.signal
                    });

                if (response.ok) {
                    const matches = await response.text();
                    const lines = matches.replace(/¬/g, '÷').split('÷');
                    return parseLine(lines);
                }
            }
            catch (error) {
                console.error(error);
            }
            finally {
                clearTimeout(timeoutId);
            }
            retries--;
            await new Promise((resolve) => setTimeout(resolve, 3000));
        }
        return "Not started";
    }

    function formatTime(timestamp) {
        let isoString = false;
        if (!/^\d{10}$/.test(timestamp)) {
            isoString = true;
            //timestamp = Math.floor( new Date( timestamp ).getTime() / 1000 );
            let tempDate = new Date(timestamp);
            tempDate.setDate(tempDate.getDate() + 1); // Increase the date by 1
            timestamp = Math.floor(tempDate.getTime() / 1000);
        }
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const currentDateTime = new Date(currentTimestamp * 1000);
        const nextDateTime = new Date(timestamp * 1000);

        const currentDate = currentDateTime.toISOString().split('T')[0];
        const nextDate = nextDateTime.toISOString().split('T')[0];

        let date;
        const timeOptions = { hour: '2-digit', minute: '2-digit' }; // Options for time formatting

        if (currentDate === nextDate) {
            // If the dates match, return "Today" with the formatted time
            const formattedTime = nextDateTime.toLocaleTimeString(undefined, timeOptions);
            date = `Today : ${formattedTime}`;
        }
        else {
            // If the dates don't match, format the full date and time
            let dayOptions = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }; // Short date format
            if (isoString) dayOptions = { weekday: 'short', month: 'short', day: 'numeric' }
            const formattedDate = nextDateTime.toLocaleDateString(undefined, dayOptions);
            const formattedTime = nextDateTime.toLocaleTimeString(undefined, timeOptions);
            date = `${formattedDate}: ${formattedTime}`;
        }
        return date;
    }

    let liveScoreInterval;
    let liveScoreRun = 0;   // each displayed list gets a new id; an older loop stops when its id is stale

    // Shows one game's live score with a check, cross or spinner, coloured by whether the
    // pick is currently winning, drawing or losing. Used by both the first display and the
    // polling loop, so the logic lives in exactly one place.
    function renderLiveScore(scoreElement, liveScores, text, item) {
        const winOrDraw = /win\s+or\s+draw/i.test(item.game.statement);
        const justDraw = /(?<!win\s+or\s+)draw/i.test(item.game.statement);
        const homeSideWins = (liveScores.home > liveScores.away && item.log.result) || (liveScores.home < liveScores.away && !item.log.result);
        const drawn = liveScores.home == liveScores.away;
        const correct = winOrDraw ? (homeSideWins || drawn) : justDraw ? drawn : homeSideWins;
        scoreElement.innerHTML = (liveScores.live)
            ? `${text} <i class="fa fa-spinner fa-spin" style="${correct ? 'color:#1dda13;' : 'color:red;'}"></i>`
            : (correct
                ? `${text} <i class="fa fa-check" style="color:#1dda13;"></i>`
                : `${text} <i class="fa fa-times" style="color:red;"></i>`);
    }

    async function generateResults(array) {
        const odds = array.find(item => item.odds)?.odds;
        const oddsLength = odds ? Object.keys(odds).length : 0;
        const key = array[array.length - 1];
        let calcOdds = 1;
        let number = 0;

        let results = '';
        let notStart = false;
        let hold = [];
        const firstChecks = [];   // the first live-score request of every game

        const validGames = array.filter(item => item.game && item.log && odds?.[item.game.num]); // Only process items with functional gameOdds
        // Order the display by the user's chosen sort. The booking's game number and odds are
        // untouched; only the order shown and the 1,2,3... numbering follow the sort.
        const sortOrder = (document.getElementById('sortOrder') || {}).value;
        if (sortOrder === 'time') {
            validGames.sort((a, b) => Number(a.game.time) - Number(b.game.time));      // soonest kick-off first
        } else if (sortOrder === 'odds') {
            validGames.sort((a, b) => (odds[a.game.num] || Infinity) - (odds[b.game.num] || Infinity)); // lowest odds first
        }
        validGames.forEach((item, index) => {
            if (item.game && item.log) {
                const gameOdds = odds[item.game.num];
                let display = gameOdds ? 'block' : 'none';
                if (gameOdds) number++;
                calcOdds *= gameOdds || 1;

                results += `
                    <div class="hover" id="${item.game.num}" style="display: ${display}; z-index: 1;">
                    ${number}. Odd: ${gameOdds}<br>
                    ${formatTime(item.game.time)}<br>
                    ${item.game.league}<br>
                    ${item.game.statement}<br>
                    Livescores: <span id="score-${item.game.key}">Loading...</span><br>
                    <a href="https://www.livescore.in/match/${item.game.key}/#/h2h/overall" target="_blank"><button style="z-index: 9999;" class="link">Link</button></a>                    
                    <br><p id='success'></p>
                </div>`;
                firstChecks.push((async () => {
                    let liveScores = await checkLiveScores(item.game.key);

                    let text = `${liveScores.home}:${liveScores.away}`;
                    // If the result is false and home score is greater than away score, reverse the score
                    if (!item.log.result) {
                        text = `${liveScores.away}:${liveScores.home}`;
                    }

                    // Get the result element (assumed it has the ID format 'score-[gameKey]')
                    const scoreElement = document.getElementById(`score-${item.game.key}`);

                    if (liveScores.currenttime < item.game.time || (liveScores.home == null && liveScores.away == null)) {
                        scoreElement.innerText = "Not yet started";
                        hold.push(item);
                        notStart = true;
                    }
                    else {
                        renderLiveScore(scoreElement, liveScores, text, item);
                    }
                    if (liveScores.live) notStart = true, hold.push(item);
                })());
            }
        });

        const addon = `<a href="https://www.sportybet.com?shareCode=${key}&c=ng" target="_blank">
                        <button style="float:right; background-color: orange;" class="links">Play</button></a>`;
        // Shown only once every game of this result has been played in full (see updateDeleteButton).
        const deleteHtml = (typeof key === 'string' && key !== '')
            ? `<button id="delete-saved" style="display:jnone; float:right; background-color: #c0392b;" class="links">Delete</button>` : '';
        const data = `Sportybet Code: ${key}<br>
                        Games Booked: ${oddsLength}<br>
                        Total odds: ${calcOdds.toFixed(2)} ${addon}${deleteHtml}`;
        results += `<p id='success' style='padding: 5px; margin-right: 0px; font-size: 10px'>${data}</p>`;

        result.innerHTML = results;

        const deleteButton = document.getElementById('delete-saved');
        // Delete is offered only when no game is waiting or live (hold is empty) AND every game
        // started at least MIN_HOURS_AFTER_KICKOFF hours ago. The second check protects against a live game being read as finished.
        function updateDeleteButton() {
            if (deleteButton) return;
            const startedBefore = Date.now() / 1000 - MIN_HOURS_AFTER_KICKOFF * 3600;
            const allPlayed = validGames.length > 0 && hold.length === 0 && validGames.every((item) => Number(item.game.time) <= startedBefore);
            deleteButton.style.display = allPlayed ? 'inline-block' : 'none';
        }
        if (deleteButton) {
            deleteButton.onclick = async () => {
                if (!window.confirm(`Delete this saved result (${key})?\nAll ${validGames.length} of its games have been played. This cannot be undone.`)) return;
                deleteButton.disabled = true;
                deleteButton.innerText = 'Deleting...';
                let removed = false;
                try { removed = await manageGame("delete", null, key); } catch (error) { console.error(error); }
                if (removed) {
                    liveScoreRun++; // stops the live-score loop of this result
                    allData = [];   // the saved list is read again next time
                    result.style.textAlign = 'left';
                    result.innerHTML = "<p id='success' style='padding: 5px'>Result deleted.</p>";
                }
                else {
                    deleteButton.disabled = false;
                    deleteButton.innerText = 'Delete';
                    window.alert('Could not delete this result, try again.');
                }
            };
        }

        async function updateLiveScores() {
            notStart = false
            const validGames = [...new Set(hold)].filter(item => item.game && item.log && odds?.[item.game.num]); // Only process items with functional gameOdds
            const nextHold = []; // becomes the new hold only after every request below has finished

            await Promise.all(validGames.map(async (item) => {
                if (item.game && item.log) {
                    let liveScores = await checkLiveScores(item.game.key);

                    let text = `${liveScores.home}:${liveScores.away}`;
                    if (!item.log.result) {
                        text = `${liveScores.away}:${liveScores.home}`;
                    }

                    // Get the result element (assumed it has the ID format 'score-[gameKey]')
                    const scoreElement = document.getElementById(`score-${item.game.key}`);
                    if (scoreElement) {
                        if (
                            liveScores.currenttime < item.game.time ||
                            liveScores.home == null &&
                            liveScores.away == null
                        ) {
                            scoreElement.innerText = "Not yet started";
                            notStart = true;
                            nextHold.push(item)
                        } else {
                            renderLiveScore(scoreElement, liveScores, text, item);
                        }
                        if (liveScores.live) notStart = true, nextHold.push(item);
                    }
                }
            }));

            return nextHold;
        }

        // One polling loop per displayed list (a newer list or the Clear button makes this one stale).
        // A round re-checks every game still in `hold`. The next round starts only when BOTH are true:
        //   1. every request of the current round has finished, and
        //   2. 20 seconds have passed since that round started.
        // `hold` is replaced only at that moment, so rounds never overlap.
        const runId = ++liveScoreRun;
        Promise.allSettled(firstChecks).then(() => { if (runId === liveScoreRun) updateDeleteButton(); });
        (async () => {
            // first round: wait for the initial request of every game and for 20 seconds
            await Promise.allSettled([...firstChecks, delay(20000)]);

            while (runId === liveScoreRun && hold.length > 0 && hold.some(item => document.getElementById(`score-${item.game.key}`))) {
                const [nextHold] = await Promise.all([updateLiveScores(), delay(20000)]);
                if (runId !== liveScoreRun) return;
                hold = nextHold;
                updateDeleteButton();
            }
        })().catch((error) => console.error(error));

        return results;
    }

    async function manageGame(action, datas = null, lastValue = null) {
        let data = datas;
        let filteredData;
        if (data) {
            const oddsObject = data.find((item) => item.odds);
            const odds = Object.keys(oddsObject?.odds || {}).map(Number);
            const result = data.filter((item) => item.game && odds.includes(item.game.num));
            const lastKey = data.find((item) => typeof item === "string");

            result.push({ odds: oddsObject?.odds });
            result.push(lastKey);
            filteredData = result;
        }

        const apiUrl = "https://github.webapps.com.ng/paste.php";
        const pin = "3728"; // Pin for secure access

        // Fetch saved data using jQuery AJAX
        // strict is used before a save or delete: anything other than a clean answer is an error, never "empty",
        // because writing back after a bad read would erase every saved result.
        async function fetchData(strict = false) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: `${apiUrl}?saved`,
                    method: "GET",
                    dataType: "json",
                    timeout: 8000,
                    success: function (response) {
                        try {
                            if (response.Status === "200" && response.data.trim() !== "") {
                                resolve(JSON.parse(response.data)); // return the promise with the decoded data
                            }
                            else if (strict && response.Status !== "200") {
                                reject(new Error("Saved results could not be read, Status " + response.Status));
                            }
                            else {
                                resolve({}); // return with an empty object for invalid/empty data
                            }
                        }
                        catch (error) {
                            reject(error);
                        }
                    },
                    error: function (error) {
                        reject(error);
                    },
                });
            });
        };


        // Save data using jQuery AJAX
        async function saveData(payload) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: apiUrl,
                    method: "POST",
                    data: {
                        save: JSON.stringify(payload),
                        pin: pin,
                    },
                    dataType: 'json',
                    timeout: 8000,
                    success: function (response) {
                        resolve(response); // Resolve the promise with the decoded data
                    },
                    error: function (error) {
                        reject(error);
                    },
                });
            });
        };

        const now = new Date();

        // Saving and deleting read the whole store, change it and write it all back. They run one at a time,
        // and after writing the store is read again; if the change is not there (another tab wrote in between) it is redone.
        async function changeStore(change) {
            const previous = storeLock;
            let release;
            storeLock = new Promise((resolve) => { release = resolve; });
            await previous;
            try {
                let lastError = null;
                for (let attempt = 1; attempt <= STORE_ATTEMPTS; attempt++) {
                    try {
                        const stored = await fetchData(true);
                        const outcome = change(stored);
                        if (outcome.done !== undefined) return outcome.done;
                        await saveData(stored);
                        const check = await fetchData(true);
                        if (outcome.verify(check)) return true;
                        lastError = new Error("The change was not found after saving");
                    }
                    catch (error) {
                        lastError = error;
                    }
                    console.error(`Saved results, attempt ${attempt} failed:`, lastError);
                    if (attempt < STORE_ATTEMPTS) await delay(STORE_RETRY_DELAY_MS);
                }
                return false;
            }
            finally {
                release();
            }
        }

        // Perform actions
        if (action === "save") {
            if (!filteredData) return false;
            const code = filteredData[filteredData.length - 1];
            const times = filteredData
                .filter(item => item.game && item.game.time) // Filter only objects with a 'game' and 'time'
                .map(item => parseInt(item.game.time, 10)); // Extract the time values and convert to integers
            if (times.length === 0) return false;

            const largestTime = Math.max(...times); // Find the largest time
            const adjustedTime = new Date((largestTime + 3600) * 1000); // Add 1 hour to adjust for Lagos time
            const sameCode = (sub) => Array.isArray(sub) && sub[sub.length - 1] === code;

            return await changeStore((stored) => {
                if (typeof code === "string" && code !== "" && Object.values(stored).some(sameCode)) {
                    return { done: true }; // this booking is already saved
                }
                // Two bookings can end with the same last kick-off. A key is never reused, or the older booking would be replaced.
                let isoString = adjustedTime.toISOString();
                for (let bump = 1; stored[isoString] !== undefined; bump++) {
                    isoString = new Date(adjustedTime.getTime() + bump).toISOString();
                }
                stored[isoString] = filteredData;
                return { verify: (check) => Array.isArray(check[isoString]) && check[isoString].length === filteredData.length };
            });
        }
        else if (action === "get") {
            let storedData = await fetchData();

            if (storedData) {
                const currentDate = new Date();

                Object.keys(storedData).forEach((key) => {
                    const savedDate = new Date(key);

                    // Check if the saved date is more than one day older than the current date
                    const differenceInTime = currentDate - savedDate; // Difference in milliseconds
                    const differenceInDays = differenceInTime / (24 * 60 * 60 * 1000); // Convert to days

                    if (differenceInDays > 1) {
                        //delete storedData[key];
                    }
                });

                return storedData; // reading never writes: a read followed by a write could erase a result saved in between
            }
        }
        else if (action === "delete") {
            const code = lastValue; // the booking code of the result to remove
            if (typeof code !== "string" || code === "") return false;
            const hasCode = (sub) => Array.isArray(sub) && sub[sub.length - 1] === code;

            return await changeStore((stored) => {
                const keys = Object.keys(stored).filter((key) => hasCode(stored[key]));
                if (keys.length === 0) return { done: true }; // already gone
                keys.forEach((key) => delete stored[key]);
                return { verify: (check) => !Object.values(check).some(hasCode) };
            });
        }
    }


    const button = document.getElementById('button');
    button.addEventListener('click', () => {
        if (click === false) { return false; }
        totalGames = 0;
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
    var totalGames = 0;                   // every game listed for the chosen sport and day
    var results = '';
    var visited = [];
    var label = false;
    var save_game = [];
    var statusNote = '';                  // retry / rebooking message shown under the progress bar
    const MIN_CONCURRENT_SCANS = 4;       // games fetched at the same time: a random number in this range,
    const MAX_CONCURRENT_SCANS = 10;      // re-rolled every time a scan finishes
    const SCAN_MULTIPLIER = 3;            // scan up to this many times the games the user asked for
    const PICK_GOAL_MULTIPLIER = 1.5;     // stop scanning once this many times the games asked for have a pick
    var wantedGames = 0;                  // how many games the user asked to book
    var scannedGames = 0;                 // games scanned so far in this search, across rounds
    var scanFinished = 0;                 // the "Scanning n" counter on the status page
    var trimmed = false;                  // true once the extra picks were cut down to wantedGames
    var pickConfidence = {};              // game key -> probability of the pick, used to choose which picks to keep
    var scanActive = false;               // true only while games are being scanned
    var retryingGames = 0;                // games whose data fetch is being retried right now
    const randomWindowSize = () => MIN_CONCURRENT_SCANS + Math.floor(Math.random() * (MAX_CONCURRENT_SCANS - MIN_CONCURRENT_SCANS + 1));
    const REBOOK_DELAY_MS = 3000;         // wait between booking attempts
    const MATCH_FETCH_ATTEMPTS = 5;       // tries per match before it is skipped
    const FEED_FETCH_ATTEMPTS = 5;        // tries for the list of games before giving up
    const FEED_RETRY_DELAY_MS = 2000;
    const FEED_UTC_OFFSET_HOURS = 1;      // the feed's days change at midnight in this timezone (the 1 in f_<sport>_<day>_1_en_4)
    let runDay = null;                    // the calendar day the user asked for, kept for the whole run
    const STORE_ATTEMPTS = 5;             // tries to read/save/delete in the saved results
    const STORE_RETRY_DELAY_MS = 1500;
    let storeLock = Promise.resolve();    // saving and deleting run one at a time
    const MIN_HOURS_AFTER_KICKOFF = 3;    // a result can only be deleted once every game started at least this long ago
    const MATCH_RETRY_DELAY_MS = 2000;
    const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
    const statusLine = () => (statusNote ? '<br>' + statusNote : '');
    // The booking worked, only the copy in the saved list could not be stored.
    function saveFailed() {
        if (result.innerHTML.includes('Sportybet booking code')) {
            result.insertAdjacentHTML('beforeend', "<p id='error' style='padding: 5px; font-size: 11px;'>This result could not be saved to your saved list, but the booking code above is valid.</p>");
        }
    }
    const statusLines = () => 'TOTAL AVAILABLE GAMES : ' + (totalGames > 0 ? totalGames : '...')
        + '<br>SCANNING ' + scanFinished + '<br>BOOKED : ' + amounts + statusLine();

    // The arguments are ignored; they are kept so the existing call sites do not change.
    function updateProgressBar() {
        if (label === false) {
            document.getElementById('result').innerHTML = '<div id="status" style="width: 100%; text-align: center;"><div style="width: 100%;"><div id="progress-bar"></div></div><p id="report" style="padding: 10px;">' + statusLines() + '</p></div>';
            label = true;
        }
        const progressBar = document.getElementById('progress-bar');
        const report = document.getElementById('report');
        if (!progressBar || !report) return;
        const scanBudget = Math.max(1, Math.min(Number(amountOfBooking), totalGames || Number(amountOfBooking)));
        const pickGoal = Math.max(1, Math.ceil(wantedGames * PICK_GOAL_MULTIPLIER));
        const fraction = Math.min(1, Math.max(scanFinished / scanBudget, Object.keys(dataKing).length / pickGoal));
        setTimeout(() => {
            progressBar.style.width = `${fraction * 100}%`;
            report.innerHTML = statusLines();
        }, 10);
    }
    var ok = 0;

    // Clears the shared run state every error / stop path uses. Kept in one place so the
    // near-identical reset blocks don't drift out of sync.
    function resetRunState() {
        Object.keys(dataKing).forEach((key) => delete dataKing[key]);
        visited.splice(0, visited.length);
        save_game.splice(0, save_game.length);
        button.innerHTML = "Search";
        clear.innerHTML = "Clear";
        click = true;
        label = false;
        amounted = 0;
        amounts = 0;
        countTotal = 0;
    }

    const selectElement = document.getElementById("mySelect");
    const selectElement2 = document.getElementById('mySelect2');
    const selectElement3 = document.getElementById('mySelect3');
    const selectElement4 = document.getElementById('mySelect4');
    const selMethod = document.getElementById('mySelect7'); // absent in older HTML, then DEFAULT_METHOD is used
    function analyse(selEle, timer) {
        if (selEle === false) {
            // A fresh search. The scan budget is larger than what the user asked for, because not every
            // game makes the cut; the extra picks are trimmed after booking.
            wantedGames = Number(selectElement2.value);
            amountOfBooking = Math.ceil(wantedGames * SCAN_MULTIPLIER);
            scannedGames = 0;
            scanFinished = 0;
            retryingGames = 0;
            trimmed = false;
            pickConfidence = {};
        }
        else {
            amountOfBooking = selEle;
        }
        var gameTime = selectElement3.value;
        var gameType = selectElement4.value;
        // "today" and "tomorrow" change meaning at midnight, so the run remembers WHICH day was asked for.
        // Every request for the list of games turns that day back into an offset from the date it is right now.
        const feedDay = (seconds) => Math.floor((seconds + FEED_UTC_OFFSET_HOURS * 3600) / 86400);
        const dayOffsets = { "today": 0, "tomorrow": 1, "next-tomorrow": 2 };
        const knownDay = dayOffsets.hasOwnProperty(gameTime);
        if (knownDay && (selEle === false || runDay === null)) runDay = feedDay(Date.now() / 1000) + dayOffsets[gameTime];
        button.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
        times = timer;
        var book = false;
        var bypass = false;
        updateProgressBar(amounted, amountOfBooking);
        var amountOfBooking2;

        // Shared reset for a run that cannot continue.
        function failRun(message) {
            results += `<p id='error' style='padding: 5px'>${message}</p>`;
            book = true;
            resetRunState();
            result.innerHTML = results;
            results = "";
            statusNote = '';
        }

        // Sends the booking. It is repeated every few seconds until it works or the user presses Stop.
        function bookNow() {
            times += 1;
            updateProgressBar(amounted, amountOfBooking);
            setTimeout(() => {
                let bookingAttempts = 0;
                let bookingSucceeded = false; // once true, a failure afterwards must not trigger a second booking

                // Returns true when another attempt is scheduled; false once the user pressed Stop.
                function scheduleRebook() {
                    if (stop === true) return false;
                    bookingAttempts++;
                    statusNote = `REBOOKING... ATTEMPT ${bookingAttempts}`;
                    updateProgressBar(amounted, amountOfBooking);
                    setTimeout(sendBooking, REBOOK_DELAY_MS);
                    return true;
                }

                function sendBooking() {
                    if (stop === true && bookingAttempts > 0) {
                        failRun('Booking stopped');
                        return;
                    }
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
                                async function (responses) {
                                    statusNote = '';
                                    try {
                                        var message = responses.message;
                                        var innerMsg = responses.innerMsg;
                                        if (message == "Success" || innerMsg == "Invalid" || (innerMsg == "selections can not be null or empty" && amountOfBooking2 != amountOfBooking)) {
                                            var odds = responses.totalOdds;
                                            var total = responses.count;
                                            var gamesBooked = responses.gamesBooked;
                                            var debug = responses.debug;
                                            amounts = total;
                                            clickCount = 0;


                                            Object.keys(dataKing).forEach(function (key) {
                                                if (!debug.includes(dataKing[key].key)) {
                                                    delete dataKing[key];
                                                }
                                            });

                                            // More games survived than the user asked for: keep the most confident ones and book again.
                                            if (!trimmed && total > wantedGames) {
                                                trimmed = true;
                                                amounts = 0;
                                                Object.keys(dataKing)
                                                    .sort((first, second) => (pickConfidence[dataKing[second].key] || 0) - (pickConfidence[dataKing[first].key] || 0))
                                                    .slice(wantedGames)
                                                    .forEach((gameKey) => delete dataKing[gameKey]);
                                                statusNote = `KEEPING THE BEST ${wantedGames} GAMES`;
                                                bookNow();
                                                return false;
                                            }

                                            // Fewer games survived than the user asked for: scan more and book again.
                                            if (total < wantedGames && book === false && bypass === false && stop === false && scannedGames < totalGames) {
                                                trimmed = false;
                                                const additionalScans = Math.ceil((wantedGames - total) * SCAN_MULTIPLIER);
                                                analyse(scannedGames + additionalScans, scannedGames);
                                                return false;
                                            }
                                            else if (responses.count == 0 && bypass === false) {
                                                results += "<p id='error' style='padding: 5px'>Unable to get booking code</p>";
                                                book = true;
                                                resetRunState();
                                                result.innerHTML = results;
                                                results = "";
                                                return false;
                                            }

                                            updateProgressBar(amounted, amountOfBooking);
                                            selectv2 = null;
                                            var shareCode = null;
                                            if (responses.data && responses.data.shareCode !== undefined) {
                                                shareCode = responses.data.shareCode;
                                            }

                                            save_game.push({
                                                odds: gamesBooked
                                            });
                                            save_game.push(shareCode);
                                            bookingSucceeded = true;

                                            generateResults(save_game);
                                            manageGame("save", save_game).then((saved) => {
                                                if (saved === false) saveFailed();
                                            }).catch((error) => {
                                                console.error(error);
                                                saveFailed();
                                            });

                                            setTimeout(() => {
                                                save_game.splice(0, save_game.length);
                                                Object.keys(dataKing).forEach(function (key) {
                                                    delete dataKing[key];
                                                });
                                                visited.splice(0, visited.length);
                                            }, 5000);

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
                                        else {
                                            if (scheduleRebook()) return false;
                                            results += "<p id='error' style='padding: 5px'>Unable to get booking code</p>";
                                            book = true;
                                            resetRunState();
                                            result.innerHTML = results;
                                            results = "";
                                        }
                                    }
                                    catch (error) {
                                        console.error(error);
                                        if (bookingSucceeded) failRun('Booking code was created but could not be displayed');
                                        else if (!scheduleRebook()) failRun('Unable to get booking code');
                                    }
                                },
                            error:
                                function (response) {
                                    if (scheduleRebook()) return;
                                    results += "<p id='error' style='padding: 5px'>unable to get booking code</p>";
                                    book = true;
                                    resetRunState();
                                    result.innerHTML = results;
                                    results = "";
                                }
                        });
                }
                sendBooking();
            }, 1);
        }

        async function ajax() {
            var response = await getGames(gameType, knownDay ? runDay - feedDay(Date.now() / 1000) : gameTime, selEle !== false);
            if (typeof response === 'string' && response.startsWith('NO GAMES')) {
                // A first search: getGames has already shown the message. A later round, for example after midnight when every
                // game of the chosen day has started: book the games the earlier rounds found instead of throwing them away.
                if (selEle !== false && Object.keys(dataKing).length > 0) {
                    statusNote = 'NO MORE GAMES ON THE CHOSEN DAY, BOOKING THE ONES ALREADY FOUND';
                    book = true;
                    times = amountOfBooking;
                    amounted = times;
                    bookNow();
                }
                return;
            }
            response = Object.entries(JSON.parse(response));
            totalGames = response.length;

            // Streaming scan. Several games are fetched at once and a finished fetch immediately frees a
            // slot for the next game. Only the network fetch overlaps. Finished games are committed one at a
            // time in feed order, so game numbers and booking order match a one-by-one scan exactly.
            async function processElements() {
                if (amountOfBooking > response.length) { amountOfBooking2 = amountOfBooking; amountOfBooking = response.length; }

                const launched = [];      // games sent for scanning, in feed order
                let commitIndex = 0;      // next entry of `launched` to commit
                let nextToLaunch = 0;     // next position in `response`
                let inFlight = 0;
                let windowSize = randomWindowSize();
                let finished = false;
                const pickGoal = Math.ceil(wantedGames * PICK_GOAL_MULTIPLIER);

                function hasMoreToLaunch() {
                    while (nextToLaunch < response.length && visited.includes(response[nextToLaunch][0])) nextToLaunch++;
                    return nextToLaunch < response.length;
                }

                function finish(note = '') {
                    if (finished) return;
                    finished = true;
                    scanActive = false;
                    if (launched.length === commitIndex && !hasMoreToLaunch()) book = true; // every game has been scanned, so no further rounds
                    statusNote = note || (book && Object.keys(dataKing).length < wantedGames ? 'NO MORE GAMES TO SCAN, BOOKING THE ONES FOUND' : '');
                    bookNow();
                }

                function launchNext() {
                    const [key, value] = response[nextToLaunch++];
                    const entry = { key, time: Object.keys(value)[0], league: Object.values(value)[0], done: false, niceJson: null };
                    launched.push(entry);
                    inFlight++;
                    scanGame(entry);
                }

                async function scanGame(entry) {
                    try {
                        // A game that has already kicked off can no longer be booked, so it is not fetched.
                        if (Number(entry.time) > Date.now() / 1000) entry.niceJson = await fetchGameWithRetry(entry.key);
                    }
                    catch (error) {
                        console.error(`Skipped game ${entry.key}:`, error);
                    }
                    entry.done = true;
                    inFlight--;
                    if (finished) return; // a late result from a scan that has already ended
                    scanFinished++;
                    windowSize = randomWindowSize();
                    advance();
                }

                // Turns one finished scan into a pick. Runs one game at a time, never concurrently.
                function commitGame(entry) {
                    const { key, time, league, niceJson } = entry;
                    if (niceJson === null) return;                          // the fetch failed, or the game had started
                    if (Number(time) <= Date.now() / 1000) return;        // kicked off while the scan was running

                    const calculatedJson = predict(niceJson, gameType, selMethod ? selMethod.value : DEFAULT_METHOD, Number(time));
                    const predictedOutcome = outcomes(calculatedJson, niceJson);
                    amounted++;
                    if (predictedOutcome.result === null) return;

                    const homeT = niceJson["names"]["team1name"];
                    const awayT = niceJson["names"]["team2name"];
                    let outcome = null;
                    let statement = null;
                    switch (gameType) {
                        case "football":
                        case "icehockey":
                        case "handball":
                            if (selType.value === "draw") {
                                outcome = "Draw";
                                statement = `${homeT} to draw ${awayT}`;
                                break;
                            }
                            else if (selType.value === "winner") {
                                if (predictedOutcome.market === "double") {
                                    outcome = predictedOutcome.result ? "Home or Draw" : "Draw or Away";
                                    statement = outcome === "Home or Draw" ? `${homeT} to win or draw ${awayT}` : `${awayT} to win or draw ${homeT}`;
                                }
                                else {
                                    outcome = predictedOutcome.result ? "Home" : "Away";
                                    statement = outcome === "Home" ? `${homeT} to win ${awayT}` : `${awayT} to win ${homeT}`;
                                }
                                break;
                            }
                            else if (selType.value === "double_chance") {
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
                    const formattedTime = new Date(time * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

                    dataKing["NO" + times] = {
                        "key": key,
                        "home": homeT,
                        "away": awayT,
                        "time": formattedTime,
                        "outcome": outcome,
                        "gameNo": (times + 1)
                    };
                    pickConfidence[key] = pickProbability(calculatedJson.probabilities, predictedOutcome);

                    save_game.push({
                        game: { num: times + 1, key, time, league, statement },
                        log: predictedOutcome
                    });
                }

                // Commits finished games in order, decides whether to stop, and starts new scans.
                function advance() {
                    if (finished) return;
                    try {
                        while (commitIndex < launched.length && launched[commitIndex].done) {
                            const entry = launched[commitIndex++];
                            try {
                                commitGame(entry);
                            }
                            catch (error) {
                                console.error(`Skipped game ${entry.key}:`, error); // one bad game must not stop the scan
                            }
                            visited.push(entry.key);
                            countTotal += 1;
                            times += 1;
                            scannedGames += 1;
                            if (Object.keys(dataKing).length >= pickGoal) { finish(); return; }
                        }

                        if (times >= amountOfBooking) { finish(); return; }
                        if (stop === true) {
                            if (launched.length === commitIndex) finish();
                            return;
                        }

                        // Never launch more games than the scan budget still allows.
                        while (inFlight < windowSize && times + (launched.length - commitIndex) < amountOfBooking && hasMoreToLaunch()) {
                            launchNext();
                        }
                        updateProgressBar();

                        if (launched.length === commitIndex && !hasMoreToLaunch()) finish();
                    }
                    catch (error) {
                        console.error(error);
                        finished = true;
                        scanActive = false;
                        failRun('The scan stopped unexpectedly, try again');
                    }
                }

                scanActive = true;
                advance();
            }
            processElements().catch((error) => {
                console.error(error);
                failRun('The scan stopped unexpectedly, try again');
            });
        }
        ajax().catch((error) => console.error(error)); // getGames already reset the UI
    }

    function getGames(game, date, keepRun) {
        return new Promise((resolve, reject) => {
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

            if ((typeof date === "number" || dateMapping.hasOwnProperty(date)) && gameMapping.hasOwnProperty(game)) {
                const dateIndex = typeof date === "number" ? date : dateMapping[date]; // a number is a day offset from today
                const gameIndex = gameMapping[game];
                //https://global.flashscore.ninja/50/x/feed/f_1_0_1_en_4
                const url = `https://api.webapps.com.ng/v2/sports/livescore.php?50&x&feed&f_${gameIndex}_${dateIndex}_${FEED_UTC_OFFSET_HOURS}_en_4`;
                //const url = `https://d.livescore.in/x/feed/f_${gameIndex}_${dateIndex}_1_en_4`;

                fetchFeedText(url, 'GAME LIST')
                    .then(matches => {
                        const lines = matches.replace(/÷/g, "<br>").split("<br>");
                        const leagues = {};
                        const currentTimestamp = Math.floor(Date.now() / 1000);
                        const currentTime = currentTimestamp;
                        let codes1;
                        let league;
                        let codes2;

                        lines.forEach((line) => {
                            const codes1Match = line.match(/(\w+)¬AD(?!\w)/);
                            if (codes1Match) {
                                codes1 = codes1Match[1];
                            } else if (line.match(/^(.*?¬ZEE.*)$/)) {
                                league = line.replace(/¬ZEE/g, '');
                            } else {
                                const timeMatch = line.match(/(\w+)¬ADE(?!\w)/);
                                if (timeMatch) {
                                    codes2 = timeMatch[1];
                                    if (currentTime < codes2) {

                                        const currentDateTime = new Date(currentTimestamp * 1000);
                                        const nextDateTime = new Date(codes2 * 1000);
                                        const currentDate = currentDateTime.toISOString().split('T')[0];
                                        const nextDate = nextDateTime.toISOString().split('T')[0];

                                        let date;
                                        const options = { hour: '2-digit', minute: '2-digit' };

                                        if (currentDate !== nextDate) {
                                            date = nextDateTime.toDateString() + " : " + nextDateTime.toLocaleTimeString(undefined, options);
                                        } else {
                                            date = "Today : " + nextDateTime.toLocaleTimeString(undefined, options);
                                        }

                                        if (!leagues[codes1]) {
                                            leagues[codes1] = {};
                                        }
                                        leagues[codes1][codes2] = league;
                                    }
                                }
                            }
                        });

                        const filteredLeagues = {};
                        for (const key in leagues) {
                            if (Object.keys(leagues[key]).length > 0) {
                                filteredLeagues[key] = leagues[key];
                            }
                        }

                        const shuffledLeagues = {};
                        const keys = Object.keys(filteredLeagues).sort(() => Math.random() - 0.5);
                        keys.forEach(key => {
                            shuffledLeagues[key] = filteredLeagues[key];
                        });

                        const json = JSON.stringify(shuffledLeagues);

                        if (json !== '{}') {
                            resolve(json);
                        } else {
                            if (keepRun) {
                                // a later round of a run that already has games: the caller books those, nothing is reset
                                resolve("NO GAMES AVAILABLE FOR SPECIFIED DATE");
                                return;
                            }
                            results += "<p id='error' style='padding: 5px'>NO GAMES AVAILABLE FOR SPECIFIED DATE</p>";
                            book = true;
                            resetRunState();
                            result.innerHTML = results;
                            results = "";
                            resolve("NO GAMES AVAILABLE FOR SPECIFIED DATE");
                        }
                    })
                    .catch(error => {

                        console.error(error.message);
                        results += "<p id='error' style='padding: 5px'>" + error.message + "</p>";
                        book = true;
                        resetRunState();
                        result.innerHTML = results;
                        results = "";
                        reject(error.message);

                    });
            } else {
                throw new Error("Invalid game or date.");
            }
        });
    }

    // Fetches a feed as text. A failed try is repeated up to FEED_FETCH_ATTEMPTS times before giving up (or until Stop).
    async function fetchFeedText(url, label) {
        let lastError = null;
        for (let attempt = 1; attempt <= FEED_FETCH_ATTEMPTS; attempt++) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);
            try {
                const response = await fetch(url, { method: 'GET', headers: { "x-fsign": "SW9D1eZo" }, signal: controller.signal });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const text = await response.text();
                statusNote = '';
                return text;
            }
            catch (error) {
                lastError = error;
                console.error(`${label}, attempt ${attempt} failed:`, error);
                if (stop === true || attempt === FEED_FETCH_ATTEMPTS) break;
                statusNote = `RETRYING ${label}... ATTEMPT ${attempt + 1} OF ${FEED_FETCH_ATTEMPTS}`;
                updateProgressBar(amounted, amountOfBooking);
                await delay(FEED_RETRY_DELAY_MS);
            }
            finally {
                clearTimeout(timeoutId);
            }
        }
        statusNote = '';
        throw lastError;
    }

    // A failed match fetch is retried a few times, then the match is skipped so the scan keeps going.
    function refreshRetryNote() {
        if (scanActive) statusNote = retryingGames > 0 ? `RETRYING ${retryingGames} GAME${retryingGames === 1 ? '' : 'S'}...` : '';
    }

    async function fetchGameWithRetry(key) {
        let counted = false;
        const leave = () => {
            if (counted) retryingGames--;
            counted = false;
            refreshRetryNote();
        };
        for (let attempt = 1; attempt <= MATCH_FETCH_ATTEMPTS; attempt++) {
            try {
                const gameData = await sortGame(key);
                leave();
                return gameData;
            }
            catch (error) {
                console.error(`Game ${key}, attempt ${attempt} failed:`, error);
                if (stop === true || scanActive === false || attempt === MATCH_FETCH_ATTEMPTS) break;
                if (!counted) { counted = true; retryingGames++; }
                refreshRetryNote();
                updateProgressBar();
                await delay(MATCH_RETRY_DELAY_MS);
            }
        }
        leave();
        return null;
    }

    // Competition data for one match. It can only improve predictions, so every failure just returns null.
    async function fetchMatchMeta(key) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), MATCHDATA_TIMEOUT_MS);
        try {
            const response = await fetch(`${MATCHDATA_URL}?id=${encodeURIComponent(key)}`, { signal: controller.signal });
            if (!response.ok) return null;
            const data = await response.json();
            return data && data.ok ? data : null;
        } catch (error) {
            return null;
        } finally {
            clearTimeout(timeoutId);
        }
    }

    async function sortGame(key) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        //const url = `https://d.livescore.in/x/feed/df_hh_4_${key}`;
        const url = `https://api.webapps.com.ng/v2/sports/loadteam.php?50&x&feed&df_hh_4_${key}`;
        const metaPromise = fetchMatchMeta(key); // runs in parallel; never rejects, resolves to null on any failure

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: { "x-fsign": "SW9D1eZo" },
                signal: controller.signal,
            });

            if (!response.ok) {
                const responseText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}, Response: ${responseText}`);
            }

            const matches = await response.text();

            const getNames = () => {
                const lines = matches.replace(/¬/g, '÷').split('÷');

                const wordCount = [];
                let counts = 0;

                lines.forEach((line) => {
                    if (line.includes('Last matches:') && counts < 3) {
                        counts += 1;
                        wordCount.push(line.replace('Last matches: ', ''));
                    }
                });

                return {
                    team1name: wordCount[0] || null,
                    team2name: wordCount[1] || null,
                };
            };


            const getTeams = () => {
                const lines = matches.replace(/¬/g, '÷').split('÷');
                const hometeams = [];
                const awayteams = [];
                const homescores = [];
                const awayscores = [];
                const gameDate = [];
                const dateLimit = new Date('2023-01-01').getTime() / 1000;
                let count = 0;

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];

                    if (line.includes('Last matches')) {
                        count += 1;
                    } else if (line.match(/(\d+):(\d+)/) && count <= 2) {

                        const [_, homeScore, awayScore] = line.match(/(\d+):(\d+)/);
                        const awayTeam = lines[i - 4] || '';
                        const homeTeam = lines[i - 12] || '';
                        const dTime = lines[i - 34] || '';
                        const dTime2 = lines[i + 16] || '';

                        const time100 = dTime.length === 10 ? dTime : (dTime2.length === 10 ? dTime2 : null);


                        if (time100 > dateLimit && !/\b\w*\.png\w*\b/.test(homeTeam) && !/\b\w*\.png\w*\b/.test(awayTeam)) {
                            hometeams.push(homeTeam);
                            awayteams.push(awayTeam);
                            homescores.push(homeScore);
                            awayscores.push(awayScore);
                            gameDate.push(time100);

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

            const meta = await metaPromise;
            return {
                names: getNames(),
                ...getTeams(),
                meta,
            };

        } catch (error) {
            console.error(`Error fetching or processing data: ${error.message}`);
            throw error;
        }
        finally {
            clearTimeout(timeoutId);
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
    // Second weight, by how long ago a match was played (calendar months back from today).
    // It multiplies the tier weight above, for team form, goals, tempo, common opponents and head-to-head.
    const AGE_LIMITS_MONTHS = [3, 6, 12];
    const AGE_WEIGHTS = [1.0, 0.75, 0.5, 0.25];  // up to 3 months, 3 to 6 months, 6 to 12 months, 1 year or older
    const FORM_PRIOR_MATCHES = 3;         // pulls thin samples towards an average team
    const MIN_MATCHES_REQUIRED = 6;       // below this per team, no pick is made
    const MIN_VENUE_MATCHES_FOR_HFA = 3;  // home and away games needed to estimate home advantage
    const HFA_PRIOR_MATCHES = 20;         // shrinks the home advantage estimate towards zero
    const COMMON_OPPONENT_MAX_WEIGHT = 0.6;
    const COMMON_OPPONENT_PRIOR = 6;
    const HEAD2HEAD_MAX_WEIGHT = 1.0;     // a single recent meeting already carries a third of the form weight
    const HEAD2HEAD_PRIOR = 2;
    // Largest goal margin a single match may count for. A 12-0 against a minnow says little more than a 3-0.
    // Only for low-scoring sports; in basketball or handball a 3-goal margin is normal, so no cap there.
    const MARGIN_CAP_BY_SPORT = { football: 3, icehockey: 3 };
    // Teams that share no opponents (different leagues or competitions) cannot be compared through form alone,
    // so their expected margin is pulled towards zero. Full trust needs this many shared opponents.
    const SHARED_OPPONENTS_FOR_FULL_TRUST = 4;
    const MIN_LINK_TRUST = 0.5;
    // Competition-aware data from matchdata.php (optional; the model works without it).
    const MATCHDATA_URL = 'https://api.webapps.com.ng/v2/sports/matchdata.php';
    const MATCHDATA_TIMEOUT_MS = 8000;
    // Football only: goals a tier-2 team's margin is worth less than a tier-1 team's, per tier below the top flight.
    const LEVEL_MARGIN_PER_TIER = 0.4;
    // Two teams whose latest league matches are in the same competition count as at least this many shared opponents.
    const SAME_LEAGUE_LINK_COUNT = 3;
    // Team-specific venue form: the home team's home results and the away team's away results.
    const VENUE_PRIOR_MATCHES = 4;        // pseudo-matches pulling venue form towards the team's overall strength
    const VENUE_FORM_WEIGHT = 0.4;        // share of the expected margin that comes from venue form
    const MIN_MATCH_DATE_SECONDS = new Date('2023-01-01').getTime() / 1000; // same cut-off as getTeams
    // Rest days: a small penalty for a team that played less than REST_DAYS_FULL days before kick-off. No bonus for long rest.
    const REST_DAYS_FULL = 4;             // this much rest or more: no penalty
    const REST_DAYS_MAX_PENALTY = 2;      // this little rest or less: the full penalty
    // Share of the expected total goals lost at full penalty (about 0.14 goals in football).
    // Low-scoring sports use 0.05; basketball and other high-scoring sports use far less, as 5% of a 220-point total is huge.
    const REST_MAX_PENALTY_SHARE_BY_SPORT = { football: 0.05, icehockey: 0.05, handball: 0.05 };
    const REST_MAX_PENALTY_SHARE_DEFAULT = 0.01;
    // Conflict veto: when the like-for-like signals (shared opponents, head-to-head) point to the other side from the pick,
    // the pick needs a higher probability. The strictness thresholds are untouched; the boost is added on top.
    const CONFLICT_MIN_COMMON_COUNT = 1.5;  // effective shared opponents needed for that signal to count
    const CONFLICT_MIN_H2H_COUNT = 0.6;     // effective head-to-head meetings needed for that signal to count
    const CONFLICT_MARGIN_SHARE = 0.15;     // a signal counts only above this share of the expected total goals (about 0.4 in football)
    const CONFLICT_BOOST_PER_SIGNAL = 0.06;
    const CONFLICT_BOOST_MAX = 0.12;
    // Per-team draw rates (sports that can end level). Poisson models tend to underestimate draws.
    const DRAW_PRIOR_MATCHES = 6;         // pseudo-matches pulling a team's draw rate towards the pooled rate
    const DRAW_POISSON_SHARE = 0.5;       // final draw = this share of the Poisson draw + the rest from the teams' draw rates
    const DRAW_MIN = 0.05;
    const DRAW_MAX = 0.5;
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

    function mean(values) {
        return values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length;
    }

    function recencyWeight(index) {
        const tier = Math.floor(index / RECENCY_TIER_SIZE);
        return RECENCY_TIER_WEIGHTS[Math.min(tier, RECENCY_TIER_WEIGHTS.length - 1)];
    }

    // Weight for a match by its age. `dateSeconds` is the unix time of the match.
    function ageWeight(dateSeconds) {
        const monthsAgo = (months) => {
            const day = new Date(Date.now());
            const dayOfMonth = day.getDate();
            day.setDate(1);
            day.setMonth(day.getMonth() - months);
            const lastDay = new Date(day.getFullYear(), day.getMonth() + 1, 0).getDate();
            day.setDate(Math.min(dayOfMonth, lastDay)); // 31 May minus 3 months is 28/29 Feb, not 3 Mar
            return day.getTime() / 1000;
        };
        const tier = AGE_LIMITS_MONTHS.findIndex((months) => dateSeconds >= monthsAgo(months));
        return AGE_WEIGHTS[tier === -1 ? AGE_WEIGHTS.length - 1 : tier];
    }

    // Final weight of one match: its position tier times its age.
    function matchWeight(match, index) {
        return recencyWeight(index) * ageWeight(match.date) * (match.competitionWeight ?? 1);
    }

    function weightedMean(values, weights, priorMean, priorWeight) {
        let weightSum = priorWeight;
        let total = priorMean * priorWeight;
        values.forEach((value, index) => {
            weightSum += weights[index];
            total += value * weights[index];
        });
        return weightSum > 0 ? total / weightSum : priorMean;
    }

    function normalCdf(z) {
        // Abramowitz-Stegun 26.2.17
        const t = 1 / (1 + 0.2316419 * Math.abs(z));
        const density = 0.3989423 * Math.exp(-z * z / 2);
        const tail = density * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
        return z > 0 ? 1 - tail : tail;
    }

    function poissonPmf(lambda, maxGoals) {
        const pmf = [Math.exp(-lambda)];
        for (let goals = 1; goals <= maxGoals; goals++) {
            pmf.push(pmf[goals - 1] * lambda / goals);
        }
        return pmf;
    }

    // Rebuilds each team's results as plain objects seen from that team's side.
    // Uses only the arrays produced by getTeams, which is left untouched.
    // Shrinks a lopsided score so the margin is at most `cap`, keeping the winner and the loser's goals sensible.
    function capMargin(goalsFor, goalsAgainst, cap) {
        if (goalsFor - goalsAgainst > cap) return { goalsFor: goalsAgainst + cap, goalsAgainst };
        if (goalsAgainst - goalsFor > cap) return { goalsFor, goalsAgainst: goalsFor + cap };
        return { goalsFor, goalsAgainst };
    }

    // Lookup of competition info by date|home|away, built from the matchdata.php lists.
    function buildMetaLookup(meta) {
        const lookup = new Map();
        if (!meta || !meta.overall) return lookup;
        const lists = [meta.overall.home, meta.overall.away, meta.overall.h2h, meta.homeOnly, meta.awayOnly];
        lists.forEach((list) => (list || []).forEach((m) => {
            lookup.set(`${m.date}|${m.home}|${m.away}`, { weight: m.weight, tier: m.tier, code: m.code, type: m.type });
        }));
        return lookup;
    }

    function collectMatches(niceJson, sport) {
        const metaLookup = buildMetaLookup(niceJson.meta);
        const marginCap = MARGIN_CAP_BY_SPORT[sport] ?? Infinity;
        const { team1name, team2name } = niceJson.names;
        const { hometeams, awayteams, homescores, awayscores, gameDate } = niceJson;
        const team1 = [];
        const team2 = [];
        const headToHead = [];
        const seenHeadToHead = new Set();

        for (let index = 0; index < hometeams.length; index++) {
            const homeTeam = hometeams[index];
            const awayTeam = awayteams[index];
            const homeScore = Number(homescores[index]);
            const awayScore = Number(awayscores[index]);
            const date = Number(gameDate[index]);
            if (!Number.isFinite(homeScore) || !Number.isFinite(awayScore) || !Number.isFinite(date)) continue;

            const cappedHome = capMargin(homeScore, awayScore, marginCap);
            const info = metaLookup.get(`${date}|${homeTeam}|${awayTeam}`);
            const comp = {
                competitionWeight: info && Number.isFinite(info.weight) ? info.weight : 1,
                code: info ? info.code : null,
                type: info ? info.type : null,
                // Division adjustment, football only. Missing info means tier 1, so no change.
                levelPenalty: sport === 'football' && info && info.tier ? LEVEL_MARGIN_PER_TIER * (info.tier - 1) : 0
            };
            const fromHome = { goalsFor: cappedHome.goalsFor, goalsAgainst: cappedHome.goalsAgainst, venue: 'home', date, ...comp };
            const fromAway = { goalsFor: cappedHome.goalsAgainst, goalsAgainst: cappedHome.goalsFor, venue: 'away', date, ...comp };

            const isHeadToHead = (homeTeam === team1name && awayTeam === team2name)
                || (homeTeam === team2name && awayTeam === team1name);
            if (isHeadToHead) {
                const dedupeKey = `${date}|${homeTeam}|${homeScore}|${awayScore}`;
                if (seenHeadToHead.has(dedupeKey)) continue;
                seenHeadToHead.add(dedupeKey);
                // Both sides played this match in the same competition, so there is no division gap to correct.
                fromHome.levelPenalty = 0;
                fromAway.levelPenalty = 0;
                headToHead.push(homeTeam === team1name ? { ...fromHome, opponent: team2name } : { ...fromAway, opponent: team2name });
                // The meeting also counts in each team's own form; it is the most relevant match either of them played.
                team1.push(homeTeam === team1name ? { ...fromHome, opponent: team2name } : { ...fromAway, opponent: team2name });
                team2.push(homeTeam === team2name ? { ...fromHome, opponent: team1name } : { ...fromAway, opponent: team1name });
                continue;
            }

            if (homeTeam === team1name) team1.push({ ...fromHome, opponent: awayTeam });
            else if (awayTeam === team1name) team1.push({ ...fromAway, opponent: homeTeam });

            if (homeTeam === team2name) team2.push({ ...fromHome, opponent: awayTeam });
            else if (awayTeam === team2name) team2.push({ ...fromAway, opponent: homeTeam });
        }

        const newestFirst = (a, b) => b.date - a.date;
        const team1Sorted = team1.sort(newestFirst).slice(0, MAX_MATCHES_PER_TEAM);
        const team2Sorted = team2.sort(newestFirst).slice(0, MAX_MATCHES_PER_TEAM);

        // Venue-only lists from matchdata.php (they go deeper than the Overall list).
        // venue 'home': rows of the team's home section; venue 'away': rows of the team's away section.
        const venueFromMeta = (rows, teamName, otherName, venue) => {
            const isHome = venue === 'home';
            const seen = new Set();
            const list = [];
            (rows || []).forEach((m) => {
                if ((isHome ? m.home : m.away) !== teamName) return;
                const date = Number(m.date), homeGoals = Number(m.homeGoals), awayGoals = Number(m.awayGoals);
                if (!Number.isFinite(date) || !Number.isFinite(homeGoals) || !Number.isFinite(awayGoals)) return;
                if (date < MIN_MATCH_DATE_SECONDS) return;
                const dedupeKey = `${date}|${m.home}|${m.away}`;
                if (seen.has(dedupeKey)) return;
                seen.add(dedupeKey);
                const capped = capMargin(homeGoals, awayGoals, marginCap);
                const opponent = isHome ? m.away : m.home;
                list.push({
                    goalsFor: isHome ? capped.goalsFor : capped.goalsAgainst,
                    goalsAgainst: isHome ? capped.goalsAgainst : capped.goalsFor,
                    venue, date, opponent,
                    competitionWeight: Number.isFinite(m.weight) ? m.weight : 1,
                    code: m.code ?? null,
                    type: m.type ?? null,
                    levelPenalty: sport === 'football' && m.tier && opponent !== otherName ? LEVEL_MARGIN_PER_TIER * (m.tier - 1) : 0
                });
            });
            return list.sort(newestFirst).slice(0, MAX_MATCHES_PER_TEAM);
        };
        const meta = niceJson.meta;
        let team1Home = venueFromMeta(meta && meta.homeOnly, team1name, team2name, 'home');
        let team2Away = venueFromMeta(meta && meta.awayOnly, team2name, team1name, 'away');
        // Without matchdata.php, use the venue split of the Overall list.
        if (team1Home.length === 0) team1Home = team1Sorted.filter((match) => match.venue === 'home');
        if (team2Away.length === 0) team2Away = team2Sorted.filter((match) => match.venue === 'away');

        return {
            team1: team1Sorted,
            team2: team2Sorted,
            headToHead: headToHead.sort(newestFirst),
            team1Home,
            team2Away
        };
    }

    const goalDiff = (match) => match.goalsFor - match.goalsAgainst;

    // Win = 1, draw = 0, loss = -1. Venue is not adjusted: each team plays both home and away,
    // so the effect largely cancels when the two teams are compared.
    function teamResultForm(matches) {
        const values = matches.map((match) => Math.sign(goalDiff(match)));
        const weights = matches.map((match, index) => matchWeight(match, index));
        return weightedMean(values, weights, 0, FORM_PRIOR_MATCHES);
    }

    // Converts result form into goal units using the typical margin of a decisive match.
    function resultFormScale(matches) {
        const margins = matches.map((match) => Math.abs(goalDiff(match))).filter((margin) => margin > 0);
        return margins.length === 0 ? 1 : mean(margins);
    }

    // Average extra goal margin a team earns by playing at home, pooled over both teams.
    function estimateHomeAdvantage(teamLists) {
        let weightedSum = 0;
        let totalPairs = 0;
        teamLists.forEach((matches) => {
            const home = matches.filter((match) => match.venue === 'home').map(goalDiff);
            const away = matches.filter((match) => match.venue === 'away').map(goalDiff);
            if (home.length < MIN_VENUE_MATCHES_FOR_HFA || away.length < MIN_VENUE_MATCHES_FOR_HFA) return;
            const pairs = Math.min(home.length, away.length);
            weightedSum += ((mean(home) - mean(away)) / 2) * pairs;
            totalPairs += pairs;
        });
        if (totalPairs === 0) return 0;
        return (weightedSum / totalPairs) * (totalPairs / (totalPairs + HFA_PRIOR_MATCHES));
    }

    // Goal difference with the venue effect removed, so home and away games compare fairly.
    function neutralGoalDiff(match, homeAdvantage) {
        return goalDiff(match) - (match.levelPenalty ?? 0) - (match.venue === 'home' ? homeAdvantage : -homeAdvantage);
    }

    function teamStrength(matches, homeAdvantage) {
        const values = matches.map((match) => neutralGoalDiff(match, homeAdvantage));
        const weights = matches.map((match, index) => matchWeight(match, index));
        return weightedMean(values, weights, 0, FORM_PRIOR_MATCHES);
    }

    // Competition- and recency-weighted goal margin of a team at one venue, pulled towards `prior`.
    // The margin is the raw one (it includes the venue effect), less any division adjustment.
    function venueStrength(matches, prior) {
        const values = matches.map((match) => goalDiff(match) - (match.levelPenalty ?? 0));
        const weights = matches.map((match, index) => matchWeight(match, index));
        return weightedMean(values, weights, prior, VENUE_PRIOR_MATCHES);
    }

    // Days between the team's latest earlier match and kick-off (matches are newest first), or null if unknown.
    function restDaysBefore(matches, kickoff) {
        if (!Number.isFinite(kickoff)) return null;
        const previous = matches.find((match) => match.date < kickoff);
        return previous ? (kickoff - previous.date) / 86400 : null;
    }

    // Goals a tired team loses. Less than REST_DAYS_FULL days of rest costs a little, up to the cap at REST_DAYS_MAX_PENALTY.
    function restPenalty(restDays, expectedTotal, sport) {
        if (restDays === null) return 0;
        const share = REST_MAX_PENALTY_SHARE_BY_SPORT[sport] ?? REST_MAX_PENALTY_SHARE_DEFAULT;
        const shortfall = Math.min(1, Math.max(0, (REST_DAYS_FULL - restDays) / (REST_DAYS_FULL - REST_DAYS_MAX_PENALTY)));
        return share * expectedTotal * shortfall;
    }

    function teamTempo(matches, fallbackTotal) {
        const totals = matches.map((match) => match.goalsFor + match.goalsAgainst);
        const weights = matches.map((match, index) => matchWeight(match, index));
        return weightedMean(totals, weights, fallbackTotal, FORM_PRIOR_MATCHES);
    }

    // Compares both teams through opponents they have both played, which cancels out schedule strength.
    // Each shared opponent is weighted by recency: the comparison is only as fresh as the older of the two
    // teams' meetings with that opponent, so a recent shared opponent counts for more than an old one.
    function commonOpponentMargin(team1, team2, homeAdvantage) {
        const averageByOpponent = (matches) => {
            const grouped = new Map();
            matches.forEach((match, index) => {
                const entry = grouped.get(match.opponent) || { total: 0, weight: 0 };
                const weight = matchWeight(match, index);
                entry.total += neutralGoalDiff(match, homeAdvantage) * weight;
                entry.weight += weight;
                grouped.set(match.opponent, entry);
            });
            return grouped;
        };

        const team1ByOpponent = averageByOpponent(team1);
        const team2ByOpponent = averageByOpponent(team2);
        const differences = [];
        const weights = [];
        team1ByOpponent.forEach((entry1, opponent) => {
            const entry2 = team2ByOpponent.get(opponent);
            if (!entry2) return;
            differences.push(entry1.total / entry1.weight - entry2.total / entry2.weight);
            // Capped at 1 so an opponent met several times does not count as more than one opponent.
            weights.push(Math.min(1, entry1.weight, entry2.weight));
        });
        // As with head-to-head, the count is the sum of the weights (three recent shared opponents = about 3,
        // three old ones = much less), so stale evidence is also trusted less overall.
        const effectiveCount = weights.reduce((sum, weight) => sum + weight, 0);
        return { margin: weightedMean(differences, weights, 0, 0), count: effectiveCount };
    }

    function headToHeadMargin(headToHead, homeAdvantage) {
        const values = headToHead.map((match) => neutralGoalDiff(match, homeAdvantage));
        const weights = headToHead.map((match, index) => matchWeight(match, index));
        // Old meetings also count for less in how much head-to-head is trusted overall:
        // the count is the sum of the age weights (three recent meetings = 3, three from last year = 0.75).
        const effectiveCount = headToHead.reduce((sum, match) => sum + ageWeight(match.date), 0);
        return { margin: weightedMean(values, weights, 0, 0), count: effectiveCount };
    }

    // A team's share of matches that ended level, competition- and recency-weighted, pulled towards the pooled rate.
    function teamDrawRate(matches, pooledRate) {
        const values = matches.map((match) => (match.goalsFor === match.goalsAgainst ? 1 : 0));
        const weights = matches.map((match, index) => matchWeight(match, index));
        return weightedMean(values, weights, pooledRate, DRAW_PRIOR_MATCHES);
    }

    // Mixes the Poisson draw probability with the two teams' own draw rates, then rescales home and away to keep the total at 1.
    function blendDrawRates(poisson, team1, team2) {
        const isDraw = (match) => (match.goalsFor === match.goalsAgainst ? 1 : 0);
        const pooledRate = mean([...team1, ...team2].map(isDraw));
        const matchupRate = (teamDrawRate(team1, pooledRate) + teamDrawRate(team2, pooledRate)) / 2;
        const blended = DRAW_POISSON_SHARE * poisson.draw + (1 - DRAW_POISSON_SHARE) * matchupRate;
        const draw = Math.min(DRAW_MAX, Math.max(DRAW_MIN, blended));
        const decisive = poisson.home + poisson.away;
        const scale = decisive > 0 ? (1 - draw) / decisive : 0;
        return { home: poisson.home * scale, draw, away: poisson.away * scale };
    }

    function poissonProbabilities(lambdaHome, lambdaAway) {
        const maxLambda = Math.max(lambdaHome, lambdaAway);
        const maxGoals = Math.ceil(maxLambda + POISSON_TAIL_SIGMAS * Math.sqrt(maxLambda)) + 3;
        const homePmf = poissonPmf(lambdaHome, maxGoals);
        const awayPmf = poissonPmf(lambdaAway, maxGoals);
        let home = 0, draw = 0, away = 0;
        for (let homeGoals = 0; homeGoals <= maxGoals; homeGoals++) {
            for (let awayGoals = 0; awayGoals <= maxGoals; awayGoals++) {
                const probability = homePmf[homeGoals] * awayPmf[awayGoals];
                if (homeGoals > awayGoals) home += probability;
                else if (homeGoals === awayGoals) draw += probability;
                else away += probability;
            }
        }
        const total = home + draw + away;
        return { home: home / total, draw: draw / total, away: away / total };
    }

    function marginProbabilities(expectedMargin, spread) {
        const home = normalCdf(expectedMargin / spread);
        return { home, draw: 0, away: 1 - home };
    }

    function predict(niceJson, sport, method = DEFAULT_METHOD, kickoff = null) {
        const { team1, team2, headToHead, team1Home, team2Away } = collectMatches(niceJson, sport);
        const enoughData = team1.length >= MIN_MATCHES_REQUIRED && team2.length >= MIN_MATCHES_REQUIRED;
        if (!enoughData) {
            return { enoughData, matches1: team1.length, matches2: team2.length };
        }

        const homeAdvantage = estimateHomeAdvantage([team1, team2]);
        const formMargin = teamStrength(team1, homeAdvantage) - teamStrength(team2, homeAdvantage);
        const common = commonOpponentMargin(team1, team2, homeAdvantage);
        const h2h = headToHeadMargin(headToHead, homeAdvantage);

        const commonWeight = COMMON_OPPONENT_MAX_WEIGHT * common.count / (common.count + COMMON_OPPONENT_PRIOR);
        const h2hWeight = HEAD2HEAD_MAX_WEIGHT * h2h.count / (h2h.count + HEAD2HEAD_PRIOR);
        const neutralMargin = (formMargin + commonWeight * common.margin + h2hWeight * h2h.margin)
            / (1 + commonWeight + h2hWeight);
        const allMatches = [...team1, ...team2];
        const resultFormMargin = (teamResultForm(team1) - teamResultForm(team2)) * resultFormScale(allMatches);
        let blendedMargin;
        if (method === 'goals') blendedMargin = neutralMargin;
        else if (method === 'form') blendedMargin = resultFormMargin;
        else blendedMargin = (1 - FORM_BLEND_WEIGHT) * neutralMargin + FORM_BLEND_WEIGHT * resultFormMargin;
        // Teams with no shared opponents are judged against different schedules, so trust the margin less.
        // Teams whose latest league matches are in the same competition are connected even with few shared opponents.
        // Cups and friendlies do not count: they are exactly where unrelated leagues meet.
        const latestLeagueCode = (matches) => (matches.find((match) => match.type === 'league' && match.code) || {}).code || null;
        const code1 = latestLeagueCode(team1);
        const sameLeague = code1 !== null && code1 === latestLeagueCode(team2);
        const connectionCount = sameLeague ? Math.max(common.count, SAME_LEAGUE_LINK_COUNT) : common.count;
        const linkTrust = MIN_LINK_TRUST + (1 - MIN_LINK_TRUST) * Math.min(1, connectionCount / SHARED_OPPONENTS_FOR_FULL_TRUST);
        const currentMargin = blendedMargin * linkTrust + homeAdvantage;
        // Team-specific venue form. Each venue strength already contains the home effect once for each side,
        // so one pooled home advantage is taken out again to keep the match margin on the same footing.
        const homeVenueStrength = venueStrength(team1Home, teamStrength(team1, homeAdvantage) + homeAdvantage);
        const awayVenueStrength = venueStrength(team2Away, teamStrength(team2, homeAdvantage) - homeAdvantage);
        const venueMargin = homeVenueStrength - awayVenueStrength - homeAdvantage;
        let expectedMargin = (1 - VENUE_FORM_WEIGHT) * currentMargin + VENUE_FORM_WEIGHT * venueMargin * linkTrust;

        const allTotals = [...team1, ...team2].map((match) => match.goalsFor + match.goalsAgainst);
        const pooledTotal = mean(allTotals);
        const expectedTotal = (teamTempo(team1, pooledTotal) + teamTempo(team2, pooledTotal)) / 2;
        const restHome = restDaysBefore(team1, kickoff);
        const restAway = restDaysBefore(team2, kickoff);
        expectedMargin += restPenalty(restAway, expectedTotal, sport) - restPenalty(restHome, expectedTotal, sport);
        const minimumGoals = expectedTotal * MIN_EXPECTED_GOALS_SHARE;
        const expectedHomeGoals = Math.max(minimumGoals, (expectedTotal + expectedMargin) / 2);
        const expectedAwayGoals = Math.max(minimumGoals, (expectedTotal - expectedMargin) / 2);

        let probabilities;
        if (POISSON_SPORTS.includes(sport)) {
            probabilities = blendDrawRates(poissonProbabilities(expectedHomeGoals, expectedAwayGoals), team1, team2);
        }
        else {
            const spread = Math.max(MIN_MARGIN_SPREAD, standardDeviation([...team1, ...team2].map(goalDiff)));
            probabilities = marginProbabilities(expectedHomeGoals - expectedAwayGoals, spread);
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
            linkTrust,
            venueMargin,
            restDays: { home: restHome, away: restAway },
            commonCount: common.count,
            h2hCount: h2h.count,
            expectedTotal,
            headToHeadMargin: h2h.margin
        };
    }

    function standardDeviation(values) {
        const average = mean(values);
        return Math.sqrt(mean(values.map((value) => (value - average) ** 2)));
    }

    // result: true = home side of the market, false = away side, null = no pick.
    // market: 'win', 'double' or 'draw' (what was actually picked).
    // Extra probability a pick on each side needs. A signal that favours the home side argues against an away pick,
    // and the other way round. Draw picks are exempt (pickResult does not use the boost for them).
    function conflictBoosts(calculated) {
        const boosts = { home: 0, away: 0 };
        const minMargin = CONFLICT_MARGIN_SHARE * (calculated.expectedTotal || 0);
        const signals = [
            { margin: calculated.commonMargin, count: calculated.commonCount, minCount: CONFLICT_MIN_COMMON_COUNT },
            { margin: calculated.headToHeadMargin, count: calculated.h2hCount, minCount: CONFLICT_MIN_H2H_COUNT }
        ];
        signals.forEach(({ margin, count, minCount }) => {
            if (!(count >= minCount) || !Number.isFinite(margin) || Math.abs(margin) <= minMargin) return;
            if (margin > 0) boosts.away += CONFLICT_BOOST_PER_SIGNAL;
            else boosts.home += CONFLICT_BOOST_PER_SIGNAL;
        });
        boosts.home = Math.min(boosts.home, CONFLICT_BOOST_MAX);
        boosts.away = Math.min(boosts.away, CONFLICT_BOOST_MAX);
        return boosts;
    }

    function pickResult(market, strictness, probabilities, boosts = { home: 0, away: 0 }) {
        const threshold = PICK_THRESHOLDS[market]?.[strictness];
        if (threshold === undefined) return NO_PICK;
        const { home, draw, away } = probabilities;

        if (market === 'winner') {
            if (home >= threshold + boosts.home && home > away) return { result: true, market: 'win' };
            if (away >= threshold + boosts.away && away > home) return { result: false, market: 'win' };
            if (DOWNGRADE_WINNER_TO_DOUBLE_CHANCE && draw > 0) {
                const doubleThreshold = PICK_THRESHOLDS.double_chance[strictness];
                const homeOrDraw = home + draw;
                const drawOrAway = draw + away;
                if (homeOrDraw >= doubleThreshold + boosts.home && homeOrDraw > drawOrAway) return { result: true, market: 'double' };
                if (drawOrAway >= doubleThreshold + boosts.away && drawOrAway > homeOrDraw) return { result: false, market: 'double' };
            }
            return NO_PICK;
        }
        if (market === 'double_chance') {
            const homeOrDraw = home + draw;
            const drawOrAway = draw + away;
            if (homeOrDraw >= threshold + boosts.home && homeOrDraw > drawOrAway) return { result: true, market: 'double' };
            if (drawOrAway >= threshold + boosts.away && drawOrAway > homeOrDraw) return { result: false, market: 'double' };
            return NO_PICK;
        }
        if (market === 'draw') return draw >= threshold ? { result: true, market: 'draw' } : NO_PICK;
        return NO_PICK;
    }

    // Probability of the side that was actually picked; used to choose which picks to keep when there are extras.
    function pickProbability(probabilities, pick) {
        const { home, draw, away } = probabilities;
        if (pick.market === 'double') return pick.result ? home + draw : draw + away;
        if (pick.market === 'draw') return draw;
        return pick.result ? home : away;
    }

    function outcomes(calculatedJson, matchJson) {
        const { team1name, team2name } = matchJson.names;
        const percent = (probability) => Math.round(probability * 100);
        const rounded = (value) => Math.round(value * 100) / 100;

        const pick = calculatedJson.enoughData
            ? pickResult(selType.value, Number(selectElement.value), calculatedJson.probabilities, conflictBoosts(calculatedJson))
            : NO_PICK;

        const probabilities = calculatedJson.probabilities || { home: 0, draw: 0, away: 0 };
        const log = {
            model: MODEL_VERSION,
            team1: team1name,
            team2: team2name,
            score1: percent(probabilities.home),            // win probability %
            score2: percent(probabilities.away),
            sum1: rounded(calculatedJson.expectedHomeGoals || 0), // expected goals
            sum2: rounded(calculatedJson.expectedAwayGoals || 0),
            master: rounded(calculatedJson.commonMargin || 0),    // common-opponent margin
            head2head: rounded(calculatedJson.headToHeadMargin || 0),
            formGoals: rounded(calculatedJson.goalsMargin || 0),
            formResults: rounded(calculatedJson.formMargin || 0),
            draw: percent(probabilities.draw),
            trust: rounded(calculatedJson.linkTrust ?? 1),   // 1 = teams are well connected through shared opponents
            games1: calculatedJson.matches1,
            games2: calculatedJson.matches2,
            result: pick.result,
            market: pick.market
        };

        calculatedJson.result = pick.result;
        return log;
    }
};

const baseurl = (process.env.NODE_ENV === 'production' ? 'https://webappscrabbleclub.azurewebsites.net/api/Values/League' : 'https://localhost:55557/api/Values/League');

async function typicalCall(url) {
    let responseText = "";
    try {
        let response = await fetch(url);
        responseText = await response.text();
        const jdata = JSON.parse(responseText);
        jdata.error = false;
        return jdata.value;
    } catch (error) {
        console.log(url);
        console.log(responseText);
        return {error: true, errorMessage: responseText};
    }
}

/**
 * Get league data
 * @returns JSON league data or {error: text}
 * @async
 */
export async function callGetLeagueData() {
    let url = `${baseurl}/GetData`;
    let response = await typicalCall(url);
    return response;
}

/**
 * Add league
 * @param {string} desc League description
 * @param {string} startDate League start date
 * @param {string} endDate League end date
 * @param {string} status League status
 * @param {int} gamesPerOpp The number of times each pair of opponents player each other
 * @returns JSON league data or {error: text}
 * @async
 */
export async function callAddLeague(desc, startDate, endDate, status, gamesPerOpp) {
    let url = `${baseurl}/AddLeague?desc=${desc}&startDate=${startDate}&endDate=${endDate}&status=${status}&gamesPerOpp=${gamesPerOpp}`;
    let response = await typicalCall(url);
    return response;
}

/**
 * Update league
 * @param {int} id League id
 * @param {string} desc League description
 * @param {string} startDate League start date
 * @param {string} endDate League end date
 * @param {string} status League status
 * @param {int} gamesPerOpp The number of times each pair of opponents player each other
 * @returns JSON league data or {error: text}
 * @async
 */
export async function callUpdateLeague(id, desc, startDate, endDate, status, gamesPerOpp) {
    let url = `${baseurl}/UpdateLeague?id=${id}&desc=${desc}&startDate=${startDate}&endDate=${endDate}&status=${status}&gamesPerOpp=${gamesPerOpp}`;
    let response = await typicalCall(url);
    return response;
}

/**
 * Delete league
 * @param {int} id League id
 * @returns JSON league data or {error: text}
 * @async
 */
export async function callDeleteLeague(id) {
    let url = `${baseurl}/DeleteLeague?id=${id}`;
    let response = await typicalCall(url);
    return response;
}

/**
 * Add player
 * @param {string} userId User id
 * @param {string} nickname Nickname
 * @param {int} leagueId League id
 * @returns JSON league data or {error: text}
 * @async
 */
export async function callAddPlayer(userId, nickname, leagueId) {
    let url = `${baseurl}/AddPlayer?userId=${userId}&nickname=${nickname}&leagueId=${leagueId}`;
    let response = await typicalCall(url);
    return response;
}

/**
 * Update player
 * @param {int} id Player id
 * @param {string} userId User id
 * @param {string} nickname Nickname
 * @param {int} leagueId League id
 * @returns JSON league data or {error: text}
 * @async
 */
export async function callUpdatePlayer(id, userId, nickname, leagueId) {
    let url = `${baseurl}/UpdatePlayer?id=${id}&userId=${userId}&nickname=${nickname}&leagueId=${leagueId}`;
    let response = await typicalCall(url);
    return response;
}

/**
 * Delete player
 * @param {int} id Player id
 * @returns JSON league data or {error: text}
 * @async
 */
export async function callDeletePlayer(id) {
    let url = `${baseurl}/DeletePlayer?id=${id}`;
    let response = await typicalCall(url);
    return response;
}

/**
 * Add game
 * @param {int} leagueId League id
 * @param {int} player1Id Player 1 id
 * @param {int} player1Score Player 1 score
 * @param {int} player2Id Player 2 id
 * @param {int} player2Score Player 2 score
 * @returns JSON league data or {error: text}
 * @async
 */
export async function callAddGame(leagueId, player1Id, player1Score, player2Id, player2Score) {
    let url = `${baseurl}/AddGame?leagueId=${leagueId}&player1Id=${player1Id}&player1Score=${player1Score}&player2Id=${player2Id}&player2Score=${player2Score}`;
    let response = await typicalCall(url);
    return response;
}

/**
 * Update game
 * @param {int} id Game id
 * @param {int} leagueId League id
 * @param {int} player1Id Player 1 id
 * @param {int} player1Score Player 1 score
 * @param {int} player2Id Player 2 id
 * @param {int} player2Score Player 2 score
 * @returns JSON league data or {error: text}
 * @async
 */
export async function callUpdateGame(id, leagueId, player1Id, player1Score, player2Id, player2Score) {
    let url = `${baseurl}/UpdateGame?id=${id}&leagueId=${leagueId}&player1Id=${player1Id}&player1Score=${player1Score}&player2Id=${player2Id}&player2Score=${player2Score}`;
    let response = await typicalCall(url);
    return response;
}

/**
 * Delete game
 * @param {int} id Game id
 * @returns JSON league data or {error: text}
 * @async
 */
export async function callDeleteGame(id) {
    let url = `${baseurl}/DeleteGame?id=${id}`;
    let response = await typicalCall(url);
    return response;
}

import {useState, useEffect} from 'react';
import {Container, Row, Col, DropdownButton, Dropdown, Table, Alert} from 'react-bootstrap';

const Stats=({loggedInPlayer, thisLeague, players, games}) => {
    const [data, setData] = useState([]); // Players stats info
    const [curr, setCurr] = useState({id: loggedInPlayer.id}); // Currently selected player stats
    const [selId, setSelId] = useState(loggedInPlayer.id); // For the dropdown player selection
    useEffect(() => {
        // Build standings data
        let newData = [];
        players.forEach(player => {
            if (player.leagueId === thisLeague.id) {
                let wins = 0;
                let losses = 0;
                let numGames = 0;
                let totScore = 0;
                let totAgainst = 0;
                games.forEach(game => {
                    if (game.player1Id === player.id) {
                        numGames++;
                        totScore += game.player1Score;
                        totAgainst += game.player2Score;
                        if (game.player1Score > game.player2Score) {
                            wins++;
                        }
                        if (game.player1Score === game.player2Score) {
                            wins += 0.5;
                            losses += 0.5;
                        }
                        if (game.player1Score < game.player2Score) {
                            losses++;
                        }
                    }
                });
                let avgScore = 0;
                let winPct = 0;
                let avgAgainst = 0;
                if (numGames > 0) {
                    avgScore = totScore / numGames;
                    winPct = 100 * wins / numGames;
                    avgAgainst = totAgainst / numGames;
                }
                newData.push({id: player.id, nickname: player.nickname, numGames: numGames, wins: wins, losses: losses, winPct: winPct, avgScore: avgScore, avgAgainst: avgAgainst});
            }
        });
        newData.sort(function(a,b) {
            if (a.winPct !== b.winPct) {
                return b.winPct - a.winPct;
            }
            if (a.avgScore !== b.avgScore) {
                return b.avgScore - a.avgScore;
            }
            return a.avgAgainst - b.avgAgainst;
        })
        let nextRank = 1;
        let newCurr = {id: loggedInPlayer.id};
        for (let i = 0; i < newData.length; i++) {
            newData[i].rank = nextRank;
            nextRank++;
            if (newData[i].id === newCurr.id) {
                setCurr(newData[i]);
            }
        }
        setData(newData);
      },[loggedInPlayer, thisLeague, players, games]);
    
    const handleSelectPlayer = (e) => {
        let newId = parseInt(e);
        for (let i = 0; i < data.length; i++) {
            if (data[i].id === newId) {
                setSelId(e);
                setCurr(data[i]);
            }
        }
    }
    return(<Container fluid>
        <Row>
            <Col sm='auto'>
                <DropdownButton
                  title={selId ? `Selected: ${curr.nickname}` : 'Select a value'}
                  onSelect={handleSelectPlayer}>
                    {players.filter(p => p.leagueId === loggedInPlayer.leagueId).map((p,i) =>
                        <Dropdown.Item eventKey={p.id} key={i}>{p.nickname}</Dropdown.Item>

                    )}
                </DropdownButton>
            </Col>
        </Row>
        <Row>
            <Col sm='auto'>
                <Alert variant='info'>
                    <Alert.Heading>Statistics</Alert.Heading>
                    <Table bordered variant='dark' striped hover size='sm'>
                        <tbody>
                            <tr>
                                <td>Current Rank</td>
                                <td>{curr.rank}</td>
                            </tr>
                            <tr>
                                <td>Games Played</td>
                                <td>{curr.numGames}</td>
                            </tr>
                            <tr>
                                <td>Record</td>
                                <td>{curr.wins}-{curr.losses} ({curr.winPct && curr.winPct.toFixed(1)}%)</td>
                            </tr>
                            <tr>
                                <td>Avg Score</td>
                                <td>{curr.avgScore && curr.avgScore.toFixed(0)}</td>
                            </tr>
                            <tr>
                                <td>Avg Score against</td>
                                <td>{curr.avgAgainst && curr.avgAgainst.toFixed(0)}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Alert>
            </Col>
        </Row>
    </Container>);
}

export default Stats;
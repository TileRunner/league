import {useState, useEffect} from 'react';
import {Container, Row, Col, Table, Alert} from 'react-bootstrap';

const Standings=({thisLeague, players, games}) => {
    const [data, setData] = useState([]); // Players standings info
    useEffect(() => {
        // Build standings data
        let newData = [];
        players.forEach(player => {
            if (player.leagueId === thisLeague.id) {
                let wins = 0;
                let losses = 0;
                let numGames = 0;
                let totScore = 0;
                games.forEach(game => {
                    if (game.player1Id === player.id) {
                        numGames++;
                        totScore += game.player1Score;
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
                if (numGames > 0) {
                    avgScore = totScore / numGames;
                    winPct = 100 * wins / numGames;
                }
                newData.push({nickname: player.nickname, wins: wins, losses: losses, winPct: winPct, avgScore: avgScore});
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
        setData(newData);
      },[thisLeague, players, games]);
    
    return(<Container fluid>
        <Row>
            <Col sm='auto'>
                <Alert variant='info'>
                    <Alert.Heading>Standings:</Alert.Heading>
                    <Table bordered variant='dark' striped hover size='sm'>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th className='smallPad'>Nickname</th>
                                <th className='smallPad centerText'>Win-Loss</th>
                                <th className='smallPad centerText'>Win %</th>
                                <th className='smallPad centerText'>Avg Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item,index) => <tr key={index}>
                                <td className='rightJustify'>{index+1}</td>
                                <td>{item.nickname}</td>
                                <td className='centerText'>{item.wins}-{item.losses}</td>
                                <td className='centerText'>{item.winPct.toFixed(0)}</td>
                                <td className='centerText'>{item.avgScore.toFixed(1)}</td>
                            </tr>)}
                        </tbody>
                    </Table>
                </Alert>
            </Col>
        </Row>
    </Container>);
}

export default Standings;
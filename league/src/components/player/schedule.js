import {useState, useEffect} from 'react';
import {Container, Row, Col, DropdownButton, Dropdown, Table, Alert} from 'react-bootstrap';

const Schedule=({loggedInPlayer, thisLeague, thisLeaguePlayers, thisLeagueGames}) => {
    const [data, setData] = useState([]); // Schedule info
    const [curr, setCurr] = useState({id: loggedInPlayer.id, nickname: loggedInPlayer.nickname, opponents: []}); // Currently selected player schedule
    const [selId, setSelId] = useState(loggedInPlayer.id); // For the dropdown player selection
    const [gch, setGch] = useState([]);
    useEffect(() => {
        // Build game result column headers
        let newGch = [];
        for (let i = 0; i < thisLeague.gamesPerOpp; i++) {
            newGch.push(`G${i+1}`);           
        }
        setGch(newGch);
        // Build schedule data for all players in this league.
        // This page does not change the data used here.
        let newData = [];
        thisLeaguePlayers.forEach(player => {
            let sched = {id: player.id, nickname: player.nickname, opponents: []};
            thisLeaguePlayers.forEach(opponent => {
                if (player.id !== opponent.id) {
                    // Get the games for his opponent
                    let games = thisLeagueGames.filter(g => g.player1Id === player.id && g.player2Id === opponent.id);
                    while (games.length < thisLeague.gamesPerOpp) {
                        games.push({player1Id: player.id, player1Score: 0, player2Id: opponent.id, player2Score: 0});
                    }
                    sched.opponents.push({id: opponent.id, nickname: opponent.nickname, userId: opponent.userId, games: games});
                }
            });
            sched.opponents.sort(function(a,b) {return a.nickname < b.nickname ? -1 : 1});
            newData.push(sched);
        });
        for (let i = 0; i < newData.length; i++) {
            if (newData[i].id === loggedInPlayer.id) {
                setCurr(newData[i]);
            }
        }
        setData(newData);
      },[loggedInPlayer, thisLeague, thisLeaguePlayers, thisLeagueGames]);
    
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
                    {thisLeaguePlayers.map((p,i) =>
                        <Dropdown.Item eventKey={p.id} key={i}>{p.nickname}</Dropdown.Item>
                    )}
                </DropdownButton>
            </Col>
        </Row>
        <Row>
            <Col sm='auto'>
                <Alert variant='info'>
                    <Alert.Heading>Schedule</Alert.Heading>
                    <Table bordered variant='dark' striped hover size='sm'>
                        <thead>
                            <tr>
                                <th>Opponent</th>
                                <th>User ID</th>
                                {gch.map((g,i) => <th key={i}>{g}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {curr.opponents.map((opponent,index) => <tr key={index}>
                                <td>{opponent.nickname}</td>
                                <td>{opponent.userId}</td>
                                {opponent.games.map((game,index2) => <td key={index2} className='centerText'>
                                    {game.player1Score > game.player2Score ?
                                    'W'
                                    : game.player1Score < game.player2Score ?
                                    'L'
                                    : game.player1Score === 0 ?
                                    '?'
                                    :
                                    'T'
                                    }
                                </td>)}
                            </tr>)}
                        </tbody>
                    </Table>
                </Alert>
            </Col>
        </Row>
    </Container>);
}

export default Schedule;
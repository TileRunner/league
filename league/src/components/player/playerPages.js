import {useState,useEffect} from 'react';
import AddGame from './addGame';
import Standings from './standings';
import Stats from './stats';
import Schedule from './schedule';
import { callAddGame } from '../../callApi';
import { Tab, Tabs, Container, Row, Col, Alert, Table } from 'react-bootstrap';
import Register from './register';

const PlayerPages=({loggedInPlayer, setLoggedInPlayer, leagueData, setLeagueData}) => {
    const [thisLeaguePlayers, setThisLeaguePlayers] = useState([]);
    const [thisLeagueGames, setThisLeagueGames] = useState([]);
    const [thisLeague, setThisLeague] = useState({gamesPerOpp: 0});
    const [key, setKey] = useState('home');
    useEffect(() => {
        setThisLeaguePlayers(leagueData.players.filter(p => p.leagueId === loggedInPlayer.leagueId));
        setThisLeagueGames(leagueData.games.filter(g => g.leagueId === loggedInPlayer.leagueId));
        if (leagueData.leagues.filter(l => l.id === loggedInPlayer.leagueId).length === 1) {
            setThisLeague(leagueData.leagues.filter(l => l.id === loggedInPlayer.leagueId)[0]);
        } else {
            setThisLeague({gamesPerOpp: 0});
        }
        
    },[loggedInPlayer, leagueData]);
    const handleSubmitGame = async(newPlayer1Id, newPlayer1Score, newPlayer2Id, newPlayer2Score) => {
        let newLeagueData = await callAddGame(loggedInPlayer.leagueId, newPlayer1Id, newPlayer1Score, newPlayer2Id, newPlayer2Score);
        setLeagueData(newLeagueData);
    }
    return(<div>
        { leagueData.error &&
          <Alert variant='danger'>Error Encountered: {leagueData.errorMessage}</Alert>
        }
        <Tabs id='player-tabs' activeKey={key} onSelect={(k) => setKey(k)} className='mb-3' variant='pills'>
            <Tab eventKey='home' title='Home'>
                <Container fluid>
                    <Row>
                        <Col sm='auto'>
                            <Alert variant='info'>
                                <Alert.Heading>Player Information:</Alert.Heading>
                                <Table variant='dark' bordered striped hover>
                                    <tbody>
                                        <tr>
                                            <th>Internal id:</th>
                                            <td>{loggedInPlayer.id}</td>
                                        </tr>
                                        <tr>
                                            <th>User id:</th>
                                            <td>{loggedInPlayer.userId}</td>
                                        </tr>
                                        <tr>
                                            <th>Nickname:</th>
                                            <td>{loggedInPlayer.nickname}</td>
                                        </tr>
                                        <tr>
                                            <th>League:</th>
                                            <td>
                                                {loggedInPlayer.leagueId === 0 ?
                                                'Unassigned'
                                                :
                                                thisLeague.desc}
                                            </td>
                                        </tr>
                                        {loggedInPlayer.leagueId > 0 && <tr>
                                            <th>League Status:</th>
                                            <td>{thisLeague.status}</td>
                                        </tr>}
                                    </tbody>
                                </Table>
                            </Alert>
                        </Col>
                    </Row>
                </Container>
            </Tab>
            {loggedInPlayer.leagueId > 0 && <Tab eventKey='standings' title='Standings'>
                <Standings thisLeague={thisLeague} players={leagueData.players} games={thisLeagueGames}/>
            </Tab>}
            {loggedInPlayer.leagueId > 0 && <Tab eventKey='schedule' title='Schedule'>
                <Schedule loggedInPlayer={loggedInPlayer} thisLeague={thisLeague} thisLeaguePlayers={thisLeaguePlayers} thisLeagueGames={thisLeagueGames}/>
            </Tab>}
            {loggedInPlayer.leagueId > 0 && thisLeague.status === 'Active' && <Tab eventKey='addGame' title='Add Score'>
                <AddGame loggedInPlayer={loggedInPlayer} thisLeague={thisLeague} thisLeaguePlayers={thisLeaguePlayers} thisLeagueGames={thisLeagueGames} submitData={handleSubmitGame} />
            </Tab>}
            {loggedInPlayer.leagueId > 0 && <Tab eventKey='stats' title='Stats'>
                <Stats loggedInPlayer={loggedInPlayer} thisLeague={thisLeague} players={leagueData.players} games={thisLeagueGames}/>
            </Tab>}
            {loggedInPlayer.leagueId === 0 && <Tab eventKey='register' title='Register'>
                <Register leagueData={leagueData} setLeagueData={setLeagueData} loggedInPlayer={loggedInPlayer} setLoggedInPlayer={setLoggedInPlayer} setKey={setKey}/>
            </Tab>}
        </Tabs>
    </div>)
}

export default PlayerPages;
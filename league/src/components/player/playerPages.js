import {useState,useEffect} from 'react';
import AddGame from './addGame';
import Standings from './standings';
import { callAddGame } from '../../callApi';
import { Tab, Tabs, Container, Row, Col, Alert } from 'react-bootstrap';

const PlayerPages=({loggedInPlayer, leagueData, setLeagueData}) => {
    const [thisLeagueNicknames, setThisLeagueNicknames] = useState([]);
    const [thisLeagueGames, setThisLeagueGames] = useState([]);
    const [thisLeague, setThisLeague] = useState({gamesPerOpp: 0});
    const [key, setKey] = useState('home');
    useEffect(() => {
        setThisLeagueNicknames(leagueData.players.filter(p => p.leagueId === loggedInPlayer.leagueId));
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
        <Container fluid>
            <Row>
                <Col sm='auto'>
                    User Id: {loggedInPlayer.userId}
                </Col>
                <Col sm={'auto'}>
                    Nickname: {loggedInPlayer.nickname}
                </Col>
            </Row>
        </Container>
        <Tabs id='player-tabs' activeKey={key} onSelect={(k) => setKey(k)}>
            <Tab eventKey='home' title='Home'>
                <Alert>Hi {loggedInPlayer.nickname}</Alert>
            </Tab>
            {loggedInPlayer.leagueId > 0 && <Tab eventKey='standings' title='Standings'>
                <Standings thisLeague={thisLeague} players={leagueData.players} games={thisLeagueGames}/>
            </Tab>}
            {loggedInPlayer.leagueId > 0 && <Tab eventKey='schedule' title='Schedule'>
                <Alert>This is where the schedule will display</Alert>
            </Tab>}
            {loggedInPlayer.leagueId > 0 && <Tab eventKey='addGame' title='Add Score'>
                <AddGame loggedInPlayer={loggedInPlayer} thisLeague={thisLeague} nicknames={thisLeagueNicknames} thisLeagueGames={thisLeagueGames} submitData={handleSubmitGame} />
            </Tab>}
            {loggedInPlayer.leagueId > 0 && <Tab eventKey='stats' title='Stats'>
                <Alert>This is where the stats will display</Alert>
            </Tab>}
            {loggedInPlayer.leagueId === 0 && <Tab eventKey='register' title='Register'>
                <Alert>This is where a player can pick a league in the registration phase.</Alert>
            </Tab>}
        </Tabs>
    </div>)
}

export default PlayerPages;
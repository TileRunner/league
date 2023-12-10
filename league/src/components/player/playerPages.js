import {useState,useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AddGame from './addGame';
import { callAddGame } from '../../callApi';

const SUBPAGE_NONE = 0;
const SUBPAGE_ADD_GAME = 1;
const PlayerPages=({loggedInPlayer, leagueData, setLeagueData}) => {
    const [subpage, setSubpage] = useState(SUBPAGE_NONE);
    const [thisLeagueNicknames, setThisLeagueNicknames] = useState([]);
    const [thisLeagueGames, setThisLeagueGames] = useState([]);
    useEffect(() => {
        setThisLeagueNicknames(leagueData.players.filter(p => p.leagueId === loggedInPlayer.leagueId));
        setThisLeagueGames(leagueData.games.filter(g => g.leagueId === loggedInPlayer.leagueId));
    },[loggedInPlayer, leagueData]);
    const handleSubmitGame = async(newPlayer1Id, newPlayer1Score, newPlayer2Id, newPlayer2Score) => {
        let newLeagueData = await callAddGame(loggedInPlayer.leagueId, newPlayer1Id, newPlayer1Score, newPlayer2Id, newPlayer2Score);
        setLeagueData(newLeagueData);
        setSubpage(SUBPAGE_NONE);
    }
    const cancelAddGame = () => {
        setSubpage(SUBPAGE_NONE);
    }
    return(<Container>
        { leagueData.error && <Row><Col>
          <Alert variant='danger'>Error Encountered: {leagueData.errorMessage}</Alert>
          </Col></Row>
        }
        <Row>
            <Col sm={1}>
                User Id:
            </Col>
            <Col sm={2}>
                {loggedInPlayer.userId}
            </Col>
        </Row>
        <Row>
            <Col sm={1}>
                Nickname:
            </Col>
            <Col sm={2}>
                {loggedInPlayer.nickname}
            </Col>
        </Row>
        {subpage === SUBPAGE_NONE && <Row>
            <Col sm='auto'>
                <Alert>This leagues has {thisLeagueGames.length} recorded games.</Alert>
                <Button onClick={()=>{setSubpage(SUBPAGE_ADD_GAME)}}>Add Game</Button>
            </Col>
        </Row>}
        {subpage === SUBPAGE_ADD_GAME && <AddGame loggedInPlayer={loggedInPlayer} nicknames={thisLeagueNicknames} submitData={handleSubmitGame} cancelOperation={cancelAddGame}/>}
    </Container>)
}

export default PlayerPages;
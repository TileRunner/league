import {useState, useEffect} from 'react';
import AddGame from "./addGame";
import { callAddGame } from '../../callApi';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const ShowGameResults=({leagueId, setLeagueId, leagueData, setLeagueData}) => {
    const [addingGame, setAddingGame] = useState(false); // Set to true when adding game
    const [thisLeagueNicknames, setThisLeagueNicknames] = useState([]);
    const [thisLeagueGames, setThisLeagueGames] = useState([]);
    useEffect(() => {
        setThisLeagueNicknames(leagueData.players.filter(p => p.leagueId === leagueId));
        setThisLeagueGames(leagueData.games.filter(g => g.leagueId === leagueId));
    },[leagueId, leagueData]);
    const handleSubmitGame = async(newPlayer1Id, newPlayer1Score, newPlayer2Id, newPlayer2Score) => {
        let newLeagueData = await callAddGame(leagueId, newPlayer1Id, newPlayer1Score, newPlayer2Id, newPlayer2Score);
        setLeagueData(newLeagueData);
        setAddingGame(false);
    }
    const cancelAddGame = () => {
        setAddingGame(false);
    }
    const MainDisplay = <Container>
        <Row>
            <Col>
                <ButtonGroup aria-label="Main Actions">
                    <Button variant="secondary" onClick={()=>{setLeagueId(-1)}}>Return</Button>
                    <Button variant="primary" onClick={()=>{setAddingGame(true); } }>Add game</Button>
                </ButtonGroup>
            </Col>
        </Row>        
        {thisLeagueGames && thisLeagueGames.length ?
            <Row><Col sm='auto'>
                <Table striped bordered hover size='sm' variant='dark'>
                    <thead>
                        <tr>
                            <th>Player 1</th>
                            <th>Player 1 score</th>
                            <th>Player 2</th>
                            <th>Player 2 score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {thisLeagueGames.map((game, index) => <tr key={index}>
                            <td>{thisLeagueNicknames.filter(n => n.id === game.player1Id)[0].nickname}</td>
                            <td>{game.player1Score}</td>
                            <td>{thisLeagueNicknames.filter(n => n.id === game.player2Id)[0].nickname}</td>
                            <td>{game.player2Score}</td>
                        </tr>
                        )}
                    </tbody>
                </Table>
            </Col></Row>
            :
            <Row>
                <Alert variant='secondary'>No games yet</Alert>
            </Row>
            }
        </Container>;
    return(<div>
        { leagueData.error ?
          <Alert variant='danger'>Error Encountered: {leagueData.errorMessage}</Alert>
        : addingGame ?
            <AddGame nicknames={thisLeagueNicknames} submitData={handleSubmitGame} cancelOperation={cancelAddGame}></AddGame>
        :
            MainDisplay
        }
    </div>)
}

export default ShowGameResults;
import {useState, useEffect} from 'react';
import {callAddGame, callDeleteGame, callUpdateGame} from '../../callApi';
import {Button, Table, Container, Alert, Row, Col, Offcanvas} from 'react-bootstrap';
import FixGame from './fixGame';

const ManageGames=({leagueId, setLeagueId, leagueData, setLeagueData}) => {
    const [thisLeague, setThisLeague] = useState({});
    const [data, setData] = useState([]); // Games organized for display
    const [updatingGame, setUpdatingGame] = useState(false);
    const [gameToUpdate, setGameToUpdate] = useState({});
    useEffect(() => {
        function checkLeagueId(entry) {
            return entry.id === leagueId;
        }
        function findPlayer(id) {
            let player = {id: id, userId: 'Not Found', nickname: 'Not Found'};
            for (let i = 0; i < leagueData.players.length; i++) {
                if (leagueData.players[i].id === id) {
                    player = leagueData.players[i];
                }
            }
            return player;
        }
        function scoreMismatch(game) {
            let t1 = 0;
            let t2 = 0;
            for (let i = 0; i < leagueData.games.length; i++) {
                const item = leagueData.games[i];
                if (item.player1Id === game.player1Id &&
                    item.player1Score === game.player1Score &&
                    item.player2Id === game.player2Id &&
                    item.player2Score === game.player2Score &&
                    item.leagueId === game.leagueId) {
                        t1++;
                }
                if (item.player1Id === game.player2Id &&
                    item.player1Score === game.player2Score &&
                    item.player2Id === game.player1Id &&
                    item.player2Score === game.player1Score &&
                    item.leagueId === game.leagueId) {
                        t2++;
                }
            }
            return (t1 !== t2);
        }
        let foundLeague = leagueData.leagues.find(checkLeagueId);
        if (foundLeague) {
            setThisLeague(foundLeague);
        } else {
            setThisLeague({desc:"Not found!"});
        }
        let newData = leagueData.games.filter(g => g.leagueId === leagueId);
        newData.forEach(game => {
            let p1 = findPlayer(game.player1Id);
            let p2 = findPlayer(game.player2Id);
            game.player1UserId = p1.userId;
            game.player1Nickname = p1.nickname;
            game.player2UserId = p2.userId;
            game.player2Nickname = p2.nickname;
            game.scoreMismatch = scoreMismatch(game);
        });
        newData.sort(function(a,b) {
            if (a.player1UserId < b.player1UserId) {return -1;}
            if (a.player1UserId > b.player1UserId) {return 1;}
            if (a.player2UserId < b.player2UserId) {return -1;}
            if (a.player2UserId > b.player2UserId) {return 1;}
            return a.id - b.id;
        });
        setData(newData);
    },[leagueId, leagueData]);
    
    const handleDeleteGame = async(id) => {
        let newLeagueData = await callDeleteGame(id);
        setLeagueData(newLeagueData);
    }
    const handleUpdateGame = async(game) => {
        let newLeagueData = await callUpdateGame(game.id, game.leagueId, game.player1Id, game.player1Score, game.player2Id, game.player2Score);
        setLeagueData(newLeagueData);
        setUpdatingGame(false);
    }
    const handleAddComplement = async(game) => {
        let newLeagueData = await callAddGame(leagueId, game.player2Id, game.player2Score, game.player1Id, game.player1Score);
        setLeagueData(newLeagueData);
    }
    const handleRequestFix = (game) => {
        setGameToUpdate(game);
        setUpdatingGame(true);
    }
    return(<Container fluid>
        <Row>
            <Col sm='auto'>
                <Button onClick={()=>{setLeagueId(-1)}}>Go Back</Button>
            </Col>
            <Col sm='auto'>
                <Alert variant='secondary'>League: {thisLeague.desc}</Alert>
            </Col>
        </Row>
        { leagueData.error && <Row><Col>
          <Alert variant='danger'>Error Encountered: {leagueData.errorMessage}</Alert>
          </Col></Row>
        }
        { data && data.length ?
            <Row>
                <Col sm='auto'>
                <Alert variant='info'>
                    <Alert.Heading as='Container'>Games. Player 1 is the player that entered the result. Both players should enter the result.</Alert.Heading>
                    <Alert.Heading>
                        <Row>
                            <Col sm='auto'>Actions:</Col>
                            <Col sm='auto'><span className="material-symbols-outlined">delete</span>delete</Col>
                            <Col sm='auto'><span className="material-symbols-outlined">edit</span>edit scores</Col>
                            <Col sm='auto'><span className="material-symbols-outlined">sync</span>add game for player 2</Col>
                        </Row>
                    </Alert.Heading>
                    <Table striped bordered hover size='sm' variant='dark'>
                        <thead>
                            <tr>
                            <th colSpan={3} className='centerText'>Player 1</th>
                            <th colSpan={3} className='centerText'>Player 2</th>
                            <th colSpan={2}/>
                            </tr>
                            <tr>
                                <th>User Id</th>
                                <th>Nickname</th>
                                <th>Score</th>
                                <th>User Id</th>
                                <th>Nickname</th>
                                <th>Score</th>
                                <th>Action</th>
                                <th>Flag</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((game,index)=>
                                <tr key={index}>
                                    <td className={updatingGame && game.id === gameToUpdate.id ? 'highlight' : ''}>{game.player1UserId}</td>
                                    <td className={updatingGame && game.id === gameToUpdate.id ? 'highlight' : ''}>{game.player1Nickname}</td>
                                    <td className={updatingGame && game.id === gameToUpdate.id ? 'highlight' : ''}>{game.player1Score}</td>
                                    <td className={updatingGame && game.id === gameToUpdate.id ? 'highlight' : ''}>{game.player2UserId}</td>
                                    <td className={updatingGame && game.id === gameToUpdate.id ? 'highlight' : ''}>{game.player2Nickname}</td>
                                    <td className={updatingGame && game.id === gameToUpdate.id ? 'highlight' : ''}>{game.player2Score}</td>
                                    <td>
                                        <span
                                            data-bs-toggle='tooltip'
                                            title='Delete game'
                                            onClick={()=>{handleDeleteGame(game.id)}}
                                            className="material-symbols-outlined">
                                            delete
                                        </span>
                                        <span
                                            data-bs-toggle='tooltip'
                                            title='Edit game scores'
                                            onClick={()=>{handleRequestFix(game)}}
                                            className="material-symbols-outlined">
                                            edit
                                        </span>
                                        {game.scoreMismatch &&
                                            <span
                                                data-bs-toggle='tooltip'
                                                title='Add complementary result for player 2'
                                                onClick={()=>{handleAddComplement(game)}}
                                                className="material-symbols-outlined">
                                                sync
                                            </span>
                                        }
                                    </td>
                                    <td>
                                        {game.scoreMismatch ?
                                            <span
                                            data-bs-toggle='tooltip'
                                            title='Either waiting for other player to enter result, or result mismatch'
                                            className="material-symbols-outlined">warning</span>
                                        :
                                            <span
                                            data-bs-toggle='tooltip'
                                            title='Scores match'
                                            className="material-symbols-outlined">check</span>
                                        }
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Alert>
                </Col>
            </Row>
        :
        <Alert variant='warning'>No league games yet</Alert>
        }
        <Offcanvas show={updatingGame} onHide={()=>{setUpdatingGame(false);}} placement='end'>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Fix Game</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <FixGame game={gameToUpdate} submitUpdatedGame={handleUpdateGame}/>
            </Offcanvas.Body>
        </Offcanvas>
    </Container>)
}

export default ManageGames;
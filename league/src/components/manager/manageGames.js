import {useState, useEffect} from 'react';
import {callAddGame, callDeleteGame, callUpdateGame} from '../../callApi';
import {ButtonGroup, Button, Table, Container, Alert, Row, Col, Offcanvas} from 'react-bootstrap';
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
                    <Alert.Heading>Player 1 is the player that entered the result. Both players should enter the result.</Alert.Heading>
                    <Alert.Heading>If only one player entered the result you will see UNMATCHED. Click COMPLEMENT to add the missing result.</Alert.Heading>
                    <Alert.Heading>If players entered differing results you will see UNMATCHED. Click FIX to fix the scores.</Alert.Heading>
                <Table striped bordered hover size='sm' variant='dark'>
                    <thead>
                        <tr>
                            <th>Player 1 User Id</th>
                            <th>Player 1 Nickname</th>
                            <th>Player 1 Score</th>
                            <th>Player 2 User Id</th>
                            <th>Player 2 Nickname</th>
                            <th>Player 2 Score</th>
                            <th>Action</th>
                            <th>Match</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((game,index)=>
                            <tr key={index} className={updatingGame && game.id === gameToUpdate.id ? 'highlight' : ''}>
                                <td>{game.player1UserId}</td>
                                <td>{game.player1Nickname}</td>
                                <td>{game.player1Score}</td>
                                <td>{game.player2UserId}</td>
                                <td>{game.player2Nickname}</td>
                                <td>{game.player2Score}</td>
                                <td>
                                    <Button onClick={()=>{handleDeleteGame(game.id)}}>DELETE</Button>
                                </td>
                                <td>
                                    {game.scoreMismatch ? 'UNMATCHED' : 'OK'}
                                    {game.scoreMismatch &&
                                    <ButtonGroup>
                                        <Button onClick={()=>{handleAddComplement(game)}}>ADD COMPLEMENT</Button>
                                        <Button onClick={()=>{handleRequestFix(game)}}>FIX SCORES</Button>
                                    </ButtonGroup>
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
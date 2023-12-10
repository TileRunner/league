import {useState,useEffect} from 'react';
import {Container, Form, Button, Row, Col, Table, Alert} from 'react-bootstrap';

const AddGame=({loggedInPlayer, thisLeague, nicknames, thisLeagueGames, submitData}) => {
    const newPlayer1Id = loggedInPlayer.id;
    const [newPlayer1Score, setNewPlayer1Score] = useState(0);
    const [newPlayer2Id, setNewPlayer2Id] = useState(0);
    const [newPlayer2Score, setNewPlayer2Score] = useState(0);
    const [games, setGames] = useState([]); // Games against selected opponent
    useEffect(() => {
        let newGames = [];
        thisLeagueGames.forEach(game => {
            if ((game.player1Id === newPlayer1Id) && (game.player2Id === newPlayer2Id)) {
                newGames.push({yourScore: game.player1Score, opponentScore: game.player2Score});
            }
        });
        setGames(newGames);
      },[newPlayer1Id, newPlayer2Id, thisLeagueGames]);
    
    function handleSubmit(event) {
        event.preventDefault();
        if (thisLeague.gamesPerOpp >= games.length) {
            alert(`All ${thisLeague.gamesPerOpp} games already entered`);
            return;
        }
        if (isDataAcceptable()) {
            submitData(newPlayer1Id, parseInt(newPlayer1Score), newPlayer2Id, parseInt(newPlayer2Score));
            setNewPlayer1Score(0);
            setNewPlayer2Id(0);
            setNewPlayer2Score(0);
        }
    }
    function handleSelectPlayer2(event) {
        setNewPlayer2Id(parseInt(event.target.value));
    }
    function isDataAcceptable() {
        if (newPlayer2Id === 0) {
            alert('Pick opponent, please.');
            return false;
        }
        if (!isValidNumberFormat(newPlayer1Score)) {
            alert('Enter a valid score, please.');
            return false;
        }
        if (!isValidNumberFormat(newPlayer2Score)) {
            alert('Enter a valid opponent score, please.');
            return false;
        }
        return true;
    }
    function isValidNumberFormat(s) {
        let numericPattern = /^[0-9]+$/;
        return numericPattern.test(s);
    }
    return(<Container>
        <Form onSubmit={handleSubmit}>
            <Form.Label as={'h1'}>Enter new game result:</Form.Label>
            <Form.Group as={Row} controlId="playerSelection">
                <Form.Label column sm={2}>Opponent:</Form.Label>
                <Col sm={2}>
                    <Form.Select onChange={handleSelectPlayer2}>
                        <option value={0}>Select opponent</option>
                        {nicknames.map((n,i) =>
                            n.id !== loggedInPlayer.id && <option key={i} value={n.id}>{n.userId}: {n.nickname}</option>
                        )}
                    </Form.Select>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="yourScore">
                <Form.Label column sm={2}>Your score:</Form.Label>
                <Col sm={2}>
                    <Form.Control
                        className="sm-1"
                        type="text"
                        value={newPlayer1Score}
                        onChange={e => { setNewPlayer1Score(e.target.value); } }
                        isInvalid={!isValidNumberFormat(newPlayer1Score)} />
                    <Form.Control.Feedback type="invalid">Must be numeric</Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="opponentScore">
                <Form.Label column sm={2}>Opponent score:</Form.Label>
                <Col sm={2}>
                    <Form.Control
                        className="sm-1"
                        type="text"
                        value={newPlayer2Score}
                        onChange={e => { setNewPlayer2Score(e.target.value); } }
                        isInvalid={!isValidNumberFormat(newPlayer2Score)} />
                    <Form.Control.Feedback type="invalid">Must be numeric</Form.Control.Feedback>
                </Col>
            </Form.Group>
            <Row>
                <Col xs='auto'>
                    <Button
                    variant='primary'
                    type='submit'
                    >
                        Submit
                    </Button>
                </Col>
            </Row>
        </Form>
        {games.length > 0 && <Row>
            <Col sm='auto'>
                <Alert variant='info'>
                    <Alert.Heading>Previous games against selected opponent:</Alert.Heading>
                    <Table bordered variant='dark' striped hover size='sm'>
                        <thead>
                            <tr>
                                <th>Game #</th>
                                <th>Your Score</th>
                                <th>Opponent Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {games.map((game,index) =>
                            <tr key={index}>
                                <td>{index+1}</td>
                                <td>{game.yourScore}</td>
                                <td>{game.opponentScore}</td>
                            </tr>)}
                        </tbody>
                    </Table>
                </Alert>
            </Col>
        </Row>}
    </Container>);
}

export default AddGame;
import {useState} from 'react';
import {Container, Form, Button, Row, Col} from 'react-bootstrap';

const FixGame=({game, submitUpdatedGame}) => {
    const [newPlayer1Score, setNewPlayer1Score] = useState(game.player1Score);
    const [newPlayer2Score, setNewPlayer2Score] = useState(game.player2Score);
    
    function handleSubmit(event) {
        event.preventDefault();
        if (isDataAcceptable()) {
            let updatedGame = game;
            updatedGame.player1Score = newPlayer1Score;
            updatedGame.player2Score = newPlayer2Score;
            submitUpdatedGame(updatedGame);
            setNewPlayer1Score(0);
            setNewPlayer2Score(0);
        }
    }
    function isDataAcceptable() {
        if (!isValidNumberFormat(newPlayer1Score)) {
            alert('Enter a valid player 1 score, please.');
            return false;
        }
        if (!isValidNumberFormat(newPlayer2Score)) {
            alert('Enter a valid player 2 score, please.');
            return false;
        }
        return true;
    }
    function isValidNumberFormat(s) {
        let numericPattern = /^[0-9]+$/;
        return numericPattern.test(s);
    }
    return(<Container fluid>
        <Form onSubmit={handleSubmit}>
            <Form.Label as={'h1'}>Fix game result:</Form.Label>
            <Form.Group controlId="player1Score">
                <Row>
                    <Form.Label column sm={2}>{game.player1Nickname}:</Form.Label>
                </Row>
                <Row>
                    <Form.Control
                        className="sm-1"
                        type="text"
                        value={newPlayer1Score}
                        onChange={e => { setNewPlayer1Score(e.target.value); } }
                        isInvalid={!isValidNumberFormat(newPlayer1Score)} />
                    <Form.Control.Feedback type="invalid">Must be numeric</Form.Control.Feedback>
                </Row>
            </Form.Group>
            <Form.Group controlId="player2Score">
                <Row>
                    <Form.Label column sm={2}>{game.player2Nickname}:</Form.Label>
                </Row>
                <Row>
                    <Form.Control
                        className="sm-1"
                        type="text"
                        value={newPlayer2Score}
                        onChange={e => { setNewPlayer2Score(e.target.value); } }
                        isInvalid={!isValidNumberFormat(newPlayer2Score)} />
                    <Form.Control.Feedback type="invalid">Must be numeric</Form.Control.Feedback>
                </Row>
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
    </Container>);
}

export default FixGame;
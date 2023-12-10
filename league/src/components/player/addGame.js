import {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const AddGame=({loggedInPlayer, nicknames, submitData, cancelOperation}) => {
    const newPlayer1Id = loggedInPlayer.id;
    const [newPlayer1Score, setNewPlayer1Score] = useState(0);
    const [newPlayer2Id, setNewPlayer2Id] = useState(0);
    const [newPlayer2Score, setNewPlayer2Score] = useState(0);
    function handleSubmit(event) {
        event.preventDefault();
        if (isDataAcceptable()) {
            submitData(newPlayer1Id, parseInt(newPlayer1Score), newPlayer2Id, parseInt(newPlayer2Score));
        }
    }
    function handleSelectPlayer2(event) {
        setNewPlayer2Id(event.target.value);
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
    return(<Form onSubmit={handleSubmit}>
        <Form.Label as={'h1'}>Enter game result:</Form.Label>
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
                variant='danger'
                type='button'
                onClick={cancelOperation}
                >
                    Cancel
                </Button>
            </Col>
            <Col xs='auto'>
                <Button
                variant='primary'
                type='submit'
                >
                    Submit
                </Button>
            </Col>
        </Row>
    </Form>);
}

export default AddGame;
import {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const AddLeague=({submitData, cancelOperation}) => {
    const [newDesc, setNewDesc] = useState("");
    const [newStartDate, setNewStartDate] = useState("");
    const [newEndDate, setNewEndDate] = useState("");
    const newStatus = 'Registration';
    const [newGamesPerOpp, setNewGamesPerOpp] = useState(3); // Default number of games per pair of opponents
    function handleSubmit(event) {
        event.preventDefault();
        if (isDataAcceptable()) {
            submitData(newDesc, newStartDate, newEndDate, newStatus, newGamesPerOpp);
        }
    }
    function isDataAcceptable() {
        return newDesc.length > 0 && isValidFormat(newDesc) &&
         newStartDate.length > 0 && isValidDateFormat(newStartDate) &&
         newEndDate.length > 0 && isValidDateFormat(newEndDate);
    }
    function isValidFormat(s) {
        let alphanumericPattern = /^[ A-Za-z0-9]+$/;
        return alphanumericPattern.test(s);
    }
    function isValidDateFormat(s) {
        let datePattern = /^[- A-Za-z0-9]+$/;
        return datePattern.test(s);
    }
    return(<Form onSubmit={handleSubmit}>
        <Form.Label as={'h1'}>Enter a new league:</Form.Label>
        <Form.Group as={Row} controlId="startDate">
            <Form.Label column sm={2}>Start Date:</Form.Label>
            <Col sm={7}>
                <Form.Control
                    className="mb-3"
                    type="text"
                    value={newStartDate}
                    onChange={e => { setNewStartDate(e.target.value); } }
                    isInvalid={newStartDate && !isValidDateFormat(newStartDate)} />
                <Form.Control.Feedback type="invalid">Must only use letters and/or numbers and/or spaces and/or dashes</Form.Control.Feedback>
            </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="endDate">
            <Form.Label column sm={2}>End Date:</Form.Label>
            <Col sm={7}>
                <Form.Control
                    className="mb-3"
                    type="text"
                    value={newEndDate}
                    onChange={e => { setNewEndDate(e.target.value); } }
                    isInvalid={newEndDate && !isValidDateFormat(newEndDate)} />
                <Form.Control.Feedback type="invalid">Must only use letters and/or numbers and/or spaces and/or dashes</Form.Control.Feedback>
            </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="desc">
            <Form.Label column sm={2}>Description:</Form.Label>
            <Col sm={7}>
                <Form.Control
                    className="mb-3"
                    type="text"
                    value={newDesc}
                    onChange={e => { setNewDesc(e.target.value); } }
                    isInvalid={newDesc && !isValidFormat(newDesc)} />
                <Form.Control.Feedback type="invalid">Must only use letters and/or numbers and/or spaces</Form.Control.Feedback>
            </Col>
        </Form.Group>
        <Form.Group as={Row} controlId='gamesPerOpp'>
            <Form.Label column sm={2}>Games per pair:</Form.Label>
            <Col sm={7}>
                <Form.Control
                    className='mb-3'
                    type='number'
                    value={newGamesPerOpp}
                    onChange={e => {setNewGamesPerOpp(e.target.value);}}
                    />
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

export default AddLeague;
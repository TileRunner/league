import {useState, useEffect} from 'react';
import { callAddPlayer, callDeletePlayer } from '../../callApi';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

const ManagePlayers=({leagueId, setLeagueId, leagueData, setLeagueData}) => {
    const [newUserId, setNewUserId] = useState("");
    const [newNickname, setNewNickname] = useState("");
    const [thisLeague, setThisLeague] = useState({});
    useEffect(() => {
        function checkId(entry) {
            return entry.id === leagueId;
        }
        let foundLeague = leagueData.leagues.find(checkId);
        if (foundLeague) {
            setThisLeague(foundLeague);
        } else {
            setThisLeague({desc:"Not found!"});
        }
    },[leagueId, leagueData]);
    
    
    const handleSubmitPlayer = async(event) => {
        event.preventDefault();
        if (isValidFormat(newUserId) && isValidFormat(newNickname)) {
            let newLeagueData = await callAddPlayer(newUserId, newNickname, leagueId);
            setLeagueData(newLeagueData);
            setNewUserId("");
            setNewNickname("");
        }
    }
    const handleDeletePlayer = async(id) => {
        let newLeagueData = await callDeletePlayer(id);
        setLeagueData(newLeagueData);
    }
    function isValidFormat(s) {
        let alphanumericPattern = /^[ A-Za-z0-9]+$/;
        return alphanumericPattern.test(s);
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
        <Row>
            <Col sm='auto'>
                <Alert variant='info'>
                    <Alert.Heading>Add new user:</Alert.Heading>
                    <Form onSubmit={handleSubmitPlayer}>
                        <Form.Group controlId="newUserEntry">
                            <Row>
                                <Col sm={'auto'}>
                                    <Form.Label>New User Id:</Form.Label>
                                </Col>
                                <Col sm={'auto'}>
                                    <Form.Control
                                        className="sm-1"
                                        type="text"
                                        value={newUserId}
                                        onChange={e => { setNewUserId(e.target.value); } }
                                        isInvalid={newUserId && !isValidFormat(newUserId)} />
                                    <Form.Control.Feedback type="invalid">Must only use letters and/or numbers and/or spaces and/or dashes</Form.Control.Feedback>
                                </Col>
                                <Col sm={'auto'}>
                                    <Form.Label>Nickname:</Form.Label>
                                </Col>
                                <Col sm={'auto'}>
                                    <Form.Control
                                        className="sm-1"
                                        type="text"
                                        value={newNickname}
                                        onChange={e => { setNewNickname(e.target.value); } }
                                        isInvalid={newNickname && !isValidFormat(newNickname)} />
                                    <Form.Control.Feedback type="invalid">Must only use letters and/or numbers and/or spaces and/or dashes</Form.Control.Feedback>
                                </Col>
                                <Col>
                                    <Button type="submit">Submit</Button>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Form>
                </Alert>
            </Col>
        </Row>
        { leagueData && leagueData.players && leagueData.players.filter(p => p.leagueId === leagueId).length ?
            <Row><Col sm='auto'>
                <Table striped bordered hover size='sm' variant='dark'>
                    <thead>
                        <tr>
                            <th>User Id</th>
                            <th>Nickname</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leagueData.players.filter(p => p.leagueId === leagueId).map((player,index)=>
                            <tr key={index}>
                                <td>{player.userId}</td>
                                <td>{player.nickname}</td>
                                <td>
                                    <span
                                        data-bs-toggle='tooltip'
                                        title='Delete player'
                                        onClick={()=>{handleDeletePlayer(player.id)}}
                                        className="material-symbols-outlined">
                                        delete
                                    </span>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Col></Row>
        :
        <Alert variant='warning'>No league players yet</Alert>
        }
    </Container>)
}

export default ManagePlayers;
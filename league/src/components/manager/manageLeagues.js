import {useState} from 'react';
import { callAddLeague, callDeleteLeague } from '../../callApi';
import ManagePlayers from './managePlayers';
import AddLeague from './addLeague';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const ManageLeagues=({setModeHome, leagueData, setLeagueData}) => {
    const [leagueId, setLeagueId] = useState(-1); // Set to league id when managing players
    const [addingLeague, setAddingLeague] = useState(false); // Set to true when adding league
    const handleSubmitLeague = async(newDesc, newStartDate, newEndDate, newStatus, newGamesPerOpp) => {
        let newLeagueData = await callAddLeague(newDesc, newStartDate, newEndDate, newStatus, newGamesPerOpp);
        setLeagueData(newLeagueData);
        setAddingLeague(false);
    }
    const cancelAddLeague = () => {
        setAddingLeague(false);
    }
    const handleDeleteLeague = async(id) => {
        let newLeagueData = await callDeleteLeague(id);
        setLeagueData(newLeagueData);
    }
    const MainDisplay = <Container>
        <Row>
            <Col>
                <ButtonGroup aria-label="Main Actions">
                    <Button variant="secondary" onClick={setModeHome}>Home</Button>
                    <Button variant="primary" onClick={() => { setAddingLeague(true); } }>Add League</Button>
                </ButtonGroup>
            </Col>
        </Row>        
        {leagueData && leagueData.leagues && leagueData.leagues.length ?
            <Row><Col sm='auto'>
                <Table striped bordered hover size='sm' variant='dark'>
                    <thead>
                        <tr>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Games per Opp</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leagueData.leagues.map((league, index) => <tr key={index}>
                            <td>{league.startDate}</td>
                            <td>{league.endDate}</td>
                            <td>{league.desc}</td>
                            <td>{league.status}</td>
                            <td>{league.gamesPerOpp}</td>
                            <td>
                                <ButtonGroup aria-label='League actions'>
                                    <Button variant='primary' onClick={() => { setLeagueId(league.id); } }>Players</Button>
                                    <Button variant='danger' onClick={() => { handleDeleteLeague(league.id); } }>Delete</Button>
                                </ButtonGroup>
                            </td>
                        </tr>
                        )}
                    </tbody>
                </Table>
            </Col></Row>
            :
            <Row>
                <Alert variant='secondary'>No leagues yet</Alert>
            </Row>
            }
        </Container>;
    return(<div>
        { leagueData.error ?
          <Alert variant='danger'>Error Encountered: {leagueData.errorMessage}</Alert>
        : leagueId > -1 ?
            <ManagePlayers leagueId={leagueId} setLeagueId={setLeagueId} leagueData={leagueData} setLeagueData={setLeagueData}></ManagePlayers>
        : addingLeague ?
            <AddLeague submitData={handleSubmitLeague} cancelOperation={cancelAddLeague}></AddLeague>
        :
            MainDisplay
        }
    </div>)
}

export default ManageLeagues;
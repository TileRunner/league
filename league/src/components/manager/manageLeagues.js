import {useState} from 'react';
import { callAddLeague, callUpdateLeague, callDeleteLeague } from '../../callApi';
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
    const handleUpateLeagueStatus = async(league, newStatus) => {
        let newLeagueData = await callUpdateLeague(league.id, league.desc, league.startDate, league.endDate, newStatus, league.gamesPerOpp);
        setLeagueData(newLeagueData);
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
                            <th colSpan={3} className='centerText'>Action</th>
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
                                <Button variant='secondary' onClick={() => { setLeagueId(league.id); } }>Players</Button>
                            </td>
                            <td>
                                {league.status === 'Registration' && 
                                    <Button variant='primary' onClick={() => {handleUpateLeagueStatus(league,'Active');}}>Activate</Button>
                                }
                                {league.status === 'Active' && <ButtonGroup>
                                    <Button variant='primary' onClick={() => {handleUpateLeagueStatus(league,'Registration');}}>Deactivate</Button>
                                    <Button variant='primary' onClick={() => {handleUpateLeagueStatus(league,'Closed');}}>Close</Button>
                                </ButtonGroup>}
                                {league.status === 'Closed' &&
                                    <Button variant='primary' onClick={() => {handleUpateLeagueStatus(league,'Active');}}>Reopen</Button>
                                }
                            </td>
                            <td>
                                <Button variant='danger' onClick={() => { handleDeleteLeague(league.id); } }>Delete</Button>
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
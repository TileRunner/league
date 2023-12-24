import {useState} from 'react';
import * as c from '../../constants';
import { callAddLeague, callUpdateLeague, callDeleteLeague } from '../../callApi';
import ManagePlayers from './managePlayers';
import ManageGames from './manageGames';
import AddLeague from './addLeague';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const ManageLeagues=({setModeHome, leagueData, setLeagueData}) => {
    const [leagueIdForPlayers, setLeagueIdForPlayers] = useState(-1); // Set to league id when managing players
    const [leagueIdForGames, setLeagueIdForGames] = useState(-1); // Set to league id when managing games
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
                            <th>Games per Opp</th>
                            <th>Status / Action</th>
                            <th className='centerText'>Manage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leagueData.leagues.map((league, index) => <tr key={index}>
                            <td>{league.startDate}</td>
                            <td>{league.endDate}</td>
                            <td>{league.desc}</td>
                            <td>{league.gamesPerOpp}</td>
                            <td>
                                {league.status}
                                {league.status === c.ST_REG && <span
                                    data-bs-toggle='tooltip'
                                    title='Start the league'
                                    onClick={() => {handleUpateLeagueStatus(league,c.ST_ACT);}}
                                    className="material-symbols-outlined">
                                    play_arrow
                                </span>}
                                {league.status === c.ST_ACT && <span
                                    data-bs-toggle='tooltip'
                                    title='Deactivate back to Registration status'
                                    onClick={() => {handleUpateLeagueStatus(league,c.ST_REG);}}
                                    className="material-symbols-outlined">
                                    undo
                                </span>}
                                {league.status === c.ST_ACT && <span
                                    data-bs-toggle='tooltip'
                                    title='Close the league'
                                    onClick={() => {handleUpateLeagueStatus(league,c.ST_CLS);}}
                                    className="material-symbols-outlined">
                                    stop
                                </span>}
                                {league.status === c.ST_CLS && <span
                                    data-bs-toggle='tooltip'
                                    title='Reopen the league'
                                    onClick={() => {handleUpateLeagueStatus(league,c.ST_ACT);}}
                                    className="material-symbols-outlined">
                                    redo
                                </span>}
                                {league.status === c.ST_CLS && <span
                                    data-bs-toggle='tooltip'
                                    title='Delete the league'
                                    onClick={() => {handleDeleteLeague(league.id);}}
                                    className="material-symbols-outlined">
                                    delete
                                </span>}
                            </td>
                            <td>
                                <span
                                    data-bs-toggle='tooltip'
                                    title='Manage players'
                                    onClick={() => { setLeagueIdForPlayers(league.id); } }
                                    className="material-symbols-outlined">
                                    group
                                </span>
                                <span
                                    data-bs-toggle='tooltip'
                                    title='Manage games'
                                    onClick={() => { setLeagueIdForGames(league.id); } }
                                    className="material-symbols-outlined">
                                    view_list
                                </span>
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
        : leagueIdForPlayers > -1 ?
            <ManagePlayers leagueId={leagueIdForPlayers} setLeagueId={setLeagueIdForPlayers} leagueData={leagueData} setLeagueData={setLeagueData}></ManagePlayers>
        : leagueIdForGames > -1 ?
            <ManageGames leagueId={leagueIdForGames} setLeagueId={setLeagueIdForGames} leagueData={leagueData} setLeagueData={setLeagueData}></ManageGames>
        : addingLeague ?
            <AddLeague submitData={handleSubmitLeague} cancelOperation={cancelAddLeague}></AddLeague>
        :
            MainDisplay
        }
    </div>)
}

export default ManageLeagues;
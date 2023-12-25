import {useState} from 'react';
import * as c from '../../constants';
import { callAddLeague, callUpdateLeague, callDeleteLeague } from '../../callApi';
import ManagePlayers from './managePlayers';
import ManageGames from './manageGames';
import AddLeague from './addLeague';
import {Table, Container, Alert, Row, Col, Offcanvas } from 'react-bootstrap';

const ManageLeagues=({setModeHome, leagueData, setLeagueData}) => {
    const [leagueIdForPlayers, setLeagueIdForPlayers] = useState(-1); // Set to league id when managing players
    const [leagueIdForGames, setLeagueIdForGames] = useState(-1); // Set to league id when managing games
    const [addingLeague, setAddingLeague] = useState(false); // Set to true when adding league
    const [showInfo, setShowInfo] = useState(false);
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
    const MainDisplay = <Container fluid>
        <Offcanvas show={showInfo} onHide={()=>{setShowInfo(false)}} placement='end'>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Information</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <h2>New League</h2>
                <p>When you add a league it will have a Status of <span className='bold'>{c.ST_REG}</span>.</p>
                <h2>{c.ST_REG} Status</h2>
                <p>Players can join themselves to a league with this state.</p>
                <p>Click <span className="material-symbols-outlined">play_arrow</span> to
                   change the Status to <span className='bold'>{c.ST_ACT}</span>.
                </p>
                <h2>{c.ST_ACT} Status</h2>
                <p>Players can enter game results if they are assigned to a league in this state.</p>
                <p>Click <span className="material-symbols-outlined">undo</span> to change the Status back to <span className='bold'>{c.ST_REG}</span>.</p>
                <p>Click <span className="material-symbols-outlined">stop</span> to change the Status to <span className='bold'>{c.ST_CLS}</span>.</p>
                <h2>{c.ST_CLS} Status</h2>
                <p>This status signifies the completion of the league games.</p>
                <p>Click <span className="material-symbols-outlined">undo</span> to change the Status back to <span className='bold'>{c.ST_ACT}</span>.</p>
                <p>Click <span className="material-symbols-outlined">delete</span> to delete the league.</p>
                <h2>Manage</h2>
                <p>Click <span className="material-symbols-outlined">group</span> to manage players.</p>
                <p>Click <span className="material-symbols-outlined">view_list</span> to manage game results.</p>
            </Offcanvas.Body>
        </Offcanvas>
        <Row>
            <Col sm='auto'>
                <span
                 data-bs-toggle='tooltip'
                 title='Return to main page'
                 class="material-symbols-outlined"
                 onClick={setModeHome}
                >home</span>
                <span
                 data-bs-toggle='tooltip'
                 title='Add a league'
                 class="material-symbols-outlined"
                 onClick={() => {setAddingLeague(true);}}
                >add_circle</span>
                <span
                 data-bs-toggle='tooltip'
                 title='Show information about this page'
                 class="material-symbols-outlined"
                 onClick={() => {setShowInfo(true);}}
                >help</span>
            </Col>
        </Row>
        {leagueData && leagueData.leagues && leagueData.leagues.length ?
            <Row><Col sm='auto'><Alert variant='info'>
                <Alert.Heading>Leagues</Alert.Heading>
                <Table striped bordered hover size='sm' variant='dark'>
                    <thead>
                        <tr>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Title</th>
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
                                    title='Reactivate the league'
                                    onClick={() => {handleUpateLeagueStatus(league,c.ST_ACT);}}
                                    className="material-symbols-outlined">
                                    undo
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
            </Alert></Col></Row>
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
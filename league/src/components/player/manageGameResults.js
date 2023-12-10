import {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import ShowGameResults from './showGameResults';

const ManageGameResults=({setModeHome, leagueData, setLeagueData}) => {
    const [leagueId, setLeagueId] = useState(-1); // Set to league id when showing league games
    const MainDisplay = <Container fluid>
        <Row>
            <Col sm='auto'>
                <Button onClick={setModeHome}>Home</Button>
            </Col>
        </Row>
        <Row>
            <Col sm='auto'>
                <Table striped hover bordered size='sm' variant='dark'>
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
                        {leagueData.leagues.map((league,index)=>
                            <tr key={index}>
                                <td>{league.startDate}</td>
                                <td>{league.endDate}</td>
                                <td>{league.desc}</td>
                                <td>{league.status}</td>
                                <td>{league.gamesPerOpp}</td>
                                <td><Button onClick={()=>{setLeagueId(league.id)}}>Select</Button></td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Col>
        </Row>
    </Container>;

    return(<div>
        { leagueData.error ?
            <Alert variant='danger'>Error Encountered: {leagueData.errorMessage}</Alert>
        : leagueId > -1 ?
            <ShowGameResults leagueId={leagueId} setLeagueId={setLeagueId} leagueData={leagueData} setLeagueData={setLeagueData}></ShowGameResults>
        :
            MainDisplay
        }
    </div>)
}

export default ManageGameResults;
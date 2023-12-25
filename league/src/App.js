import './App.css';
import {useState, useEffect} from 'react';
import ManageLeagues from './components/manager/manageLeagues';
import { callGetLeagueData } from './callApi';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import PlayerLogin from './components/player/playerLogin';
import PlayerPages from './components/player/playerPages';

const USER_MANAGER = 'Manager';
const USER_PLAYER = 'Player';
const USER_UNKNOWN = 'Unknown';

function App() {
  const [user, setUser] = useState(USER_UNKNOWN);
  const [leagueData, setLeagueData] = useState({"leagues":[],"players":[],"games":[]});
  const [loggedInPlayer, setLoggedInPlayer] = useState({id: 0});

  useEffect(() => {
    async function fetchData() {
        let jdata = await callGetLeagueData();
        setLeagueData(jdata);
      }
    fetchData();
  },[]);

  const setModeHome=()=>{
    setUser(USER_UNKNOWN);
  }
  const PickUserType=()=>{
    return(<Container fluid>
      <Row>
        <Col sm='auto'>
          <Alert>This will become two separate sites later.</Alert>
        </Col>
      <Row>
      </Row>
        <Col sm='auto'>
          <ButtonGroup>
            <Button onClick={()=>{setUser(USER_MANAGER)}}>MANAGER</Button>
            <Button onClick={()=>{setUser(USER_PLAYER)}}>PLAYER</Button>
          </ButtonGroup>
        </Col>
      </Row>
    </Container>)
  }
  return (
    <div className='app'>
      <header>
        { leagueData.error ?
          <h1>Error Encountered: {leagueData.errorMessage}</h1>
        : user === USER_UNKNOWN ?
          <PickUserType></PickUserType>
        : user === USER_MANAGER ?
          <ManageLeagues setModeHome={setModeHome} leagueData={leagueData} setLeagueData={setLeagueData}/>
        : loggedInPlayer.id === 0 ?
          <PlayerLogin setLoggedInPlayer={setLoggedInPlayer} leagueData={leagueData} setLeagueData={setLeagueData}/>
        :
          <PlayerPages loggedInPlayer={loggedInPlayer} setLoggedInPlayer={setLoggedInPlayer} leagueData={leagueData} setLeagueData={setLeagueData}/>
        }
      </header>
    </div>
  );
}

export default App;

import { Alert, Container, Dropdown, DropdownButton } from "react-bootstrap";
import { callUpdatePlayer } from "../../callApi";

const Register =({leagueData, setLeagueData, loggedInPlayer, setLoggedInPlayer, setKey}) => {
    const handleSelectLeague = async (e) => {
        let newLeagueId = parseInt(e);
        let newLeagueData = await callUpdatePlayer(loggedInPlayer.id, loggedInPlayer.userId, loggedInPlayer.nickname, newLeagueId);
        setLeagueData(newLeagueData); // Take it, good or bad!
        let foundPlayerIndex = -1;
        for (let i = 0; foundPlayerIndex < 0 && i < newLeagueData.players.length; i++) {
            if (newLeagueData.players[i].id === loggedInPlayer.id) {
                foundPlayerIndex = i;
            }
        }
        if (foundPlayerIndex < 0) {
            // Not a match on new user id after adding new user, something burped
            alert('Sorry, failed to register! Dang it.');
        } else {
            // Is a match on new user id after adding new user, accept it
            setLoggedInPlayer(newLeagueData.players[foundPlayerIndex]);
            setKey('home');
        }
    }
    return <Container fluid>
        <Alert>
            <Alert.Heading>Pick an available league:</Alert.Heading>
            <DropdownButton
                title='Select League'
                onSelect={handleSelectLeague}
            >
                {leagueData.leagues && leagueData.leagues.filter(l => l.status === 'Registration').map((l,i) =>
                    <Dropdown.Item eventKey={l.id} key={i}>{l.desc}</Dropdown.Item>
                )}
            </DropdownButton>
        </Alert>
    </Container>
}

export default Register;
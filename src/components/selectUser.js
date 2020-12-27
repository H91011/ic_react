import {Component} from "react";
import {Card, Row, Col} from "react-bootstrap";
import TicketForm from "./ticketForm.js";
import {nanoid} from "nanoid";

const url = "http://localhost:3000/user/list";
class SelectUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedUser: 0,
      userList: [],
      loading: true
    };
  }
  componentDidMount() {
    fetch(url)
      .then(response => response.json())
      .then(userList => {
        console.log(userList);
        this.setState({userList, loading: false});
      });
  }

  render() {
    console.log("render");
    const {selectedUser, loading, userList} = this.state;
    return (
      <div>
        {loading ? (
          <p>Loading</p>
        ) : selectedUser === 0 ? (
          <Row>
            <Col className="mx-auto" xs={6}>
              <br />
              <br />
              <br />
              <p> Please Select a Account</p>
              {userList.map(user => {
                return (
                  <Card
                    key={nanoid()}
                    onClick={() => {
                      this.setState({selectedUser: user});
                    }}
                  >
                    <Card.Body>
                      <Card.Title>{user.name}</Card.Title>
                    </Card.Body>
                  </Card>
                );
              })}
            </Col>
          </Row>
        ) : (
          <TicketForm key={nanoid()} user={this.state.selectedUser} />
        )}
      </div>
    );
  }
}

export default SelectUser;

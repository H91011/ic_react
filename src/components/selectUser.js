import {Component} from "react";
import {Card, Row, Col} from "react-bootstrap";
import TicketForm from "./ticketForm.js";

const accountType = {
  employee: 1,
  customer: 2
};

class SelectUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: 0
    };
  }

  render() {
    const {user} = this.state;
    return (
      <div>
        {user === 0 ? (
          <Row>
            <Col className="mx-auto" xs={6}>
              <br />
              <br />
              <br />
              <p> Please Select a Account</p>
              <Card
                onClick={() => {
                  this.setState({user: 2});
                }}
              >
                <Card.Body>
                  <Card.Title>Customer</Card.Title>
                </Card.Body>
              </Card>

              <Card
                onClick={() => {
                  this.setState({user: 1});
                }}
              >
                <Card.Body>
                  <Card.Title>Employee</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ) : (
          <TicketForm user={{type: this.state.user}} />
        )}
      </div>
    );
  }
}

export default SelectUser;

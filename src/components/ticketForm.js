import {Component} from "react";
import {
  Row,
  Col,
  Tabs,
  Tab,
  ListGroup,
  InputGroup,
  FormControl,
  Button,
  Form
} from "react-bootstrap";
import {MdWarning, MdDone, MdSend} from "react-icons/md";
import {nanoid} from "nanoid";

const url = "http://localhost:3000/ticket";
const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  mode: "cors",
  body: null
};

class TicketForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user: 0,
      selectedTab: "tickets",
      tickets: [],
      cTicket: null,
      ticketText: undefined
    };
  }

  tabSelect = k => {
    const state = {
      selectedTab: k,
      cTicket: null
    };
    if (k === "createTicket") {
      state.ticketText = undefined;
      document.getElementById("ticketSubject").value = null;
      document.getElementById("bodyMsg").value = null;
    }
    this.setState(state);
  };

  createTicket = (name, subject, msg) => {
    return {
      subject: subject,
      status: 1,
      body: [{user: name, msg}]
    };
  };

  listTickets = tickets => {
    if (tickets.length) {
      return tickets.map((elem, index) => {
        return (
          <ListGroup.Item
            key={nanoid()}
            index={index}
            onClick={item => {
              const {nodeValue} = item.target.attributes.index;
              this.setState({
                cTicket: tickets[nodeValue],
                selectedTab: "createTicket"
              });
            }}
          >
            {elem.status ? <MdWarning /> : <MdDone />} {elem.subject}
          </ListGroup.Item>
        );
      });
    }
    return <p>You dont have any tickets.</p>;
  };

  listTicketBody = body => {
    const {user, msg} = body;
    const tAlign =
      user === "customer" ? {textAlign: "left"} : {textAlign: "right"};
    return (
      <ListGroup.Item key={nanoid()}>
        <p style={tAlign}>
          <strong>{user}</strong>
        </p>
        <p style={tAlign}>{msg}</p>
      </ListGroup.Item>
    );
  };

  sendTicket = async () => {
    var {cTicket} = this.state;
    const {name} = this.props.user;

    const bodyMsg = document.getElementById("bodyMsg").value;
    const subject = document.getElementById("ticketSubject").value;
    var optFetch = null;

    if (cTicket && bodyMsg) {
      const {name, body, _id} = cTicket;
      body.push({userId: _id, user: name, msg: bodyMsg});
      this.setState({selectedTab: "tickets", cTicket});
      optFetch = {router: "/update", body: JSON.stringify({id: cTicket._id})};
    } else if (!cTicket) {
      cTicket = this.createTicket(name, subject, bodyMsg);
      optFetch = {router: "/add", body: JSON.stringify(cTicket)};
    }

    if (subject && bodyMsg) {
      options.body = optFetch.body;
      await fetch(url + optFetch.router, options);

      const response = await fetch(url + "/list");
      const tickets = await response.json();

      this.setState({
        selectedTab: "tickets",
        cTicket,
        tickets
      });
    } else {
      alert("Please fill the inputs.");
    }
  };

  componentDidMount() {
    if (this.state.loading) {
      fetch(url + "/list")
        .then(response => response.json())
        .then(tickets => {
          this.setState({tickets, loading: false});
        });
    }
  }

  render() {
    const {loading, selectedTab, tickets, cTicket, ticketText} = this.state;
    const {user} = this.props;
    return (
      <div>
        {loading ? (
          <p>Loading tickets... </p>
        ) : (
          <Row>
            <Col className="mx-auto" xs={5}>
              <br />
              <br />
              <br />
              <br />
              <Tabs
                key={nanoid()}
                defaultActiveKey="tickets"
                id="customerTab"
                activeKey={selectedTab}
                onSelect={k => {
                  this.tabSelect(k);
                }}
              >
                <Tab key={nanoid()} eventKey="tickets" title="My Tickets">
                  {user.type === 1 ? (
                    <div>
                      <Form
                        key={nanoid()}
                        style={{display: "inline-flex", marginTop: "10px"}}
                      >
                        <Form.Check
                          className="searchRadio"
                          type="radio"
                          id="allRadio"
                          label="all"
                          name="showRadios"
                        />
                        <Form.Check
                          className="searchRadio"
                          type="radio"
                          id="openRadio"
                          label="opened"
                          name="showRadios"
                        />
                        <Form.Check
                          className="searchRadio"
                          type="radio"
                          id="closeRadio"
                          label="closed"
                          name="showRadios"
                        />
                      </Form>
                      <Form
                        key={nanoid()}
                        style={{display: "flex", marginTop: "10px"}}
                      >
                        <InputGroup size="sm" className="mb-6">
                          <InputGroup.Prepend></InputGroup.Prepend>
                          <FormControl
                            id="searchBar"
                            disabled={false}
                            aria-describedby="basic-addon1"
                            placeholder="search ticket"
                          />
                        </InputGroup>
                        <Form.Check
                          style={{
                            fontSize: "10px",
                            marginTop: "5px",
                            marginLeft: "5px"
                          }}
                          type="switch"
                          id="searchswitch"
                          label="byName"
                        />
                      </Form>
                    </div>
                  ) : null}
                  <ListGroup style={{marginTop: "15px"}}>
                    {this.listTickets(tickets)}
                  </ListGroup>
                </Tab>
                <Tab key={nanoid()} eventKey="createTicket" title="Send Ticket">
                  <InputGroup
                    key={nanoid()}
                    size="sm"
                    className="mb-3"
                    style={{marginTop: "15px"}}
                  >
                    <InputGroup.Prepend></InputGroup.Prepend>
                    <FormControl
                      key={nanoid()}
                      id="ticketSubject"
                      disabled={user.type === 1 ? true : false}
                      aria-describedby="basic-addon1"
                      placeholder="ticket subject"
                      value={cTicket ? cTicket.subject : ticketText}
                    />
                  </InputGroup>
                  <ListGroup key={nanoid()}>
                    {cTicket ? cTicket.body.map(this.listTicketBody) : null}
                  </ListGroup>
                  <InputGroup key={nanoid()} style={{marginTop: "15px"}}>
                    <InputGroup.Prepend></InputGroup.Prepend>
                    <FormControl
                      id="bodyMsg"
                      as="textarea"
                      aria-label="With textarea"
                    />
                  </InputGroup>
                  <Form key={nanoid()} style={{marginTop: "10px"}}>
                    <Form.Group>
                      <Form.File id="fileInput" />
                    </Form.Group>
                  </Form>
                  <Button
                    key={nanoid()}
                    id="sendTicket"
                    className="ticketBtn"
                    style={{float: "right", marginTop: "5px"}}
                    size="sm"
                    onClick={() => {
                      this.sendTicket();
                    }}
                  >
                    Send <MdSend />
                  </Button>
                </Tab>
              </Tabs>
            </Col>
          </Row>
        )}
      </div>
    );
  }
}

export default TicketForm;

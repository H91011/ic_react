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
import {MdWarning, MdDone} from "react-icons/md";
import {nanoid} from "nanoid";

class TicketForm extends Component {
  constructor(props) {
    super(props);
    console.log(this);
    this.state = {
      user: 0,
      selectedTab: "tickets",
      tickets: [
        {
          subject: "ticket 1",
          status: 1,
          body: [
            {user: "customer", msg: "Bir hata var"},
            {user: "employee", msg: "Hata Çözüldü"},
            {user: "customer", msg: "Hayır çalışmıyor"},
            {user: "customer", msg: "Hala çalışmıyor"}
          ]
        },
        {subject: "ticket 2", status: 0, body: []},
        {subject: "ticket 3", status: 1, body: []},
        {subject: "ticket 4", status: 0, body: []},
        {subject: "ticket 5", status: 1, body: []}
      ],

      currentTicket: null,
      ticketText: undefined
    };
  }

  createTicketMsg = msg => {
    return {user: "customer", msg};
  };

  createTicket = (subject, msg) => {
    return {
      subject,
      status: 1,
      body: [{user: "customer", msg}]
    };
  };

  listTicketBody = body => {
    const {user, msg} = body;
    const tAlign =
      user === "customer" ? {textAlign: "left"} : {textAlign: "right"};
    return (
      <ListGroup.Item>
        <p style={tAlign}>
          <strong>{user}</strong>
        </p>
        <p style={tAlign}>{msg}</p>
      </ListGroup.Item>
    );
  };

  sendTicket = () => {
    const {tickets, currentTicket} = this.state;
    const bodyMsg = document.getElementById("bodyMsg").value;
    const subject = document.getElementById("ticketSubject").value;

    if (currentTicket && bodyMsg) {
      const ticketMsg = this.createTicketMsg(bodyMsg);
      currentTicket.body.push(ticketMsg);
      this.setState({selectedTab: "tickets", currentTicket});
    } else if (!currentTicket && subject && bodyMsg) {
      const currentTicket = this.createTicket(subject, bodyMsg);
      tickets.push(currentTicket);
      this.setState({
        selectedTab: "tickets",
        currentTicket,
        tickets
      });
    } else {
      alert("Please fill the inputs.");
    }
  };

  tabSelect = k => {
    const state = {
      selectedTab: k,
      currentTicket: null
    };
    if (k === "createTicket") {
      state.ticketText = undefined;
      document.getElementById("ticketSubject").value = null;
      document.getElementById("bodyMsg").value = null;
    }
    this.setState(state);
  };

  render() {
    const {selectedTab, tickets, currentTicket, ticketText} = this.state;
    const {type} = this.props.user;
    return (
      <div>
        <Row>
          <Col className="mx-auto" xs={5}>
            <br />
            <br />
            <br />
            <br />
            <Tabs
              defaultActiveKey="tickets"
              id="customerTab"
              activeKey={selectedTab}
              onSelect={k => {
                this.tabSelect(k);
              }}
            >
              <Tab eventKey="tickets" title="My Tickets">
                {type === 1 ? (
                  <div>
                    <Form style={{display: "inline-flex", marginTop: "10px"}}>
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
                    <Form style={{display: "flex", marginTop: "10px"}}>
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
                  {tickets.map((elem, index) => {
                    return (
                      <ListGroup.Item
                        key={nanoid()}
                        index={index}
                        onClick={item => {
                          const {nodeValue} = item.target.attributes.index;
                          this.setState({
                            currentTicket: tickets[nodeValue],
                            selectedTab: "createTicket"
                          });
                        }}
                      >
                        {elem.status ? <MdWarning /> : <MdDone />}{" "}
                        {elem.subject}
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </Tab>
              <Tab eventKey="createTicket" title="Send Ticket">
                <InputGroup
                  size="sm"
                  className="mb-3"
                  style={{marginTop: "15px"}}
                >
                  <InputGroup.Prepend></InputGroup.Prepend>
                  <FormControl
                    id="ticketSubject"
                    disabled={false}
                    aria-describedby="basic-addon1"
                    placeholder="ticket subject"
                    value={currentTicket ? currentTicket.subject : ticketText}
                    onChange={input => {
                      this.setState({ticketText: ticketText});
                    }}
                  />
                </InputGroup>
                <ListGroup>
                  {currentTicket
                    ? currentTicket.body.map(this.listTicketBody)
                    : null}
                </ListGroup>
                <InputGroup style={{marginTop: "15px"}}>
                  <InputGroup.Prepend></InputGroup.Prepend>
                  <FormControl
                    id="bodyMsg"
                    as="textarea"
                    aria-label="With textarea"
                  />
                </InputGroup>
                <Form style={{marginTop: "10px"}}>
                  <Form.Group>
                    <Form.File id="fileInput" />
                  </Form.Group>
                </Form>
                <Button
                  id="sendTicket"
                  className="ticketBtn"
                  style={{float: "right", marginTop: "5px"}}
                  size="sm"
                  onClick={() => {
                    this.sendTicket();
                  }}
                >
                  Send
                </Button>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </div>
    );
  }
}

export default TicketForm;

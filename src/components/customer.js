import {Component} from "react";
import {
  Row,
  Col,
  Tabs,
  Tab,
  ListGroup,
  InputGroup,
  FormControl,
  Button
} from "react-bootstrap";
import {MdWarning, MdDone} from "react-icons/md";

class Customer extends Component {
  constructor(props) {
    super(props);
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
      ticketText: null
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
      console.log(currentTicket);
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

  render() {
    const {selectedTab, tickets, currentTicket, ticketText} = this.state;
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
                const state = {
                  selectedTab: k,
                  currentTicket: null
                };
                if (k === "createTicket") {
                  state.ticketText = null;
                  document.getElementById("ticketSubject").value = null;
                  document.getElementById("bodyMsg").value = null;
                }
                this.setState(state);
              }}
            >
              <Tab eventKey="tickets" title="My Tickets">
                <ListGroup>
                  {tickets.map((elem, index) => {
                    return (
                      <ListGroup.Item
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
                <InputGroup size="sm" className="mb-3">
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

export default Customer;

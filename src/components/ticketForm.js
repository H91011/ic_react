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
import {MdWarning, MdDone, MdSend, MdHome} from "react-icons/md";
import {nanoid} from "nanoid";

const url = "http://localhost:3005/ticket";

class TicketForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      user: 0,
      selectedTab: "tickets",
      tickets: [],
      cTicket: null,
      ticketText: undefined,
      ticketStatus: false,
      selectedRadio: "allRadio",
      searchByName: false
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

  createTicket = (id, type, name, subject, msg, file) => {
    return {
      userId: id,
      subject: subject,
      status: "open",
      body: [{type, user: name, msg, fileName: file ? file.name : null}]
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
                selectedTab: "createTicket",
                ticketStatus: tickets[nodeValue].status
              });
            }}
          >
            {elem.status === "close" ? <MdWarning /> : <MdDone />}
            {" " + elem.subject}
          </ListGroup.Item>
        );
      });
    }
    return <p>You dont have any tickets.</p>;
  };

  listTicketBody = body => {
    const {user, msg, type, fileName} = body;
    console.log("type", type);
    const tAlign = type === 2 ? {textAlign: "left"} : {textAlign: "right"};
    return (
      <ListGroup.Item key={nanoid()}>
        <p className="userFont" style={tAlign}>
          <strong>{user}</strong>
        </p>
        <p className="fileFont" style={tAlign}>
          <a href={fileName ? url + "/show/" + fileName : "#"}> file</a>
        </p>
        <p className="bodyFont" style={tAlign}>
          {msg}
        </p>
      </ListGroup.Item>
    );
  };

  sendTicket = async () => {
    var {cTicket, ticketStatus} = this.state;
    const {name, type, _id} = this.props.user;

    const bodyMsg = document.getElementById("bodyMsg").value;
    const subject = document.getElementById("ticketSubject").value;
    var optFetch = null;

    const file = document.getElementById("fileInput").files[0];

    if (cTicket && type === 1) {
      const {_id} = cTicket;
      console.log(ticketStatus);
      this.setState({selectedTab: "tickets", cTicket});
      optFetch = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        router: "/update",
        mode: "cors",
        body: JSON.stringify({
          id: cTicket._id,
          status: ticketStatus,
          data: {userId: _id, type, user: name, msg: bodyMsg}
        })
      };
    } else if (!cTicket) {
      cTicket = this.createTicket(_id, type, name, subject, bodyMsg, file);
      optFetch = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        router: "/add",
        mode: "cors",
        body: JSON.stringify(cTicket)
      };
    }

    if (file) {
      const formData = new FormData();
      formData.append("ticketFile", file);
      await fetch(url + "/upload/", {
        method: "POST",
        body: formData
      });
    }

    if ((subject && bodyMsg) || type === 1) {
      var res = await fetch(url + optFetch.router, optFetch);
      res = await res.json();
      if (res.status) {
        var urlParam;
        if (type === 1) {
          urlParam = "/list";
        } else {
          urlParam = "/list/?userId=" + _id;
        }
        const response = await fetch(url + urlParam);
        const tickets = await response.json();

        this.setState({
          selectedTab: "tickets",
          cTicket,
          tickets
        });
      }
    } else {
      alert("Please fill the inputs.");
    }
  };

  filterTickets = async (id, searchText = null, byName = null) => {
    console.log(id);
    console.log(id.split("Radio"));
    const filter = id.split("Radio")[0];
    const response = await fetch(
      url +
        "/list/?filter=" +
        filter +
        "&search=" +
        searchText +
        "&byName=" +
        byName
    );
    const tickets = await response.json();

    this.setState({
      selectedTab: "tickets",
      tickets
    });
  };

  searchTicket = text => {
    const {selectedRadio, searchByName} = this.state;
    this.filterTickets(selectedRadio, text, searchByName);
    console.log(text);
  };

  componentDidMount() {
    if (this.state.loading) {
      const {user} = this.props;
      var urlParam;
      if (user.type === 1) {
        urlParam = "/list";
      } else {
        urlParam = "/list/?userId=" + user._id;
      }
      fetch(url + urlParam)
        .then(response => response.json())
        .then(tickets => {
          this.setState({tickets, loading: false});
        });
    }
  }

  render() {
    const {
      loading,
      selectedTab,
      tickets,
      cTicket,
      ticketText,
      ticketStatus,
      selectedRadio,
      searchByName
    } = this.state;
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
              <Row>
                <Button
                  key={nanoid()}
                  id="homebutton"
                  className="ticketBtn"
                  style={{
                    float: "left",
                    marginLeft: "15px",
                    marginBottom: "5px"
                  }}
                  onClick={() => {
                    this.props.gotoMain();
                  }}
                >
                  {" "}
                  <MdHome />
                </Button>
              </Row>
              <Tabs
                key={nanoid()}
                defaultActiveKey="tickets"
                id="customerTab"
                activeKey={selectedTab}
                onSelect={k => {
                  this.tabSelect(k);
                }}
              >
                <Tab
                  key={nanoid()}
                  eventKey="tickets"
                  title={user.type === 1 ? "Tickets" : "My Tickets"}
                >
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
                          checked={selectedRadio === "allRadio" ? true : false}
                          onChange={item => {
                            this.setState({selectedRadio: "allRadio"});
                          }}
                          onClick={item => {
                            this.filterTickets(item.target.id);
                          }}
                        />
                        <Form.Check
                          className="searchRadio"
                          type="radio"
                          id="openRadio"
                          label="opened"
                          name="showRadios"
                          checked={selectedRadio === "openRadio" ? true : false}
                          onChange={item => {
                            this.setState({selectedRadio: "openRadio"});
                          }}
                          onClick={item => {
                            this.filterTickets(item.target.id);
                          }}
                        />
                        <Form.Check
                          className="searchRadio"
                          type="radio"
                          id="closeRadio"
                          label="closed"
                          name="showRadios"
                          checked={
                            selectedRadio === "closeRadio" ? true : false
                          }
                          onChange={item => {
                            this.setState({selectedRadio: "closeRadio"});
                          }}
                          onClick={item => {
                            this.filterTickets(item.target.id);
                          }}
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
                            placeholder="search ticket,  please hit enter"
                            onKeyPress={event => {
                              if (event.charCode === 13) {
                                this.searchTicket(event.target.value);
                                event.preventDefault();
                              }
                            }}
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
                          checked={searchByName}
                          onChange={event => {
                            console.log(event.target.checked);
                            this.setState({searchByName: event.target.checked});
                          }}
                        />
                      </Form>
                    </div>
                  ) : null}
                  <ListGroup style={{marginTop: "15px"}}>
                    {this.listTickets(tickets)}
                  </ListGroup>
                </Tab>
                <Tab
                  key={nanoid()}
                  eventKey="createTicket"
                  title={user.type === 1 ? "Response Ticket" : "Send Ticket"}
                >
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
                      disabled={cTicket ? true : false}
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
                  <Form
                    key={nanoid()}
                    style={{marginTop: "10px", display: "flex"}}
                  >
                    <Form.Group>
                      <Form.File id="fileInput" />
                      {user.type === 1 ? (
                        <Form.Check
                          style={{
                            fontSize: "10px",
                            float: "left",
                            marginTop: "10px"
                          }}
                          type="switch"
                          id="statusSwitch"
                          label={ticketStatus}
                          checked={ticketStatus === "open" ? true : false}
                          onChange={() => {
                            this.setState({
                              ticketStatus:
                                ticketStatus === "open" ? "close" : "open"
                            });
                          }}
                        />
                      ) : null}
                    </Form.Group>
                  </Form>
                  <Button
                    key={nanoid()}
                    id="sendTicket"
                    className="ticketBtn"
                    style={{float: "left", marginTop: "5px"}}
                    disabled={cTicket || user.type === 2 ? false : true}
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

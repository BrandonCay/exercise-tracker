import React from 'react';
import './App.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

const dateMsg="(NOTE: No date or invalid dates will send " ;


class App extends React.Component {
  constructor(props){
  super(props);
    this.state={
      username:"",
      userId1:"",
      description:"",
      
    }
}

  handleSubmit1(e){
    console.log(e.target.name);
  }

  render(){
    return (
      <div className="App" style={{width:'100vw', height:'100vh'}}>
        <Container fluid={true}>
          <Row className="justify-content-center align-items-center" id="pRow1">
            <Col sm="4">
              <h1>
                Exercise Logger
              </h1>
            </Col>
                
          </Row>
              <Row id="pRow2" className="justify-content-around align-items-start">
                <Col id="pCol1" sm="3" className="colForm">

                  <Form action="http://localhost:4000/api/exercise/new-user" method="POST" encType="application/x-www-form-urlencoded">
                      <Form.Group className="fGroupT">
                        Create An Account And Get ID
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>username </Form.Label>
                        <Form.Control name="name" required/>
                      </Form.Group>
                      <Button type="submit">Submit</Button>
                  </Form>
                </Col>
                
                <Col id="pCol2" sm="3" className="colForm">
                
                <Form action="http://localhost:4000/api/exercise/add" method="POST" encType="application/x-www-form-urlencoded">
                    <Form.Group className="fGroupT">
                      Add Exercise Log
                    </Form.Group>
                    <Form.Group >
                        <Form.Label>user ID</Form.Label>
                        <Form.Control name="id" required/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>description</Form.Label>
                        <Form.Control name="description" required/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>duration (in minutes) </Form.Label>
                        <Form.Control name="duration" required/>
                    </Form.Group>
                    <Form.Group>
                     <Form.Label>date (NOTE: no date will send today's date and invalid dates will cause an error)</Form.Label>
                        <Form.Control name="date"/>
                    </Form.Group>
                    <Button type="submit">Submit</Button>
                  </Form>
                </Col>


                <Col id="pCol3" sm="3" className="colForm">
                
                <Form action="http://localhost:4000/api/exercise/log" method="GET" encType="application/x-www-form-urlencoded">
                    <Form.Group className="fGroupT">
                      Get Exercise Log
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>user ID</Form.Label>
                        <Form.Control name="userId" required/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>from {dateMsg} the lowest date)</Form.Label>
                        <Form.Control name="from"/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>to {dateMsg} the highest date)</Form.Label>
                        <Form.Control name="to"/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>limit (NOTE: no limit=unlimited)</Form.Label>
                        <Form.Control name="limit"/>
                    </Form.Group>
                    <Button type="submit">Submit</Button>
                  </Form>
                </Col>


              </Row>
          </Container>
      </div>
    );
  }
}

export default App;

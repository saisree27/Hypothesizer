/*global chrome*/


import React from 'react';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Videocam from '@material-ui/icons/Videocam';
import Modal from 'react-bootstrap/Modal'
import Pause from '@material-ui/icons/Pause';
import WbIncandescent from '@material-ui/icons/WbIncandescent';
import './App.css';
import * as devtools from '../../api/devtools';
var xss = require('xss');
// const createDOMPurify = require('dompurify');
// const { JSDOM } = require('jsdom');
 
// const window = new JSDOM('').window;
// const DOMPurify = createDOMPurify(window);

function App() {
  devtools.init();

  const [recording, setRecording] = React.useState(false);
  const [profiled, setProfiled] = React.useState(false);
  const [results, setResults] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);
  const [showTags, setShowTags] = React.useState(false);
  const [tags, setTags] = React.useState([]);
  const [ranking, setRanking] = React.useState([]);

  var inputState:any = React.createRef();

  const handleChange = (event:any) => {
    const value:string = inputState.current.value;
    var keywords:[] = devtools.getKeywords(value);
    setTags(devtools.getKeywords(value));
    if(keywords.length >= 1) {
      setShowTags(true);
    }
    else setShowTags(false);
  }


  window.addEventListener("message", function(event) {
    console.log("Received message from devtools.");
    setProfiled(true);
    setShowModal(true);
    var result = event.data.msg.filter(function(elem:any, index:number, self:any) {
      return index === self.indexOf(elem);
    });
    setResults(result);
    event.data.ranking[Symbol.iterator] = function* () {
      yield* [...this.entries()].sort((a, b) => a[1] - b[1]);
    };
    var newRanking:any = [];
    for(var key of event.data.ranking.keys()) {
      var hypothesis = key.hypothesis;
      var confidence = event.data.ranking.get(key);
      newRanking.push(`<strong> Hypothesis: </strong> ${hypothesis} <br></br> <strong> Confidence score: </strong>
      ${confidence}%`);
    }
    setRanking(newRanking);
  });

  return (
    <div className="App">
      <div className="App-header">
        <div className="myHeading">
            <WbIncandescent fontSize="large" />
            <h1>Hypothesizer</h1>
        </div>
        <h6>A debugging tool</h6>
      </div>
      <div className="App-body">
        <Form>
          <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Label style={{fontSize: 15}}>Describe the defect generally. </Form.Label>
          <Form.Control as="textarea" ref={inputState} onChange={handleChange}/>
          <Form.Text className="text-muted" style={{fontSize: 12}}> 
            {showTags ? <p>Tags: {tags.map<React.ReactNode>(t => <span>{t}</span>).reduce((prev, curr) => [prev, ', ', curr])}</p> : <p></p>}
          </Form.Text>
          </Form.Group>
        </Form>
        <p style={{fontSize:15}}> Please click record and reproduce the defect. </p>
      </div>
      <br></br>
      {!showModal ? <div className="center">
          {!recording ? <Button onClick={() => {devtools.startProfiler(); setRecording(true)}}
              variant="primary"
              > <Videocam/> Start Recording </Button>
              : <Button onClick={() => {devtools.endProfiler(tags); setRecording(false); setShowModal(true);}}
              variant="warning"
              > <Pause/> End Recording </Button>}
        </div> : <div></div>}

      {showModal ?
      <div>        
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>Results</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p> <strong> Tags generated from your description: </strong> {tags.map<React.ReactNode>(t => <span>{t}</span>).reduce((prev, curr) => [prev, ', ', curr])} </p>
            <strong style={{fontSize: 20}}> Hypothesis Ranking </strong>
            <ListGroup>
            {profiled ? <div> {ranking.map((entry:any) => (
                                <ListGroup.Item dangerouslySetInnerHTML={{__html: xss(entry)}}></ListGroup.Item>
                              ))} 
                        </div> : <div> Loading... </div>}
            </ListGroup>
            <br/>
            <strong style={{fontSize: 20}}> Execution Trace </strong>
            <ListGroup>
              {profiled ? <div> {results.map(text => <ListGroup.Item dangerouslySetInnerHTML={{__html: xss(text)}}></ListGroup.Item>)} </div> : <div> Loading... </div>}
            </ListGroup>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
      : <div></div>}

    </div>
  );
}

export default App;

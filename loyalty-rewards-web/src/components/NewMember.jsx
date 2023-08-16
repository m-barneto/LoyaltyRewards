import { React, useState } from 'react';
import { Button, Modal, Form, Row, Col, InputGroup } from 'react-bootstrap';
import axios from 'axios';

export default function NewMember() {
  const [show, setShow] = useState(false);

  const [member, setMember] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [updatedMember, setUpdatedMember] = useState(null);
  const [rewards, setRewards] = useState([]);

  const [showMember, setShowMember] = useState(false);

  const handleClose = () => {
    setShow(false);
    setShowMember(false);
  }
  const handleShow = () => {
    setShow(true);
  }

  const newMember = (e) => {
    e.preventDefault();
    let fname = document.getElementById('firstname');
    let lname = document.getElementById('lastname');
    let email = document.getElementById('email');
    let notes = document.getElementById('notes');
    let bday = document.getElementById('birthday');
    let sebts = document.getElementById('sebts').childNodes[0].childNodes[0];
    var memberForm = {
      firstName: fname.value,
      lastName: lname.value,
      email: email.value,
      meta: notes.value,
      birthdayMonth: bday.value === 0 ? null : bday.options[bday.value].text,
      flags: sebts.checked ? 'sebts,' : ''
    }
    axios.post('https://localhost:7223/loyaltymember', memberForm)
      .then(function (response) {
        console.log(response);
        setUpdatedMember(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  const handleShowNewMember = () => {
    loadMember();
    loadTransactions();
    loadRewards();
    setShowMember(true);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
  }

  const redeemReward = (e) => {
    e.preventDefault();
    var ele = document.getElementsByName('reward');
    for (var i = 0; i < ele.length; i++) {
      if (ele[i].checked) {
        console.log(ele[i].value);
        
      }
    }
  }

  function loadMember() {
    axios.get('https://localhost:7223/loyaltymember', { params: { memberId: member['id'] } })
      .then(function (response) {
        setUpdatedMember(response.data);
        setShow(false);
        setShowMember(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function loadTransactions() {
    axios.get('https://localhost:7223/loyaltymember/transactions', { params: { memberId: member['id'] } })
      .then(function (response) {
        setTransactions(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function loadRewards() {
    axios.get('https://localhost:7223/reward/list')
      .then(function (response) {
        console.log(response.data);
        setMember(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function getName(firstName, lastName) {
    if (lastName == null) {
      return firstName;
    }
    return firstName + ' ' + lastName;
  }

  function deleteTransaction(transactionId) {
    axios.delete('https://localhost:7223/transaction', { params: { transactionId: transactionId } })
      .then(function (response) {
        loadTransactions();
        loadMember();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function getMember() {
    return updatedMember === null ? member : updatedMember;
  }

  return (
    <>
    {(updatedMember !== null) &&
      <Modal
        size='xl'
        show={showMember}
        onHide={handleClose}
        backdrop='static'
        centered='true'
      >
        <Modal.Header className='d-flex align-items-center justify-content-center'>
          <Modal.Title id='example-custom-modal-styling-title'>{getName(updatedMember['firstName'], updatedMember['lastName'])}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='d-flex flex-column'>
          <Row className="h-50">
            <Col className="" style={{ paddingRight: 0 }}>
              <div className='h-100 bg-secondary-subtle rounded m-2 d-flex align-items-center justify-content-center' style={{ fontSize: '5rem' }}>
                {updatedMember ? updatedMember['points'] : member['points']}
              </div>
            </Col>
            <Col className="" style={{ paddingLeft: 0, paddingRight: '.75rem' }}>
              <div className='h-100 bg-secondary-subtle rounded m-2' style={{ fontSize: '2rem' }}>
                <p className='p-2'>{updatedMember ? updatedMember['meta'] : member['meta']}</p>
              </div>
            </Col>
          </Row>
          <Row className="h-50 pt-3">
            <Col className="" style={{ paddingRight: 0 }}>
              <div className='h-100 bg-secondary-subtle rounded m-2' style={{ fontSize: '1.5rem' }}>
                <div className='p-2' style={{ overflowY: 'auto', overflowX: 'hidden', maxHeight: '200px' }}>
                  <table id="transactionsTable" className="table table-dark table-striped table-hover table-bordered" style={{ fontSize: '1.2rem', tableLayout: 'auto' }}>
                    <colgroup>
                      <col span="1" style={{ width: '40%' }} />
                      <col span="1" style={{ width: '5%' }} />
                      <col span="1" style={{ width: '20%' }} />
                      <col span="1" style={{ width: '1%' }} />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Points</th>
                        <th>Emp.</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        transactions.map(t => {
                          return <tr key={t['id']} style={{ height: 5 }}>
                            <td style={{ padding: 0, paddingLeft: 2 }}>{new Date(t['date']).toLocaleString('en-US', {
                              day: '2-digit', // numeric, 2-digit
                              year: '2-digit', // numeric, 2-digit
                              month: '2-digit', // numeric, 2-digit, long, short, narrow
                              hour: '2-digit', // numeric, 2-digit
                              minute: 'numeric', // numeric, 2-digit
                            })}</td>
                            <td className='p-0'>{t['pointsEarned']}</td>
                            <td className='p-0'>{t['employee']}</td>
                            <td className='p-0'><Button variant="secondary" onClick={() => deleteTransaction(t['id'])}>X</Button></td>
                          </tr>
                        })
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </Col>
            <Col className="" style={{ paddingLeft: 0, paddingRight: '.75rem' }}>
              <div className='h-100 bg-secondary-subtle rounded m-2' style={{ fontSize: '1.5rem', position: 'relative' }}>
                <div className='p-2'>
                  <form onSubmit={redeemReward}>
                {rewards ? rewards.map(r => {
                          return <label key={r['id']} htmlFor={r['id']} >
                              <input type="radio" id={r['id']} name='reward' value={r['id']} style={{verticalAlign: 'middle'}}/>
                              &nbsp;{r['pointCost']} - {r['description']}
                            </label>
                        })
                : ''}
                  <br></br>
                  <Button variant="primary" type='submit' style={{position: 'absolute', right: 10, bottom: 10}}>Redeem</Button>
                  </form>
                </div>
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>Understood</Button>
        </Modal.Footer>
      </Modal>
      
    }
    {(updatedMember === null) &&
      <Modal
        size='xl'
        show={show}
        onHide={handleClose}
        backdrop='static'
        centered='true'
      >
        <Modal.Header className='d-flex align-items-center justify-content-center'>
          <Modal.Title id='example-custom-modal-styling-title'>New Member</Modal.Title>
        </Modal.Header>
        <Modal.Body className='d-flex flex-column'>
          <Form onSubmit={newMember}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="firstname">
                <Form.Control placeholder="Firstname" />
              </Form.Group>

              <Form.Group as={Col} controlId="lastname">
                <Form.Control placeholder="Lastname" />
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="email">
              <Form.Control placeholder="Email" />
            </Form.Group>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="notes">
                <Form.Label>Notes</Form.Label>
                <Form.Control as="textarea" rows={3} />
              </Form.Group>


            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="birthday">
                <Form.Label>Birthday Month</Form.Label>
                <Form.Select defaultValue="Birthday Month">
                  <option value="0">Birthday Month</option>
                  <option value="1">JAN</option>
                  <option value="2">FEB</option>
                  <option value="3">MAR</option>
                  <option value="4">APR</option>
                  <option value="5">MAY</option>
                  <option value="6">JUN</option>
                  <option value="7">JUL</option>
                  <option value="8">AUG</option>
                  <option value="9">SEP</option>
                  <option value="10">OCT</option>
                  <option value="11">NOV</option>
                  <option value="12">DEC</option>
                </Form.Select>
              </Form.Group>
            </Row>
            <Form.Group className="mb-3" id="sebts">
              <Form.Check type="checkbox" label="SEBTS Student" />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
}
      <Button variant="primary" onClick={handleShow}>
        Add Member
      </Button>
    </>

  )
}
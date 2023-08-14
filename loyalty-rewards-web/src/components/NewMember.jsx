import { React, useState } from 'react';
import { Button, Modal, Form, Row, Col, InputGroup } from 'react-bootstrap';
import axios from 'axios';

export default function NewMember() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
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
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  return (
    <>
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
      <Button variant="primary" onClick={handleShow}>
        Add Member
      </Button>
    </>

  )
}
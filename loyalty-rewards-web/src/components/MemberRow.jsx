import { useState } from 'react';
import { Button, Modal, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const MemberRow = (props) => {
  const { member } = props;
  const [show, setShow] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    axios.get('https://localhost:7223/loyaltymember/transactions', { params: { id: member['id'] } })
        .then(function (response) {
          setTransactions(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    setShow(true);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
  }
  function getName(firstName, lastName) {
    if (lastName == null) {
      return firstName;
    }
    return firstName + ' ' + lastName;
  }

  return (
    <>
      <tr onClick={handleShow} role='button'>
        <td>{getName(member['firstName'], member['lastName'])}</td>
        <td>{member['email']}</td>
        <td>{member['points']}</td>
      </tr>
      <Modal
        size='xl'
        show={show}
        onHide={handleClose}
        backdrop='static'
        centered='true'
      >
        <Modal.Header className='d-flex align-items-center justify-content-center'>
          <Modal.Title id='example-custom-modal-styling-title'>{getName(member['firstName'], member['lastName'])}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='d-flex flex-column' style={{height: '400px'}}>
          <Row className="h-50">
            <Col className="" style={{paddingRight: 0}}>
              <div className='h-100 bg-secondary-subtle rounded m-2 d-flex align-items-center justify-content-center' style={{fontSize: '5rem'}}>
                {member['points']}
              </div>
            </Col>
            <Col className="" style={{paddingLeft: 0, paddingRight: '.75rem'}}>
            <div className='h-100 bg-secondary-subtle rounded m-2' style={{fontSize: '2rem'}}>
                {member['meta']}
              </div>
            </Col>  
          </Row>
          <Row className="h-50 pt-3">
            <Col className="" style={{paddingRight: 0}}>
              <div className='h-100 bg-secondary-subtle rounded m-2' style={{fontSize: '1.5rem'}}>
                {transactions}
              </div>
            </Col>
            <Col className="" style={{paddingLeft: 0, paddingRight: '.75rem'}}>
            <div className='h-100 bg-secondary-subtle rounded m-2' style={{fontSize: '2rem'}}>
                {member['meta']}
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
    </>
  )
}

export default MemberRow;
import { useState } from 'react';
import { Button, Modal, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const MemberRow = (props) => {
  const { member } = props;
  const [show, setShow] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    axios.get('https://localhost:7223/loyaltymember/transactions', { params: { memberId: member['id'] } })
      .then(function (response) {
        setTransactions(response.data);
        console.log(response.data);
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

  function getDate(ticks) {
    var ticks = 635556672000000000;

    //ticks are in nanotime; convert to microtime
    var ticksToMicrotime = ticks / 10000;

    //ticks are recorded from 1/1/1; get microtime difference from 1/1/1/ to 1/1/1970
    var epochMicrotimeDiff = Math.abs(new Date(0, 0, 1).setFullYear(1));

    //new date is ticks, converted to microtime, minus difference from epoch microtime
    var tickDate = new Date(ticksToMicrotime - epochMicrotimeDiff);

    return tickDate;
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
        <Modal.Body className='d-flex flex-column'>
          <Row className="h-50">
            <Col className="" style={{ paddingRight: 0 }}>
              <div className='h-100 bg-secondary-subtle rounded m-2 d-flex align-items-center justify-content-center' style={{ fontSize: '5rem' }}>
                {member['points']}
              </div>
            </Col>
            <Col className="" style={{ paddingLeft: 0, paddingRight: '.75rem' }}>
              <div className='h-100 bg-secondary-subtle rounded m-2' style={{ fontSize: '2rem' }}>
                <p className='p-2'>{member['meta']}</p>
              </div>
            </Col>
          </Row>
          <Row className="h-50 pt-3">
            <Col className="" style={{ paddingRight: 0 }}>
              <div className='h-100 bg-secondary-subtle rounded m-2' style={{ fontSize: '1.5rem' }}>
                <p className='p-2'>
                  <table id="transactionsTable" className="table table-dark table-striped table-hover table-bordered" style={{ fontSize: '1.2rem' }}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Points</th>
                        <th>Amount</th>
                        <th>Emp.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        transactions.map(t => {
                          return <tr>
                            <td>{new Date(t['date']).toLocaleDateString()}</td>
                            <td>{t['pointsEarned']}</td>
                            <td>t['amount']</td>
                            <td>t['employee']</td>
                          </tr>
                        })
                      }
                    </tbody>
                  </table>
                </p>
              </div>
            </Col>
            <Col className="" style={{ paddingLeft: 0, paddingRight: '.75rem' }}>
              <div className='h-100 bg-secondary-subtle rounded m-2' style={{ fontSize: '2rem' }}>
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
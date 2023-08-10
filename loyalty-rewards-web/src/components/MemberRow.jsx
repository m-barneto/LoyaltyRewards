import { useState } from 'react';
import { Button, Modal, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const MemberRow = (props) => {
  const { memberId, member } = props;
  const [show, setShow] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [updatedMember, setUpdatedMember] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    loadMember();
    loadTransactions();
    setShow(true);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
  }

  function loadMember() {
    axios.get('https://localhost:7223/loyaltymember', { params: { memberId: member['id'] } })
      .then(function (response) {
        setUpdatedMember(response.data);
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

  function getName(firstName, lastName) {
    if (lastName == null) {
      return firstName;
    }
    return firstName + ' ' + lastName;
  }

  function deleteTransaction(transactionId) {
    axios.delete('https://localhost:7223/transaction', { params: { transactionId: transactionId } })
      .then(function (response) {
        console.log(response);
        loadTransactions();
        loadMember();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function getMember() {
    if (updatedMember !== null) {
      console.log(updatedMember['points']);
    }
    return updatedMember === null ? member : updatedMember;
  }

  return (
    <>
      <tr onClick={handleShow} role='button'>
        <td>{getName(getMember()['firstName'], getMember()['lastName'])}</td>
        <td>{getMember()['email']}</td>
        <td>{getMember()['points']}</td>
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
              <div className='h-100 bg-secondary-subtle rounded m-2' style={{ fontSize: '2rem' }}>
                {updatedMember ? updatedMember['meta'] : member['meta']}
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
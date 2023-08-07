import { useState } from 'react';
import { Button, Modal, Row, Col, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const MemberRow = (props) => {
  const { id, name, email, points } = props;
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    console.log('reeeee');
    setShow(true);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
  }
  return (
    <>
      <tr onClick={handleShow} role='button'>
        <td>{name}</td>
        <td>{email}</td>
        <td>{points}</td>
      </tr>
      <Modal
        size='xl'
        show={show}
        onHide={handleClose}
        backdrop='static'
        centered='true'
      >
        <Modal.Header closeButton>
          <Modal.Title id='example-custom-modal-styling-title'>{name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='d-flex flex-column' style={{height: '400px'}}>
          <Row className="h-50">
            <Col className="" style={{paddingRight: 0}}>
              <div className='h-100 bg-secondary-subtle rounded m-2 d-flex align-items-center justify-content-center' style={{fontSize: '5rem'}}>
                300
              </div>
            </Col>
            <Col className="" style={{paddingLeft: 0, paddingRight: '.75rem'}}>
            <div className='h-100 bg-secondary-subtle rounded m-2' style={{fontSize: '2rem'}}>
                meta text blah blah blah blah blah
              </div>
            </Col>  
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary">Understood</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default MemberRow;
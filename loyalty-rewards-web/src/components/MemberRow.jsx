import { useState } from 'react';
import { Button, Modal, Row, Col, Form } from 'react-bootstrap';

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
      <tr onClick={handleShow}>
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
        <Modal.Body>
          <Row>
            <Col sm={6}>

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
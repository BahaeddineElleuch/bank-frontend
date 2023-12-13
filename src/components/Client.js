import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';  // Import SweetAlert
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Modal,
  Paper,
  TextField,
} from '@mui/material';

const Client = () => {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({
    cin: '',
    firstName: '',
    lastName: '',
    adress: '',
  });
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:8080/clients', { mode: 'cors' });
        setClients(response.data);
        //console.log('Fetched clients:', response.data);
      } catch (error) {
        console.error('Error fetching Clients:', error);
      }
    };

    fetchClients();
  }, []);
  const handleDelete = async (cin, name) => {
    const confirmDelete = await Swal.fire({
      title: 'Are you sure you want to delete?',
      html: `Client Cin: ${cin}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });
  
    if (confirmDelete.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8080/clients/${cin}`, { mode: 'cors' });
        setClients((prevClients) => prevClients.filter((client) => client.cin !== cin));
        showSuccessAlert('Client deleted successfully!');
      } catch (error) {
        console.error('Error deleting client:', error);
        showErrorAlert('Error deleting client!');
      }
    }
  };

  const handleUpdate = (cin) => {
    const selectedClient = clients.find((client) => client.cin === cin);
    setSelectedClient(selectedClient);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
  };

  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedClient((prevClient) => ({ ...prevClient, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      //console.log('Request Data:', selectedClient);
      await axios.put(`http://localhost:8080/clients/${selectedClient.cin}`, selectedClient, {
        mode: 'cors',
      });
      const updatedResponse = await axios.get('http://localhost:8080/clients', { mode: 'cors' });
      //showSuccessAlert('Client updated successfully!');  // Error resizeObserver
      setClients(updatedResponse.data);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating client:', error);
      showErrorAlert('Error updating Client!');  // Show success alert

    }

  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient((prevClient) => ({ ...prevClient, [name]: value }));
  };

  const handleAddClient = async () => {
    if (!newClient.adress || !newClient.cin || !newClient.lastName || !newClient.firstName) {
      showErrorAlert('Missing data !!!');  // Show success alert
      //window.alert('Your fields are empty!');
      return;
    }
    try {
      await axios.post('http://localhost:8080/clients', newClient, { mode: 'cors' });
      const response = await axios.get('http://localhost:8080/clients', { mode: 'cors' });
      setClients(response.data);
      setNewClient({
        cin: '',
        firstName: '',
        lastName: '',
        adress: '',
      });
      showSuccessAlert('Client inserted successfully!');  // Show success alert
    } catch (error) {
      console.error('Error adding client:', error);
    }
  };

  const showSuccessAlert = (message) => {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message,
    });
  };
  const showErrorAlert = (message) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
    });
  };

  return (
    <div>
      <h2>Add New Client</h2>
      <div>
        <TextField
          label="CIN"
          variant="outlined"
          name="cin"
          value={newClient.cin}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <TextField
          label="First Name"
          variant="outlined"
          name="firstName"
          value={newClient.firstName}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <TextField
          label="Last Name"
          variant="outlined"
          name="lastName"
          value={newClient.lastName}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <TextField
          label="Address"
          variant="outlined"
          name="adress"
          value={newClient.adress}
          onChange={handleInputChange}
          required
        />
      </div>
      <Button variant="contained" color="primary" onClick={handleAddClient}>
        Add Client
      </Button>

      <h2>Clients</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>CIN</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Prenom</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.cin}>
                <TableCell>{client.cin}</TableCell>
                <TableCell>{client.firstName}</TableCell>
                <TableCell>{client.lastName}</TableCell>
                <TableCell>{client.adress}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleUpdate(client.cin)}>
                    Update
                  </Button>
                  <Button variant="contained" color="error" onClick={() => handleDelete(client.cin)}>
                    Delete
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary" 
                    component={Link}
                    to={`/accounts/${client.cin}`}        
                  >
                    Show Accounts
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedClient && isModalOpen && (
        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <ModalContent>
            <h2>Edit Client</h2>
            <div>
              <TextField
                label="CIN"
                variant="outlined"
                name="cin"
                value={selectedClient.cin}
                onChange={handleModalInputChange}
                disabled
              />
            </div>
            <div>
              <TextField
                label="First Name"
                variant="outlined"
                name="firstName"
                value={selectedClient.firstName}
                onChange={handleModalInputChange}
              />
            </div>
            <div>
              <TextField
                label="Last Name"
                variant="outlined"
                name="lastName"
                value={selectedClient.lastName}
                onChange={handleModalInputChange}
              />
            </div>
            <div>
              <TextField
                label="Address"
                variant="outlined"
                name="adress"
                value={selectedClient.adress}
                onChange={handleModalInputChange}
              />
            </div>
            <Button variant="contained" color="primary" onClick={handleSaveChanges}>
              Save Changes
            </Button>
            <Button variant="contained" onClick={handleCloseModal}>
              Close
            </Button>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

const ModalContent = styled.div`
  background-color: #fefefe;
  margin: 5% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
`;

export default Client;

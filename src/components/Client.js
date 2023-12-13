import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from '@emotion/styled';
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
    adress: '', // Corrected to match the backend field name
  });
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:8080/clients', { mode: 'cors' });
        setClients(response.data);
        console.log('Fetched clients:', response.data);
      } catch (error) {
        console.error('Error fetching Clients:', error);
      }
    };

    fetchClients();
  }, []);

  const handleDelete = async (cin) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this client?');

    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8080/clients/${cin}`, { mode: 'cors' });
        // Update the clients state by removing the deleted client
        setClients((prevClients) => prevClients.filter((client) => client.cin !== cin));
      } catch (error) {
        console.error('Error deleting client:', error);
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
      console.log('Request Data:', selectedClient);
      await axios.put(`http://localhost:8080/clients/${selectedClient.cin}`, selectedClient, {
        mode: 'cors',
      });
      // Fetch the updated list of clients after updating a client
      const updatedResponse = await axios.get('http://localhost:8080/clients', { mode: 'cors' });
      setClients(updatedResponse.data);
      // Close the modal
      setIsModalOpen(false);
    } catch (error) {
      // Handle errors as before
      console.error('Error updating client:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient((prevClient) => ({ ...prevClient, [name]: value }));
  };

  const handleAddClient = async () => {
    if (!newClient.adress ||!newClient.cin ||!newClient.lastName ||!newClient.firstName ){
      window.alert('your fields are empty !');
      return;
    }
    try {
      
      await axios.post('http://localhost:8080/clients', newClient, { mode: 'cors' });
      // Fetch the updated list of clients after adding a new client
      const response = await axios.get('http://localhost:8080/clients', { mode: 'cors' });
      setClients(response.data);
      // Reset the new client form
      setNewClient({
        cin: '',
        firstName: '',
        lastName: '',
        adress: '', // Corrected to match the backend field name
      });
    } catch (error) {
      console.error('Error adding client:', error);
    }
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
          label="adress"
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
              <TableCell>adress</TableCell>
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
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(client.cin)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for updating client */}
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
                label="adress"
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

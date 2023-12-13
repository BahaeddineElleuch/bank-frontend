import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  TextField,
  IconButton
} from '@mui/material';
import styled from 'styled-components';

const Account = () => {
  const [accounts, setAccounts] = useState([]);
  const [newAccount, setNewAccount] = useState({
    rib: '',
    balance:'',
    clientCin: '',
  });
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/accounts', { mode: 'cors' });
        setAccounts(response.data);
        console.log('Fetched accounts:', response.data);
      } catch (error) {
        console.error('Error fetching Accounts:', error);
      }
    };

    fetchAccounts();
  }, []);

  const handleDelete = async (rib) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this account?');

    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8080/accounts/${rib}`, { mode: 'cors' });
        // Update the accounts state by removing the deleted account
        setAccounts((prevAccounts) => prevAccounts.filter((account) => account.rib !== rib));
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  };

  const handleUpdate = (rib) => {
    const selectedAccount = accounts.find((account) => account.rib === rib);
    setSelectedAccount(selectedAccount);
    //console.log(selectedAccount)
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAccount(null);
  };

  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedAccount((prevAccount) => ({ ...prevAccount, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      console.log('Request Data:', selectedAccount);
      await axios.put(`http://localhost:8080/accounts/${selectedAccount.rib}`, selectedAccount, {
        mode: 'cors',
      });
      // Fetch the updated list of accounts after updating an account
      const updatedResponse = await axios.get('http://localhost:8080/accounts', { mode: 'cors' });
      setAccounts(updatedResponse.data);
      // Close the modal
      setIsModalOpen(false);
    } catch (error) {
      // Handle errors as before
      console.error('Error updating account:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAccount((prevAccount) => ({
      ...prevAccount,
      [name]: value,
    }));
  };  

  const handleAddAccount = async () => {
    try {
      // Ensure that clientCin is sent with the correct value
      console.log('New Account Data:', newAccount);
      const clientResponse = await axios.get(`http://localhost:8080/clients/${newAccount.clientCin}`, {
        mode: 'cors',
      });
      if(clientResponse.data){
        // console.log(clientResponse.data)
        const accountData = {
            rib: newAccount.rib,
            balance: newAccount.balance,
            client: clientResponse.data,
          };
      
          await axios.post('http://localhost:8080/accounts/', accountData, { mode: 'cors' });
          
          // Fetch the updated list of accounts after adding a new account
          const response = await axios.get('http://localhost:8080/accounts', { mode: 'cors' });
          setAccounts(response.data);
      
          // Reset the new account form
          setNewAccount({
            rib: '',
            balance:'',
            clientCin: '',
          });    
        //   toast
        toast.success("Account Created")
        }else{
        console.log("Client Not found")
        // toast 
        toast.error("Client Not Found !!")

      }


      
    } catch (error) {
      console.error('Error adding account:', error);
    }
  };
  

  return (
    <div>
      <h2>Add New Account</h2>
      <div>
        <TextField
          label="RIB"
          variant="outlined"
          name="rib"
          value={newAccount.rib}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <TextField
          label="Balance"
          variant="outlined"
          name="balance"
          value={newAccount.balance}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <TextField
          label="Client CIN"
          variant="outlined"
          name="clientCin"
          value={newAccount.clientCin}
          onChange={handleInputChange}
        />
      </div>
      <Button variant="contained" color="primary" onClick={handleAddAccount}>
        Add Account
      </Button>

      <h2>Accounts</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>RIB</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Client CIN</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {accounts.map((account) => (
            <TableRow key={account.rib}>
                <TableCell>{account.rib}</TableCell>
                <TableCell>{account.balance}</TableCell>

                <TableCell>{account.client ? account.client.cin : 'N/A'}</TableCell>
                <TableCell>
                <Button variant="contained" color="primary" onClick={() => handleUpdate(account.rib)}>
                    Update
                </Button>
                <Button variant="contained" color="secondary" onClick={() => handleDelete(account.rib)}>
                    Delete
                </Button>
                </TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for updating account */}
      {selectedAccount && isModalOpen && (
        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <ModalContent>
            <h2>Edit Account</h2>
            <div>
              <TextField
                label="RIB"
                variant="outlined"
                name="rib"
                value={selectedAccount.rib}
                onChange={handleModalInputChange}
                disabled
              />
            </div>
            <div>
              <TextField
                label="BALANCE"
                variant="outlined"
                name="balance"
                value={selectedAccount.balance}
                onChange={handleModalInputChange}
              />
            </div>
            <div>
              <TextField
                label="Client CIN"
                variant="outlined"
                name="clientCin"
                value={selectedAccount.client.cin}
                onChange={handleModalInputChange}
                disabled
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

export default Account;
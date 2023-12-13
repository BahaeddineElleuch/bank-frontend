import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const NavbarWrapper = styled.div`
  background-color: #333;
  padding: 10px;
  color: white;
  display: flex;
  justify-content: space-around;
`;

const Navbar = () => {
  return (
    <NavbarWrapper>
      <Link to="/client">Client</Link>
      <Link to="/accounts">Accounts</Link>
    </NavbarWrapper>
  );
};

export default Navbar;

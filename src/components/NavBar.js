import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Tab, Tabs, Typography } from '@mui/material';
import { styled } from '@mui/system';

const NavbarWrapper = styled(AppBar)`
  background-color: #1976d2;
  padding: 10px 20px;
  .MuiTabs-indicator {
    background-color: #ffffff;
  }
`;

const StyledTab = styled(Tab)`
  text-align: center; // Center the text content
  text-transform: none;
  font-weight: 600;
  font-size: 16px;
  color: #ffffff;

  &:hover {
    color: #ffffff;
    opacity: 0.8;
  }

  &.Mui-selected {
    color: #ffffff;
  }
`;

const Navbar = () => {
  return (
    <NavbarWrapper position="center">
      <Tabs>
        <StyledTab label="Client" component={Link} to="/client" />
        <StyledTab label="Accounts" component={Link} to="/accounts" />
      </Tabs>
    </NavbarWrapper>
  );
};

export default Navbar;

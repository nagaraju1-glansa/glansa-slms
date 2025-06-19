import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { withTranslation } from "react-i18next";
// import avatar2 from '../../../assets/images/users/avatar-2.jpg';
import { API_BASE_URL } from '../../../pages/ApiConfig/ApiConfig'; // Update if different
import { getToken } from '../../../pages/ApiConfig/ApiConfig'; // Update path as per your project

const ProfileMenu = ({ t }) => {
  const [menu, setMenu] = useState(false);
  const [member, setMember] = useState({});

  const toggle = () => setMenu(prev => !prev);

  let username = localStorage.getItem("UserType");
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    const uNm = obj.email.split("@")[0];
    username = uNm.charAt(0).toUpperCase() + uNm.slice(1);
  }
  const roleId = localStorage.getItem('RoleId');

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/me`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
          }
        });
        const data = await response.json();
        setMember(data.user);
        console.log(data.user);
      } catch (error) {
        console.error('Error fetching member details:', error);
      }
    };

    fetchMemberDetails();
  }, []);

  return (
    <Dropdown isOpen={menu} toggle={toggle} className="d-inline-block user-dropdown">
      <DropdownToggle tag="button" className="btn header-item waves-effect" id="page-header-user-dropdown">
        <img
          src={member.image ? `${member.image}` : ""}
          alt="profile"
          className="rounded-circle img-fluid mb-3"
          style={{ width: '30px', height: '30px', objectFit: 'cover' }}
          onError={e => {
            e.target.onerror = null;
            e.target.src = "http://127.0.0.1:8000/storage/uploads/user.jpg";
          }}
        />
        <span className="d-none d-xl-inline-block ms-1 text-transform">{username}</span>
        <i className="mdi mdi-chevron-down d-none ms-1 d-xl-inline-block"></i>
      </DropdownToggle>
      <DropdownMenu className="dropdown-menu-end">
        {roleId === 'Member' ? (
          <DropdownItem href={`/memberview/${localStorage.getItem('mencpt')}`}>
            <i className="ri-user-line align-middle me-1"></i> {t('Profile')}
          </DropdownItem>
        ) : (
          <DropdownItem href="/profile">
            <i className="ri-user-line align-middle me-1"></i> {t('Profile')}
          </DropdownItem>
        )}
        <DropdownItem divider />
        <DropdownItem className="text-danger" href="/logout">
          <i className="ri-shut-down-line align-middle me-1 text-danger"></i> {t('Logout')}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default withTranslation()(ProfileMenu);

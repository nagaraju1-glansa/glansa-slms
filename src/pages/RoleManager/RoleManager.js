import React, { useState, useEffect } from "react";
import { CustomFetch } from "../ApiConfig/CustomFetch";
import {
  Row,
  Col,
  Card,
  CardBody,
  Label,
  Input,
  Form,
  Button,
  Container,
  Table
} from "reactstrap";

function RoleManager() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, [selectedRole]);

  const fetchRoles = async () => {
    const res = await CustomFetch('/roles');
    const data = await res.json();
    setRoles(data);

    // If roles exist, set the first role as the default selected role
    if (data.length > 0) {
      // If selectedRole exists and matches a role in fetched roles, keep it; otherwise, set the first role
      if (selectedRole && selectedRole.id && data.find(role => role.id === selectedRole.id)) {
        setSelectedRole(selectedRole);
        setSelectedPermissions(selectedRole.permissions.map(p => p.name));
      } else {
        const defaultRole = data[0];
        setSelectedRole(defaultRole);
        setSelectedPermissions(defaultRole.permissions.map(p => p.name)); // Default permissions
      }
    }
  };

  const fetchPermissions = async () => {
    const res = await CustomFetch('/permissions');
    const data = await res.json();
    setPermissions(data);
  };

  const handleAssign = async () => {
    await CustomFetch(`/roles/${selectedRole.id}/permissions`, {
      method: 'POST',
      body: JSON.stringify({
        permissions: selectedPermissions,
      }),
    });
    // Only re-fetch roles if necessary; this will reload the roles and reset the selected role
    // fetchRoles(); // Uncomment this only if role data on the backend is updated
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    const guard = permission.guard_name || 'default';
    if (!acc[guard]) acc[guard] = [];
    acc[guard].push(permission);
    return acc;
  }, {});

  const handleCheckboxChange = (permission) => {
    const updatedPermissions = selectedPermissions.includes(permission.name)
      ? selectedPermissions.filter(p => p !== permission.name) // Remove if already selected
      : [...selectedPermissions, permission.name]; // Add if not selected

    setSelectedPermissions(updatedPermissions); // Update state
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div>
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 className="mb-0">Role Management</h4>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <h5>Roles</h5>
                <ul className="list-group">
                  {roles && roles.map(role => (
                    <li
                      className={`list-group-item ${selectedRole?.id === role.id ? 'active' : ''}`}
                      key={role.id}
                      onClick={() => {
                        setSelectedRole(role);
                        setSelectedPermissions(role.permissions.map(p => p.name));
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {role.name}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-md-8">
                <h5>Permissions</h5>
                {selectedRole && (
                  <div className="card p-4 shadow-sm">
                    {Object.entries(groupedPermissions).map(([guard, perms]) => (
                      <div key={guard} className="mb-4">
                        <h6 className="text-primary mt-3">{guard.toUpperCase()} Permissions</h6>
                        <div className="row g-3 p-2">
                          {perms.map(permission => (
                            <div key={permission.id} className="col-md-4 col-sm-6 col-12">
                              <div className={`permission-card p-3 rounded shadow-sm ${selectedPermissions.includes(permission.name) ? 'selected' : ''}`}>
                                <div className="d-flex justify-content-between align-items-center">
                                  <label className="form-check-label">{permission.name}</label>
                                  <input
                                    type="checkbox"
                                    className="form-check-input switch"
                                    checked={selectedPermissions.includes(permission.name)}
                                    onChange={() => handleCheckboxChange(permission)} // Handle the checkbox toggle
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button className="btn btn-primary mt-3 w-100" onClick={handleAssign}>
                      Update Permissions
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default RoleManager;

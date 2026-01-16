import { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import { getUsers, createUser, deleteUser, updateUser, getRoles, createRole, deleteRole } from "../api/users";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showAddRoleForm, setShowAddRoleForm] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', email: '', role: 'User' });
  const [newRole, setNewRole] = useState({ name: '', description: '', permissions: [] });
  const [editingUser, setEditingUser] = useState(null);

  const loadUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const loadRoles = async () => {
    try {
      const res = await getRoles();
      setRoles(res.data);
    } catch (error) {
      console.error('Failed to load roles:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([loadUsers(), loadRoles()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.username || !newUser.email) {
      alert('Username and email are required');
      return;
    }

    try {
      await createUser(newUser);
      setNewUser({ username: '', email: '', role: 'User' });
      setShowAddUserForm(false);
      await loadUsers();
      alert('User created successfully');
    } catch (error) {
      console.error('Failed to create user:', error);
      alert('Failed to create user');
    }
  };

  const handleAddRole = async (e) => {
    e.preventDefault();
    if (!newRole.name) {
      alert('Role name is required');
      return;
    }

    try {
      await createRole(newRole);
      setNewRole({ name: '', description: '', permissions: [] });
      setShowAddRoleForm(false);
      await loadRoles();
      alert('Role created successfully');
    } catch (error) {
      console.error('Failed to create role:', error);
      alert('Failed to create role');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        await loadUsers();
        alert('User deleted successfully');
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete user');
      }
    }
  };

  const handleDeleteRole = async (id) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await deleteRole(id);
        await loadRoles();
        alert('Role deleted successfully');
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete role');
      }
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({ username: user.username, email: user.email, role: user.role });
    setShowAddUserForm(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await updateUser(editingUser.id, newUser);
      setEditingUser(null);
      setNewUser({ username: '', email: '', role: 'User' });
      setShowAddUserForm(false);
      await loadUsers();
      alert('User updated successfully');
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Failed to update user');
    }
  };

  const userColumns = [
    {
      name: 'Username',
      selector: row => row.username,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
    },
    {
      name: 'Role',
      selector: row => row.role,
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => row.status || 'Active',
      sortable: true,
      cell: row => (
        <span className={`status-badge ${(row.status || 'active').toLowerCase()}`}>
          {row.status || 'Active'}
        </span>
      ),
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="action-buttons">
          <button 
            className="btn btn-sm btn-primary"
            onClick={() => handleEditUser(row)}
          >
            Edit
          </button>
          <button 
            className="btn btn-sm btn-danger"
            onClick={() => handleDeleteUser(row.id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const roleColumns = [
    {
      name: 'Role Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Description',
      selector: row => row.description,
      sortable: true,
    },
    {
      name: 'Permissions',
      selector: row => row.permissions?.join(', ') || 'None',
      wrap: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="action-buttons">
          <button className="btn btn-sm btn-primary">Edit</button>
          <button 
            className="btn btn-sm btn-danger"
            onClick={() => handleDeleteRole(row.id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container">
      <div className="card">
        <div className="page-header">
          <h2>User & Role Management</h2>
        </div>

        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button 
            className={`tab ${activeTab === 'roles' ? 'active' : ''}`}
            onClick={() => setActiveTab('roles')}
          >
            Roles
          </button>
        </div>

        {activeTab === 'users' && (
          <>
            <div className="page-header">
              <h3>Users</h3>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  setEditingUser(null);
                  setNewUser({ username: '', email: '', role: 'User' });
                  setShowAddUserForm(!showAddUserForm);
                }}
              >
                {showAddUserForm ? 'Cancel' : 'Add User'}
              </button>
            </div>

            {showAddUserForm && (
              <div className="upload-section">
                <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
                <form onSubmit={editingUser ? handleUpdateUser : handleAddUser}>
                  <div className="form-group">
                    <input
                      className="form-control"
                      placeholder="Username"
                      value={newUser.username}
                      onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      className="form-control"
                      type="email"
                      placeholder="Email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <select
                      className="form-control"
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    >
                      {roles.map(role => (
                        <option key={role.id} value={role.name}>{role.name}</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    {editingUser ? 'Update User' : 'Create User'}
                  </button>
                </form>
              </div>
            )}

            <DataTable
              columns={userColumns}
              data={users}
              pagination
              paginationPerPage={10}
              progressPending={loading}
              highlightOnHover
              striped
              responsive
              noDataComponent="No users found"
            />
          </>
        )}

        {activeTab === 'roles' && (
          <>
            <div className="page-header">
              <h3>Roles</h3>
              <button 
                className="btn btn-primary" 
                onClick={() => setShowAddRoleForm(!showAddRoleForm)}
              >
                {showAddRoleForm ? 'Cancel' : 'Add Role'}
              </button>
            </div>

            {showAddRoleForm && (
              <div className="upload-section">
                <h3>Add New Role</h3>
                <form onSubmit={handleAddRole}>
                  <div className="form-group">
                    <input
                      className="form-control"
                      placeholder="Role Name"
                      value={newRole.name}
                      onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      className="form-control"
                      placeholder="Description"
                      value={newRole.description}
                      onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Permissions:</label>
                    {['read', 'write', 'delete', 'admin'].map(perm => (
                      <label key={perm} style={{display: 'block', margin: '4px 0'}}>
                        <input
                          type="checkbox"
                          checked={newRole.permissions.includes(perm)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewRole({...newRole, permissions: [...newRole.permissions, perm]});
                            } else {
                              setNewRole({...newRole, permissions: newRole.permissions.filter(p => p !== perm)});
                            }
                          }}
                        />
                        {perm}
                      </label>
                    ))}
                  </div>
                  <button type="submit" className="btn btn-primary">Create Role</button>
                </form>
              </div>
            )}

            <DataTable
              columns={roleColumns}
              data={roles}
              pagination
              paginationPerPage={10}
              progressPending={loading}
              highlightOnHover
              striped
              responsive
              noDataComponent="No roles found"
            />
          </>
        )}
      </div>
    </div>
  );
}
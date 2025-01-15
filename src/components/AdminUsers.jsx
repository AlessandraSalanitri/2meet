import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { db } from "../firebase/firebaseConfig";
import "../styles/AdminUsers.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ email: "", isAdmin: false, password: "" });
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // Toggle for showing/hiding password
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        if (usersSnapshot.empty) {
          console.log("No users found in Firestore.");
        }
        const usersList = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log("Fetched users:", usersList);
        setUsers(usersList);
        console.log("Users state updated:", usersList);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Add a new user
  const handleAddUser = async () => {
    try {
      const newUserDoc = await addDoc(collection(db, "users"), newUser);
      setUsers((prev) => [...prev, { id: newUserDoc.id, ...newUser }]);
      setNewUser({ email: "", isAdmin: false, password: "" });
      alert("User added successfully!");
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  // Update a user's details
  const handleUpdateUser = async () => {
    try {
      const userRef = doc(db, "users", editingUser.id);
      await updateDoc(userRef, { email: editingUser.email, isAdmin: editingUser.isAdmin });
      setUsers((prev) =>
        prev.map((user) => (user.id === editingUser.id ? editingUser : user))
      );
      setEditingUser(null);
      alert("User updated successfully!");
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  // Delete a user
  const handleDeleteUser = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      setUsers((prev) => prev.filter((user) => user.id !== id));
      alert("User deleted successfully!");
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  return (
    <div className="admin-users">
      <h1>Manage Users</h1>
  
      {/* Add User Form */}
      <div className="add-user-section">
        <h2>Add New User</h2>
  
        {/* Email Field */}
        <div className="input-group">
          <label htmlFor="title">Enter New User Email and Password</label>
          <div className="input-icon">
            <input
              id="email"
              type="email"
              placeholder="Enter email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <span className="icon">📧</span>
          </div>
        </div>
  
        {/* Password Field */}
        <div className="input-group password-field">

          <div className="input-icon">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
          </div>
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
  
        {/* Admin Checkbox */}
        <label className="is-admin-label">
        <span>Check the Box for Admin Users</span>
          <input
            type="checkbox"
            checked={newUser.isAdmin}
            onChange={(e) => setNewUser({ ...newUser, isAdmin: e.target.checked })}
          />
  
        </label>
        <br></br><br></br>
  
        {/* Buttons */}
        <div className="buttons">
          <button className="add-user-btn" onClick={handleAddUser}>
            Add User
          </button>
          <button
            className="clear-btn"
            onClick={() => setNewUser({ email: "", isAdmin: false, password: "" })}
          >
            Clear
          </button>
        </div>
      </div>
  
      {/* Users Table */}
      <div className="users-table">
        <h2>All Users</h2>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Password</th>
              <th>Admin</th>
              <th>UID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>******</td>
                <td>{user.isAdmin ? "Yes" : "No"}</td>
                <td>{user.id}</td>
                <td>
                  <button onClick={() => setEditingUser(user)}>Modify</button>
                  <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      {/* Edit User Modal */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit User</h2>
            <input
              type="email"
              placeholder="Email"
              value={editingUser.email}
              onChange={(e) =>
                setEditingUser({ ...editingUser, email: e.target.value })
              }
            />
            <label>
              <input
                type="checkbox"
                checked={editingUser.isAdmin}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, isAdmin: e.target.checked })
                }
              />
              <span>Is Admin</span>
            </label>
            <div className="buttons">
              <button onClick={handleUpdateUser}>Save Changes</button>
              <button onClick={() => setEditingUser(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
  
      {/* Go Back Button */}
      <button className="go-back-button" onClick={() => navigate(-1)}>
        Go Back
      </button>
    </div>
  );
};

export default AdminUsers;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setUsers,
  addUser,
  deleteUser,
  updateUser,
} from "../redux/userSlice.js";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users } = useSelector((state) => state.users);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userCompany, setUserCompany] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Couldn't fetch users!");
        }
        return res.json();
      })
      .then((data) => {
        dispatch(setUsers(data));
      })
      .catch((err) => {
        console.log("Error:", err);
        setErrorMsg("Error loading users, try again later.");
      });
  }, [dispatch]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!userName && !userEmail) {
      setErrorMsg("You need to fill both name and email!");
      return;
    }
    if (!userName) {
      setErrorMsg("Name is required!");
      return;
    }
    if (!userEmail) {
      setErrorMsg("Email is required!");
      return;
    }
    if (!userEmail.includes("@")) {
      setErrorMsg("Email needs to be valid (include @)!");
      return;
    }

    if (editingUser) {
      dispatch(
        updateUser({
          id: editingUser.id,
          name: userName,
          email: userEmail,
          company: { name: userCompany || "" },
        })
      );
      setEditingUser(null);
    } else {
      const newUser = {
        id: Date.now(),
        name: userName,
        email: userEmail,
        company: { name: userCompany || "" },
        address: { street: "", suite: "", city: "", zipcode: "" },
        phone: "",
        website: "",
      };
      dispatch(addUser(newUser));
    }

    setUserName("");
    setUserEmail("");
    setUserCompany("");
    setErrorMsg("");
  };

  const sortTable = (field) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const displayedUsers = users
    .filter((user) => {
      const search = searchTerm.toLowerCase();
      return (
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search)
      );
    })
    .sort((userA, userB) => {
      if (!sortField) {
        return 0;
      }

      let valueA;
      let valueB;
      if (sortField === "name") {
        valueA = userA.name;
        valueB = userB.name;
      } else {
        valueA = userA.email;
        valueB = userB.email;
      }

      if (sortDirection === "asc") {
        if (valueA < valueB) return -1;
        if (valueA > valueB) return 1;
        return 0;
      } else {
        if (valueB < valueA) return -1;
        if (valueB > valueA) return 1;
        return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Form to add or edit users */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Plus className="w-6 h-6 text-blue-500" />
            {editingUser ? "Edit User" : "Add New User"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4"
          >
            <input
              type="text"
              placeholder="Enter name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Enter email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Company"
              value={userCompany}
              onChange={(e) => setUserCompany(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> {editingUser ? "Update" : "Add"}
            </button>
          </form>
          {errorMsg && <p className="text-red-500 mt-2">{errorMsg}</p>}
        </div>

        {/* Search bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 p-2 pl-10 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table of users */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-50">
                <th
                  className="border-b border-gray-200 p-3 text-left text-gray-700 cursor-pointer hover:bg-blue-100"
                  onClick={() => sortTable("name")}
                >
                  <div className="flex items-center gap-2">
                    Name
                    {sortField === "name" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="w-4 h-4" />
                      ) : (
                        <ArrowDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>
                <th
                  className="border-b border-gray-200 p-3 text-left text-gray-700 cursor-pointer hover:bg-blue-100"
                  onClick={() => sortTable("email")}
                >
                  <div className="flex items-center gap-2">
                    Email
                    {sortField === "email" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="w-4 h-4" />
                      ) : (
                        <ArrowDown className="w-4 h-4" />
                      ))}
                  </div>
                </th>
                <th className="border-b border-gray-200 p-3 text-left text-gray-700">
                  Company
                </th>
                <th className="border-b border-gray-200 p-3 text-left text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td
                    className="border-b border-gray-200 p-3 text-blue-600 cursor-pointer hover:underline"
                    onClick={() => navigate(`/user/${user.id}`)}
                  >
                    {user.name}
                  </td>
                  <td className="border-b border-gray-200 p-3">{user.email}</td>
                  <td className="border-b border-gray-200 p-3">
                    {user.company.name}
                  </td>
                  <td className="border-b border-gray-200 p-3 flex gap-2">
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setUserName(user.name);
                        setUserEmail(user.email);
                        setUserCompany(user.company.name);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => dispatch(deleteUser(user.id))}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for editing user */}
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Edit className="w-6 h-6 text-blue-500" /> Edit User
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Enter name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Enter email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={userCompany}
                  onChange={(e) => setUserCompany(e.target.value)}
                  className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" /> Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingUser(null);
                      setUserName("");
                      setUserEmail("");
                      setUserCompany("");
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex items-center gap-2"
                  >
                    <X className="w-5 h-5" /> Cancel
                  </button>
                </div>
              </form>
              {errorMsg && <p className="text-red-500 mt-2">{errorMsg}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;

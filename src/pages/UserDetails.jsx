import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";

function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const users = useSelector((state) => state.users.users);
  const user = users.find((u) => u.id === Number(id) || u.id === id);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-red-500 text-lg font-semibold flex items-center gap-2">
          <User className="w-6 h-6" /> User not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <User className="w-8 h-8 text-blue-500" /> User Details
        </h1>
        <div className="bg-gray-100 p-6 rounded-lg space-y-4">
          <p className="text-gray-700">
            <strong className="font-semibold">Name:</strong> {user.name}
          </p>
          <p className="text-gray-700">
            <strong className="font-semibold">Email:</strong> {user.email}
          </p>
          <p className="text-gray-700">
            <strong className="font-semibold">Phone:</strong> {user.phone}
          </p>
          <p className="text-gray-700">
            <strong className="font-semibold">Website:</strong> {user.website}
          </p>
          <p className="text-gray-700">
            <strong className="font-semibold">Address:</strong>{" "}
            {user.address.street}, {user.address.suite}, {user.address.city},{" "}
            {user.address.zipcode}
          </p>
          <p className="text-gray-700">
            <strong className="font-semibold">Company:</strong>{" "}
            {user.company.name}
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="mt-6 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" /> Back to List
        </button>
      </div>
    </div>
  );
}

export default UserDetails;

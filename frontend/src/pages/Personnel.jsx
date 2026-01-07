import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Search, Trash2, Edit, Plus, Mail, Briefcase, Users } from "lucide-react";

import Loader from "../components/Loader";
import FormInput from "../components/FormInput";
import ConfirmDialog from "../components/ConfirmDialog";
import { validatePersonnel } from "../utils/validation";

import {
  getAllPersonnel,
  createPersonnel,
  deletePersonnel,
  searchPersonnel,
} from "../api/personnel.api";

export default function Personnel() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    experience_level: "Junior",
  });

  // Load all personnel
  const loadPersonnel = async () => {
    try {
      setLoading(true);
      const res = await getAllPersonnel();
      setList(res.data.data || []);
    } catch (error) {
      toast.error("Failed to load personnel");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPersonnel();
  }, []);

  // Add personnel
  const submit = async () => {
    const { isValid, errors } = validatePersonnel(form);
    setFormErrors(errors);

    if (!isValid) {
      toast.error("Please fix form errors");
      return;
    }

    try {
      await createPersonnel(form);
      toast.success("Personnel added successfully");
      setForm({
        name: "",
        email: "",
        role: "",
        experience_level: "Junior",
      });
      setFormErrors({});
      loadPersonnel();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create personnel");
    }
  };

  // Delete personnel
  const remove = async (id) => {
    try {
      await deletePersonnel(id);
      toast.success("Personnel deleted successfully");
      loadPersonnel();
    } catch (error) {
      toast.error("Failed to delete personnel");
    }
  };

  // Search personnel
  const handleSearch = async () => {
    if (!search.trim()) {
      loadPersonnel();
      return;
    }

    try {
      setLoading(true);
      const res = await searchPersonnel(search);
      setList(res.data.data || []);
      toast.success(`Found ${res.data.data?.length || 0} results`);
    } catch (error) {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level) => {
    const colors = {
      Junior: "bg-green-100 text-green-800",
      "Mid-Level": "bg-blue-100 text-blue-800",
      Senior: "bg-purple-100 text-purple-800",
    };
    return colors[level] || colors.Junior;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Personnel Management
        </h1>
        <p className="text-gray-600">Manage your team members and their information</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              placeholder="Search by name, role, or email..."
              className="w-full border border-gray-300 rounded-lg p-2 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
          {search && (
            <button
              onClick={() => {
                setSearch("");
                loadPersonnel();
              }}
              className="bg-gray-200 text-gray-700 px-4 rounded-lg hover:bg-gray-300 transition"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Add Personnel Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add New Personnel
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <FormInput
            label="Name"
            placeholder="Enter full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={formErrors.name}
          />
          <FormInput
            label="Email"
            type="email"
            placeholder="email@example.com"
            icon={Mail}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={formErrors.email}
          />
          <FormInput
            label="Role"
            placeholder="e.g., Frontend Developer"
            icon={Briefcase}
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            error={formErrors.role}
          />
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Experience Level
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              value={form.experience_level}
              onChange={(e) => setForm({ ...form, experience_level: e.target.value })}
            >
              <option>Junior</option>
              <option>Mid-Level</option>
              <option>Senior</option>
            </select>
          </div>
        </div>
        <button
          onClick={submit}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Personnel
        </button>
      </div>

      {/* Personnel List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-bold">Personnel List ({list.length})</h2>
        </div>

        {loading ? (
          <Loader />
        ) : list.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>No personnel found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {list.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{p.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {p.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{p.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(p.experience_level)}`}>
                        {p.experience_level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      <button onClick={() => navigate(`/personnel/edit/${p.id}`)} className="text-blue-600 hover:text-blue-800 transition">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteId(p.id)} className="text-red-600 hover:text-red-800 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => remove(deleteId)}
        title="Delete Personnel"
        message="Are you sure you want to delete this personnel? This action cannot be undone."
      />
    </div>
  );
}

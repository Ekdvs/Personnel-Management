import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Save } from "lucide-react";
import Loader from "../components/Loader";
import FormInput from "../components/FormInput";
import { getPersonnelById, updatePersonnel } from "../api/personnel.api";

export default function EditPersonnel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPersonnelById(id)
      .then((res) => {
        setForm(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load");
        navigate("/personnel");
      });
  }, [id, navigate]);

  const submit = async () => {
    if (!form.name || !form.email || !form.role) {
      toast.error("All fields required");
      return;
    }

    try {
      await updatePersonnel(id, form);
      toast.success("Updated successfully");
      navigate("/personnel");
    } catch {
      toast.error("Update failed");
    }
  };

  if (loading) return <Loader />;
  if (!form) return null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        onClick={() => navigate("/personnel")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Personnel
      </button>

      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Personnel</h1>

        <div className="space-y-4">
          <FormInput
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <FormInput
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <FormInput
            label="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
          <div>
            <label className="block mb-1 text-sm font-medium">Experience Level</label>
            <select
              className="w-full border rounded-lg p-2"
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
          className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Update
        </button>
      </div>
    </div>
  );
}
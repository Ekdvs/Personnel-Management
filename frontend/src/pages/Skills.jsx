import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Award } from "lucide-react";
import Loader from "../components/Loader";
import ConfirmDialog from "../components/ConfirmDialog";
import { createSkill, deleteSkill, getAllSkills } from "../api/skills.api";

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({ name: "", category: "", description: "" });

  const loadSkills = async () => {
    try {
      setLoading(true);
      const res = await getAllSkills();
      setSkills(res.data.data || []);
    } catch {
      toast.error("Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const addSkill = async () => {
    if (!form.name || !form.category) {
      toast.error("Name and category required");
      return;
    }

    try {
      await createSkill(form);
      toast.success("Skill added");
      setForm({ name: "", category: "", description: "" });
      loadSkills();
    } catch {
      toast.error("Failed to add skill");
    }
  };

  const remove = async (id) => {
    try {
      await deleteSkill(id);
      toast.success("Deleted");
      loadSkills();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Skills Management</h1>

      {/* Add Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Add New Skill</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            placeholder="Skill name"
            className="border rounded-lg p-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Category (e.g., Programming)"
            className="border rounded-lg p-2"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <input
            placeholder="Description (optional)"
            className="border rounded-lg p-2"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <button
          onClick={addSkill}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <Loader />
        ) : skills.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Award className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>No skills found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {skills.map((s) => (
              <div key={s.id} className="border rounded-lg p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{s.name}</h3>
                  <button
                    onClick={() => setDeleteId(s.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-2">{s.category}</p>
                {s.description && (
                  <p className="text-sm text-gray-500">{s.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => remove(deleteId)}
        title="Delete Skill"
        message="Are you sure? This cannot be undone."
      />
    </div>
  );
}
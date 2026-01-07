import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2, Plus } from "lucide-react";
import {
  createProject,
  getAllProjects,
  deleteProject,
  matchPersonnel,
} from "../api/projects.api";
import { getAllSkills } from "../api/skills.api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "Planning",
    requiredSkills: [],
  });

  // Load projects and skills
  const load = async () => {
    try {
      setLoading(true);
      const projRes = await getAllProjects();
      const skillRes = await getAllSkills();
      setProjects(projRes.data.data || []);
      setSkills(skillRes.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load projects or skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Create project
  const submit = async () => {
    if (!form.name.trim()) return toast.error("Project name required");
    if (!form.description.trim()) return toast.error("Project description required");
    if (!form.start_date || !form.end_date) return toast.error("Start and end dates are required");

    try {
      await createProject(form);
      toast.success("Project created successfully");
      setForm({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        status: "Planning",
        requiredSkills: [],
      });
      load();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create project");
    }
  };

  // Toggle skill selection
  const toggleSkill = (skillId) => {
    setForm({
      ...form,
      requiredSkills: form.requiredSkills.includes(skillId)
        ? form.requiredSkills.filter((id) => id !== skillId)
        : [...form.requiredSkills, skillId],
    });
  };

  // Delete project
  const handleDelete = async (id) => {
    if (!confirm("Delete this project?")) return;
    try {
      await deleteProject(id);
      toast.success("Project deleted");
      load();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete project");
    }
  };

  // Match personnel
  const handleMatch = async (id) => {
    try {
      setLoading(true);
      const res = await matchPersonnel(id);
      const matches = res.data.data || [];
      if (!matches.length) toast("No matching personnel found");
      else toast.success(`Found ${matches.length} matches`);
      console.log("Matches:", matches);
    } catch (error) {
      console.error(error);
      toast.error("Failed to match personnel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Projects Management</h1>

      {/* Add Project Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add New Project
        </h2>

        <input
          className="border p-2 mb-2 w-full rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Project name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <textarea
          className="border p-2 mb-2 w-full rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Project description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div className="flex gap-2 mb-2">
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={form.start_date}
            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
          />
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={form.end_date}
            onChange={(e) => setForm({ ...form, end_date: e.target.value })}
          />
        </div>
        <select
          className="border p-2 mb-2 rounded w-full"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="Planning">Planning</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
        </select>

        {/* Skills selection */}
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.map((s) => (
            <label
              key={s.id}
              className={`border p-2 rounded cursor-pointer ${
                form.requiredSkills.includes(s.id)
                  ? "bg-blue-100 border-blue-500"
                  : "bg-white"
              }`}
            >
              <input
                type="checkbox"
                className="mr-2"
                checked={form.requiredSkills.includes(s.id)}
                onChange={() => toggleSkill(s.id)}
              />
              {s.name}
            </label>
          ))}
        </div>

        <button
          onClick={submit}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Add Project
        </button>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="text-center py-6">Loading...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-6 text-gray-500">No projects found</div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                  Skills
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{p.name}</td>
                  <td className="px-6 py-4">{p.requiredSkills?.map((s) => s.name).join(", ")}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleMatch(p.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                    >
                      Match Personnel
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-600 hover:text-red-800"
                    >
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
  );
}

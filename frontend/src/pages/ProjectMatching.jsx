import { useEffect, useState } from "react";
import { getAllProjects, matchPersonnel } from "../api/projects.api";

export default function ProjectMatching() {
  const [projects, setProjects] = useState([]);
  const [matches, setMatches] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load all projects
  const loadProjects = async () => {
    try {
      const res = await getAllProjects();
      setProjects(res.data.data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load projects");
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Match personnel for a project
  const handleMatch = async (project) => {
    try {
      setLoading(true);
      setSelectedProject(project);
      const res = await matchPersonnel(project.id);
      setMatches(res.data.data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to match personnel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Project → Personnel Matching</h1>

      {/* Project Selection */}
      <ul className="mb-6 flex flex-col gap-2">
        {projects.map((p) => (
          <li key={p.id}>
            <button
              onClick={() => handleMatch(p)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Match for {p.name}
            </button>
          </li>
        ))}
      </ul>

      {selectedProject && (
        <>
          <h2 className="text-xl font-bold mt-6">
            Matched Personnel for "{selectedProject.name}"
          </h2>

          {loading ? (
            <p className="text-gray-500 mt-2">Loading matches...</p>
          ) : matches.length === 0 ? (
            <p className="text-gray-500 mt-2">No personnel matched yet</p>
          ) : (
            <table className="w-full border rounded-lg overflow-hidden mt-2">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Experience</th>
                  <th className="px-4 py-2 text-left">Match %</th>
                  <th className="px-4 py-2 text-left">Matched Skills</th>
                  <th className="px-4 py-2 text-left">Missing Skills</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((m) => (
                  <tr key={m.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-4 py-2">{m.name}</td>
                    <td className="px-4 py-2">{m.role}</td>
                    <td className="px-4 py-2">{m.experience_level}</td>
                    <td className="px-4 py-2">{m.match_percentage || 0}%</td>
                    <td className="px-4 py-2">
                      {m.matched_skills?.map((s) => (
                        <div key={s.skill_name}>
                          {s.skill_name} ({s.person_level || s.proficiency})
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-2">
                      {m.missing_skills?.map((s) => (
                        <div key={s.skill_name}>
                          {s.skill_name} ({s.required_level}) – {s.reason || ""}
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

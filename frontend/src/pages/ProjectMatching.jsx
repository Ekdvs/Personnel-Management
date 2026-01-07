import { useEffect, useState } from "react";
import { getAllProjects, matchPersonnel } from "../api/projects.api";

export default function ProjectMatching() {
  const [projects, setProjects] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    getAllProjects().then((res) => setProjects(res.data.data || []));
  }, []);

  const match = async (id) => {
    const res = await matchPersonnel(id);
    setMatches(res.data.data || []);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Project → Personnel Matching</h1>

      <ul className="mb-6">
        {projects.map((p) => (
          <li key={p.id} className="mb-2">
            <button
              onClick={() => match(p.id)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Match for {p.name}
            </button>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold mt-6">Matched Personnel</h2>

      {matches.length === 0 ? (
        <p className="text-gray-500 mt-2">No personnel matched yet</p>
      ) : (
        <ul className="border rounded-lg overflow-hidden">
          {matches.map((m) => (
            <li key={m.id} className="border-b px-4 py-2">
              {m.name} – {m.role}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import { Link, useLocation } from "react-router-dom";
import { Users, Award, Briefcase, GitMerge } from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  const links = [
    { path: "/personnel", label: "Personnel", icon: Users },
    { path: "/skills", label: "Skills", icon: Award },
    { path: "/projects", label: "Projects", icon: Briefcase },
    { path: "/matching", label: "Matching", icon: GitMerge },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Award className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">
              Skills Management
            </h1>
          </div>
          
          <div className="flex space-x-1">
            {links.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  location.pathname === path
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
import { useState, useEffect } from "react";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";
import "./App.css";

const API_URL = "http://localhost:5000/api/projects";

function App() {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [error, setError] = useState("");
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const [projectRes, countRes] = await Promise.all([
          axios.get(API_URL),
          axios.get(`${API_URL}/count`),
        ]);
        setProjects(projectRes.data.projects);
        setCount(countRes.data.count);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, []);

  const addProject = async () => {
    if (!projectName.trim()) {
      setError("Project name cannot be empty!");
      return;
    }

    try {
      const response = await axios.post(API_URL, { name: projectName });
      setProjects((prev) => [...prev, response.data.project]);
      setProjectName("");
      setError("");
      setCount((prev) => prev + 1);
    } catch (err) {
      setError(err.response?.data.message || "An error occurred");
    }
  };

  const deleteProject = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setProjects((prev) => prev.filter((project) => project.id !== id));
      setCount((prev) => prev - 1);
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  const clearProjects = async () => {
    try {
      await axios.delete(API_URL);
      setProjects([]);
      setCount(0);
    } catch (err) {
      console.error("Error deleting all projects:", err);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Project Management</h1>
        <p>Total Projects: <span className="count">{count}</span></p>
      </header>

      <div className="input-section">
        <input 
          type="text" 
          value={projectName} 
          onChange={(e) => setProjectName(e.target.value)} 
          placeholder="Enter project name"
        />
        <button onClick={addProject}>Add Project</button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="project-grid">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div className="project-card" key={project.id}>
              <span className="project-name">{project.name}</span>
              <FaTrashAlt className="delete-icon" onClick={() => deleteProject(project.id)} />
            </div>
          ))
        ) : (
          <p className="no-projects">No projects added yet!</p>
        )}
      </div>

      {projects.length > 0 && (
        <button className="clear-btn" onClick={clearProjects}>Clear All Projects</button>
      )}
    </div>
  );
}

export default App;

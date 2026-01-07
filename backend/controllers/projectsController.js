import db from "../config/db.js";

// Create a new project
export const createProject = async (request, response) => {
    try {
        const { name, description, start_date, end_date, status } = request.body;

        // Validation
        if(!name || !description || !start_date || !end_date || !status) {
            return response.status(400).json({
                message: 'All fields are required',
                error: true,
                success: false
            });
        }

        // Validate status
        const validStatuses = ['Planning', 'Active', 'Completed'];
        if(!validStatuses.includes(status)) {
            return response.status(400).json({
                message: 'Invalid status. Must be: Planning, Active, or Completed',
                error: true,
                success: false
            });
        }

        // Validate dates
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        if(isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return response.status(400).json({
                message: 'Invalid date format. Use YYYY-MM-DD',
                error: true,
                success: false
            });
        }

        if(endDate < startDate) {
            return response.status(400).json({
                message: 'End date must be after start date',
                error: true,
                success: false
            });
        }

        const [result] = await db.execute(
            "INSERT INTO projects (name, description, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)",
            [name, description, start_date, end_date, status]
        );

        return response.status(201).json({
            message: 'Project created successfully',
            projectId: result.insertId,
            error: false,
            success: true
        });

    } catch (error) {
        console.error("Error creating project:", error);
        response.status(500).json({
            message: 'Failed to create project',
            error: true,
            success: false
        });  
    }
}

// Get all projects
export const getAllProjects = async(request, response) => {
    try {
        const [projects] = await db.execute('SELECT * FROM projects ORDER BY created_at DESC');

        return response.status(200).json({
            message: 'Projects retrieved successfully',
            count: projects.length,
            data: projects,
            error: false,
            success: true
        });

    } catch (error) {
        console.error('Failed to fetch projects:', error);
        response.status(500).json({ 
            message: 'Failed to fetch projects',
            error: true,
            success: false
        });
    }
}

// Get project by ID with required skills
export const getProjectById = async(request, response) => {
    try {
        const { id } = request.params;

        if(!id) {
            return response.status(400).json({ 
                message: 'Project ID is required',
                error: true,
                success: false
            });
        }

        // Get project details
        const [projects] = await db.execute('SELECT * FROM projects WHERE id = ?', [id]);

        if(projects.length === 0) {
            return response.status(404).json({ 
                message: 'Project not found',
                error: true,
                success: false
            });
        }

        // Get required skills for this project
        const [skills] = await db.execute(
            `SELECT s.id, s.name, s.category, ps.min_proficiency 
             FROM skills s
             JOIN project_skills ps ON s.id = ps.skill_id
             WHERE ps.project_id = ?`,
            [id]
        );

        return response.status(200).json({
            message: 'Project fetched successfully',
            data: {
                ...projects[0],
                required_skills: skills
            },
            error: false,
            success: true
        });

    } catch (error) {
        console.error('Error fetching project by ID:', error);
        response.status(500).json({ 
            message: 'Failed to fetch project by ID',
            error: true,
            success: false
        });
    }
}

// Update project
export const updateProject = async(request, response) => {
    try {
        const { id } = request.params;
        const { name, description, start_date, end_date, status } = request.body;

        if(!id) {
            return response.status(400).json({ 
                message: 'Project ID is required',
                error: true,
                success: false
            });
        }

        if(!name || !description || !start_date || !end_date || !status) {
            return response.status(400).json({
                message: 'All fields are required',
                error: true,
                success: false
            });
        }

        // Validate status
        const validStatuses = ['Planning', 'Active', 'Completed'];
        if(!validStatuses.includes(status)) {
            return response.status(400).json({
                message: 'Invalid status. Must be: Planning, Active, or Completed',
                error: true,
                success: false
            });
        }

        const [result] = await db.execute(
            'UPDATE projects SET name=?, description=?, start_date=?, end_date=?, status=? WHERE id=?',
            [name, description, start_date, end_date, status, id]
        );

        if(result.affectedRows === 0) {
            return response.status(404).json({ 
                message: 'Project not found',
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            message: 'Project updated successfully',
            error: false,
            success: true
        });

    } catch (error) {
        console.error('Error updating project:', error);
        response.status(500).json({ 
            message: 'Failed to update project',
            error: true,
            success: false
        });
    }
}

// Delete project
export const deleteProject = async(request, response) => {
    try {
        const { id } = request.params;

        if(!id) {
            return response.status(400).json({ 
                message: 'Project ID is required',
                error: true,
                success: false
            });
        }

        const [result] = await db.execute('DELETE FROM projects WHERE id = ?', [id]);

        if(result.affectedRows === 0) {
            return response.status(404).json({ 
                message: 'Project not found',
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            message: 'Project deleted successfully',
            error: false,
            success: true
        });

    } catch (error) {
        console.error('Error deleting project:', error);
        response.status(500).json({ 
            message: 'Failed to delete project',
            error: true,
            success: false
        });
    }
}

// Add required skill to project
export const addProjectSkill = async(request, response) => {
    try {
        const { id } = request.params;  // FIXED: Was incorrectly getting from request.params.id
        const { skill_id, min_proficiency } = request.body;

        if(!id) {
            return response.status(400).json({ 
                message: 'Project ID is required',
                error: true,
                success: false
            });
        }

        if(!skill_id || !min_proficiency) {
            return response.status(400).json({ 
                message: 'Skill ID and minimum proficiency are required',
                error: true,
                success: false
            });
        }

        // Validate proficiency level
        const validProficiencies = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
        if(!validProficiencies.includes(min_proficiency)) {
            return response.status(400).json({ 
                message: 'Invalid proficiency level. Must be: Beginner, Intermediate, Advanced, or Expert',
                error: true,
                success: false
            });
        }

        // Check if project exists
        const [project] = await db.execute('SELECT id FROM projects WHERE id = ?', [id]);
        if(project.length === 0) {
            return response.status(404).json({ 
                message: 'Project not found',
                error: true,
                success: false
            });
        }

        // Check if skill exists
        const [skill] = await db.execute('SELECT id FROM skills WHERE id = ?', [skill_id]);
        if(skill.length === 0) {
            return response.status(404).json({ 
                message: 'Skill not found',
                error: true,
                success: false
            });
        }

        // Check if skill is already added to project
        const [existing] = await db.execute(
            'SELECT id FROM project_skills WHERE project_id = ? AND skill_id = ?',
            [id, skill_id]
        );

        if(existing.length > 0) {
            // Update existing requirement
            await db.execute(
                'UPDATE project_skills SET min_proficiency = ? WHERE project_id = ? AND skill_id = ?',
                [min_proficiency, id, skill_id]
            );

            return response.status(200).json({
                message: 'Project skill requirement updated successfully',
                error: false,
                success: true
            });
        }

        const [result] = await db.execute(
            'INSERT INTO project_skills (project_id, skill_id, min_proficiency) VALUES (?, ?, ?)',
            [id, skill_id, min_proficiency]
        );

        return response.status(201).json({
            message: 'Skill added to project successfully',
            requirementId: result.insertId,
            error: false,
            success: true
        });

    } catch (error) {
        console.error("Error adding skill to project:", error);
        response.status(500).json({
            message: 'Failed to add skill to project',
            error: true,
            success: false
        });
    }
}

// Remove skill from project
export const removeProjectSkill = async(request, response) => {
    try {
        const { id, skill_id } = request.params;

        if(!id || !skill_id) {
            return response.status(400).json({ 
                message: 'Project ID and Skill ID are required',
                error: true,
                success: false
            });
        }

        const [result] = await db.execute(
            'DELETE FROM project_skills WHERE project_id = ? AND skill_id = ?',
            [id, skill_id]
        );

        if(result.affectedRows === 0) {
            return response.status(404).json({ 
                message: 'Project skill requirement not found',
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            message: 'Skill removed from project successfully',
            error: false,
            success: true
        });

    } catch (error) {
        console.error("Error removing skill from project:", error);
        response.status(500).json({
            message: 'Failed to remove skill from project',
            error: true,
            success: false
        });
    }
}
import db from "../config/db.js";

// Proficiency level mapping for comparison
const levelMap = {
    Beginner: 1,
    Intermediate: 2,
    Advanced: 3,
    Expert: 4,
};

// Match personnel to project requirements
export const matchPersonnelToProject = async (request, response) => {
    try {
        const projectId = request.params.id;

        if(!projectId) {
            return response.status(400).json({ 
                message: 'Project ID is required',
                error: true,
                success: false
            });
        }

        // Check if project exists
        const [project] = await db.execute('SELECT * FROM projects WHERE id = ?', [projectId]);
        if(project.length === 0) {
            return response.status(404).json({ 
                message: 'Project not found',
                error: true,
                success: false
            });
        }

        // Get project required skills
        const [requirements] = await db.execute(
            `SELECT ps.skill_id, s.name as skill_name, ps.min_proficiency 
             FROM project_skills ps
             JOIN skills s ON ps.skill_id = s.id
             WHERE ps.project_id = ?`,
            [projectId]
        );

        if(requirements.length === 0) {
            return response.status(200).json({
                message: 'No skill requirements defined for this project',
                project: project[0],
                data: [],
                error: false,
                success: true
            });
        }

        // Get all personnel with their skills
        const [personnelSkills] = await db.execute(
            `SELECT 
                p.id, 
                p.name, 
                p.email,
                p.role, 
                p.experience_level,
                ps.skill_id, 
                s.name as skill_name,
                ps.proficiency
             FROM personnel p
             JOIN personnel_skills ps ON ps.personnel_id = p.id
             JOIN skills s ON ps.skill_id = s.id`
        );

        // Group personnel by ID with their skills
        const personnelMap = {};
        personnelSkills.forEach(row => {
            if(!personnelMap[row.id]) {
                personnelMap[row.id] = {
                    id: row.id,
                    name: row.name,
                    email: row.email,
                    role: row.role,
                    experience_level: row.experience_level,
                    skills: []
                };
            }
            personnelMap[row.id].skills.push({
                skill_id: row.skill_id,
                skill_name: row.skill_name,
                proficiency: row.proficiency
            });
        });

        // Match personnel against project requirements
        const matchedPersonnel = [];

        for(const personId in personnelMap) {
            const person = personnelMap[personId];
            let matchCount = 0;
            let totalRequirements = requirements.length;
            const matchedSkills = [];
            const missingSkills = [];

            // Check each requirement
            requirements.forEach(req => {
                const personSkill = person.skills.find(s => s.skill_id === req.skill_id);
                
                if(personSkill) {
                    const personLevel = levelMap[personSkill.proficiency];
                    const requiredLevel = levelMap[req.min_proficiency];
                    
                    if(personLevel >= requiredLevel) {
                        matchCount++;
                        matchedSkills.push({
                            skill_name: req.skill_name,
                            required_level: req.min_proficiency,
                            person_level: personSkill.proficiency
                        });
                    } else {
                        missingSkills.push({
                            skill_name: req.skill_name,
                            required_level: req.min_proficiency,
                            person_level: personSkill.proficiency,
                            reason: 'Proficiency too low'
                        });
                    }
                } else {
                    missingSkills.push({
                        skill_name: req.skill_name,
                        required_level: req.min_proficiency,
                        person_level: 'None',
                        reason: 'Skill not possessed'
                    });
                }
            });

            // Calculate match percentage
            const matchPercentage = Math.round((matchCount / totalRequirements) * 100);

            // Only include personnel with 100% match (has ALL required skills)
            if(matchCount === totalRequirements) {
                matchedPersonnel.push({
                    id: person.id,
                    name: person.name,
                    email: person.email,
                    role: person.role,
                    experience_level: person.experience_level,
                    match_percentage: matchPercentage,
                    matched_skills: matchedSkills,
                    all_skills: person.skills
                });
            }
        }

        // Sort by experience level (Senior > Mid-Level > Junior)
        const experiencePriority = { 'Senior': 3, 'Mid-Level': 2, 'Junior': 1 };
        matchedPersonnel.sort((a, b) => {
            return experiencePriority[b.experience_level] - experiencePriority[a.experience_level];
        });

        return response.status(200).json({
            message: matchedPersonnel.length > 0 
                ? 'Matched personnel found' 
                : 'No personnel found matching all requirements',
            project: {
                id: project[0].id,
                name: project[0].name,
                status: project[0].status
            },
            requirements: requirements,
            matched_count: matchedPersonnel.length,
            data: matchedPersonnel,
            error: false,
            success: true
        });

    } catch (error) {
        console.error('Error matching personnel to project:', error);
        response.status(500).json({ 
            message: 'Failed to match personnel to project',
            error: true,
            success: false
        });
    }
}

// Get partial matches (personnel who meet SOME requirements)
export const getPartialMatches = async (request, response) => {
    try {
        const projectId = request.params.id;
        const minMatchPercentage = parseInt(request.query.min_match) || 50;

        if(!projectId) {
            return response.status(400).json({ 
                message: 'Project ID is required',
                error: true,
                success: false
            });
        }

        // Get project required skills
        const [requirements] = await db.execute(
            `SELECT ps.skill_id, s.name as skill_name, ps.min_proficiency 
             FROM project_skills ps
             JOIN skills s ON ps.skill_id = s.id
             WHERE ps.project_id = ?`,
            [projectId]
        );

        if(requirements.length === 0) {
            return response.status(200).json({
                message: 'No skill requirements defined for this project',
                data: [],
                error: false,
                success: true
            });
        }

        // Get all personnel with their skills
        const [personnelSkills] = await db.execute(
            `SELECT 
                p.id, 
                p.name, 
                p.role, 
                p.experience_level,
                ps.skill_id, 
                s.name as skill_name,
                ps.proficiency
             FROM personnel p
             JOIN personnel_skills ps ON ps.personnel_id = p.id
             JOIN skills s ON ps.skill_id = s.id`
        );

        // Group personnel by ID
        const personnelMap = {};
        personnelSkills.forEach(row => {
            if(!personnelMap[row.id]) {
                personnelMap[row.id] = {
                    id: row.id,
                    name: row.name,
                    role: row.role,
                    experience_level: row.experience_level,
                    skills: []
                };
            }
            personnelMap[row.id].skills.push({
                skill_id: row.skill_id,
                skill_name: row.skill_name,
                proficiency: row.proficiency
            });
        });

        // Find partial matches
        const partialMatches = [];

        for(const personId in personnelMap) {
            const person = personnelMap[personId];
            let matchCount = 0;
            const matchedSkills = [];
            const missingSkills = [];

            requirements.forEach(req => {
                const personSkill = person.skills.find(s => s.skill_id === req.skill_id);
                
                if(personSkill && levelMap[personSkill.proficiency] >= levelMap[req.min_proficiency]) {
                    matchCount++;
                    matchedSkills.push({
                        skill_name: req.skill_name,
                        proficiency: personSkill.proficiency
                    });
                } else {
                    missingSkills.push({
                        skill_name: req.skill_name,
                        required_level: req.min_proficiency
                    });
                }
            });

            const matchPercentage = Math.round((matchCount / requirements.length) * 100);

            if(matchPercentage >= minMatchPercentage) {
                partialMatches.push({
                    ...person,
                    match_percentage: matchPercentage,
                    matched_skills: matchedSkills,
                    missing_skills: missingSkills
                });
            }
        }

        // Sort by match percentage
        partialMatches.sort((a, b) => b.match_percentage - a.match_percentage);

        return response.status(200).json({
            message: 'Partial matches found',
            min_match_percentage: minMatchPercentage,
            matched_count: partialMatches.length,
            data: partialMatches,
            error: false,
            success: true
        });

    } catch (error) {
        console.error('Error finding partial matches:', error);
        response.status(500).json({ 
            message: 'Failed to find partial matches',
            error: true,
            success: false
        });
    }
}
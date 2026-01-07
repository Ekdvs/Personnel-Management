import db from "../config/db.js";

//create a new personnel
export const createPersonnel = async(request, response)=>{
    try {

        const { name, email, role, experience_level } = request.body;
        if(!name || !email || !role || !experience_level) {
            return response.status(400).json(
                { 
                    Message: 'All fields are required',
                    error:true,
                    success:false
                }
            );
        }
        const [result] = await db.execute(
            'INSERT INTO personnel (name, email, role, experience_level) VALUES (?, ?, ?, ?)',
            [name, email, role, experience_level]
        );

        return response.status(201).json(
            { 
                message: 'Personnel created successfully', 
                personnelId: result.insertId,
                error:false,
                success:true
            }
        );
        
    } catch (error) {
        console.error('Error creating personnel:', error);
        response.status(500).json(
            { 
                message: 'Failed to create personnel',
                error:true,
                success:false
            }
        );
    
    }
}

//get all personnel
export const getAllPersonnel = async(request, response)=>{
    try {
        const [personnel] = await db.execute('SELECT * FROM personnel');
        return response.status(200).json(
            {
                message: 'Personnel fetched successfully',
                data: personnel,
                error:false,
                success:true
            }
        );
    } catch (error) {
        console.error('Failed to fetch personnel:', error);
        response.status(500).json(
            { 
                message: 'Failed to fetch personnel',
                error:true,
                success:false
            }
        );
    }
}

//read on e personnel by ID
export const getPersonnelById = async(request, response)=>{
    try {
        const { id } = request.params;
        const [personnel] = await db.execute('SELECT * FROM personnel WHERE id = ?', [id]);
        if(!id){
            return response.status(400).json(
                { 
                    message: 'Personnel ID is required',
                    error:true,
                    success:false
                }
            );
        }

        if(personnel.length === 0){
            return response.status(404).json(
                { 
                    message: 'Personnel not found',
                    error:true,
                    success:false
                }
            );
        }
        return response.status(200).json(
            {
                message: 'Personnel fetched successfully',
                data: personnel[0],
                error:false,
                success:true
            }
        );
        
    } catch (error) {
        console.error('Error creating personnel by ID:', error);
        response.status(500).json(
            { 
                message: 'Failed to fetch personnel by ID',
                error:true,
                success:false
            }
        );
    }
}

//update personnel by ID
export const updatePersonnelById = async(request, response)=>{
    try {
        const { id } = request.params;
        const { name, email, role, experience_level } = request.body;
        if(!name || !email || !role || !experience_level) {
            return response.status(400).json(
                { 
                    message: 'All fields are required',
                    error:true,
                    success:false
                }
            );
        }
        if(!id){
            return response.status(400).json(
                { 
                    message: 'Personnel ID is required',
                    error:true,
                    success:false
                }
            );
        }
        const [result] = await db.execute(
            'UPDATE personnel SET name=?, email=?, role=?, experience_level=? WHERE id=?',
            [name, email, role, experience_level, id]
        );
        if(result.affectedRows === 0){
            return response.status(404).json(
                { 
                    message: 'Personnel not found',
                    error:true,
                    success:false
                }
            );
        }
        return response.status(200).json(
            {
                message: 'Personnel updated successfully',
                error:false,
                success:true,
                data:result
            }
        );
    } catch (error) {
        console.error('Error updating personnel by ID:', error);
        response.status(500).json(
            { 
                message: 'Failed to update personnel by ID',
                error:true,
                success:false
            }
        );
    }
}

//delete personnel by ID
export const deletePersonnelById = async(request, response)=>{
    try {
        const { id } = request.params;
        if(!id){
            return response.status(400).json(
                { 
                    message: 'Personnel ID is required',
                    error:true,
                    success:false
                }
            );
        }
        const [result] = await db.execute('DELETE FROM personnel WHERE id = ?', [id]);
        if(result.affectedRows === 0){
            return response.status(404).json(
                { 
                    message: 'Personnel not found',
                    error:true,
                    success:false
                }
            );
        }
        return response.status(200).json(
            {
                message: 'Personnel deleted successfully',
                error:false,
                success:true
            }
        );
    } catch (error) {
        console.error('Error deleting personnel by ID:', error);
        response.status(500).json(
            { 
                message: 'Failed to delete personnel by ID',
                error:true,
                success:false
            }
        );
    }
}

//assign Skill
export const assignSkillToPersonnel = async(request, response)=>{
    try {
        const { id } = request.params;
        const { skill_id,proficiency  } = request.body;
        if(!id){
            return response.status(400).json(
                { 
                    message: 'Personnel ID is required',
                    error:true,
                    success:false
                }
            );
        }
        if(!skill_id||!proficiency){
            return response.status(400).json(
                { 
                    message: 'Skill ID and proficiency are required',
                    error:true,
                    success:false
                }
            );
        }
        const [result] = await db.execute(
            'INSERT INTO personnel_skills (personnel_id, skill_id, proficiency) VALUES (?, ?, ?)',
            [id, skill_id, proficiency]
        );
        return response.status(200).json(
            {
                message: 'Skill assigned to personnel successfully',
                error:false,
                success:true,
                data:result
            }
        );
    } catch (error) {
        console.error('Error assigning skill to personnel:', error);
        response.status(500).json(
            { 
                message: 'Failed to assign skill to personnel',
                error:true,
                success:false
            }
        );
    }
}

// ADDITIONAL FEATURE: Advanced Personnel Search
export const searchPersonnel = async(request, response) => {
    try {
        const { skill_name, min_proficiency, experience_level, role } = request.body;

        let query = `
            SELECT DISTINCT p.id, p.name, p.email, p.role, p.experience_level, p.created_at
            FROM personnel p
        `;

        const conditions = [];
        const params = [];

        // If searching by skill
        if(skill_name || min_proficiency) {
            query += `
                JOIN personnel_skills ps ON p.id = ps.personnel_id
                JOIN skills s ON ps.skill_id = s.id
            `;

            if(skill_name) {
                conditions.push(`s.name LIKE ?`);
                params.push(`%${skill_name}%`);
            }

            if(min_proficiency) {
                const proficiencyOrder = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
                const minIndex = proficiencyOrder.indexOf(min_proficiency);
                
                if(minIndex !== -1) {
                    const validProficiencies = proficiencyOrder.slice(minIndex);
                    conditions.push(`ps.proficiency IN (${validProficiencies.map(() => '?').join(',')})`);
                    params.push(...validProficiencies);
                }
            }
        }

        // Filter by experience level
        if(experience_level) {
            conditions.push(`p.experience_level = ?`);
            params.push(experience_level);
        }

        // Filter by role
        if(role) {
            conditions.push(`p.role LIKE ?`);
            params.push(`%${role}%`);
        }

        if(conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        query += ` ORDER BY p.created_at DESC`;

        const [results] = await db.execute(query, params);

        return response.status(200).json({
            message: 'Search completed successfully',
            count: results.length,
            data: results,
            error: false,
            success: true
        });

    } catch (error) {
        console.error('Error searching personnel:', error);
        response.status(500).json({ 
            message: 'Failed to search personnel',
            error: true,
            success: false
        });
    }
}
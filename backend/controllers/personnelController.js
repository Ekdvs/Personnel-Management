import db from "../config/db";

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
        const { id } = request.params.id;
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
        const { id } = request.params.id;
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
        const { id } = request.params.id;
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
        const { id } = request.params.id;
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

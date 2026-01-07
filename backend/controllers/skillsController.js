import db from "../config/db.js";


//create skill
export const createSkill = async(request,response)=>{
    try {
        const { name, category, description } = request.body;
        if(!name || !category || !description) {
            return response.status(400).json(
                { 
                    message: 'All fields are required',
                    error:true,
                    success:false
                }
            );
        }
        const [result] =  await db.execute(
            'INSERT INTO skills (name, category, description) VALUES (?, ?, ?)',
            [name, category, description]);
        
        return response.status(201).json(
            { 
                message: 'Skill created successfully', 
                data: result,
                error:false,
                success:true
            }
        );
        
    } catch (error) {
        console.error('Error creating skill:', error);
        response.status(500).json(
            { 
                message: 'Failed to create skill',
                error:true,
                success:false
            }
        );
    }
}

//get all skills
export const getAllSkills = async(request, response)=>{
    try {

        const [skills] = await db.execute('SELECT * FROM skills');
        
        if(skills.length === 0){
            return response.status(404).json(
                {  
                    message: 'No skills found',
                    error:true,
                    success:false
                }
            );
        }

        return response.status(200).json({
            message: 'Skills retrieved successfully',
            data: skills,
            error: false,
            success: true
        });
    } catch (error) {
        console.error('Error assigning skill to personnel:', error);
        return response.status(500).json(
            { 
                message: 'Failed to assign skill to personnel',
                error:true,
                success:false
            }
        )
    }
}

//update skill by ID
export const updateSkillById = async(request, response)=>{
    try {
        const { id } = request.params;
        const { name, category, description } = request.body;
        console.log("id",id);
        if(!id){
            return response.status(400).json(
                { 
                    message: 'Personnel ID is required',
                    error:true,
                    success:false
                }
            );
        }
        if(!name || !category || !description) {
            return response.status(400).json(
                { 
                    message: 'All fields are required',
                    error:true,
                    success:false
                }
            );
        }
        const [result] = await db.execute(
            'UPDATE skills SET name=?, category=?, description=? WHERE id=?',
            [name, category, description, id]
        );
        if(result.affectedRows === 0){
            return response.status(404).json(
                { 
                    message: 'Skill not found',
                    error:true,
                    success:false
                }
            );
        }
        return response.status(200).json(
            { 
                message: 'Skill updated successfully', 
                data: result,
                error:false,
                success:true
            }
        );
    } catch (error) {
        console.error('Error updating skill:', error);
        return response.status(500).json(
            { 
                message: 'Failed to update skill',
                error:true,
                success:false
            }
        );
    }
}

//delete skill by ID
export const deleteSkillById = async(request ,response)=>{
    try {
        const { id } = request.params.id;
        const [result] = await db.execute('DELETE FROM skills WHERE id=?', [id]);
        if(!id){
            return response.status(400).json(
                { 
                    message: 'Personnel ID is required',
                    error:true,
                    success:false
                }
            );
        }
        if(result.affectedRows === 0){
            return response.status(404).json(
                { 
                    message: 'Skill not found',
                    error:true,
                    success:false
                }
            );
        }
        return response.status(200).json(
            { 
                message: 'Skill deleted successfully', 
                data: result,
                error:false,
                success:true
            }
        );  
    } catch (error) {
        console.error('Error deleting skill:', error);
        return response.status(500).json(
            { 
                message: 'Failed to delete skill',
                error:true,
                success:false
            }
        );
    }
}
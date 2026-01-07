export const validatePersonnel = (form) => {
  const errors = {};
  
  if (!form.name?.trim()) {
    errors.name = "Name is required";
  }
  
  if (!form.email?.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Invalid email format";
  }
  
  if (!form.role?.trim()) {
    errors.role = "Role is required";
  }
  
  if (!form.experience_level) {
    errors.experience_level = "Experience level is required";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateSkill = (form) => {
  const errors = {};
  
  if (!form.name?.trim()) {
    errors.name = "Skill name is required";
  }
  
  if (!form.category?.trim()) {
    errors.category = "Category is required";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateProject = (form) => {
  const errors = {};
  
  if (!form.name?.trim()) {
    errors.name = "Project name is required";
  }
  
  if (!form.description?.trim()) {
    errors.description = "Description is required";
  }
  
  if (!form.start_date) {
    errors.start_date = "Start date is required";
  }
  
  if (!form.end_date) {
    errors.end_date = "End date is required";
  }
  
  if (form.start_date && form.end_date) {
    if (new Date(form.end_date) < new Date(form.start_date)) {
      errors.end_date = "End date must be after start date";
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
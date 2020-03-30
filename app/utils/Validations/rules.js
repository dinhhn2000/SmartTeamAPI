module.exports = {
  // Require rules (use for create)
  required: {
    firstName: "required|min:3",
    lastName: "required|min:3",
    email: "required|email",
    gender: "required|in:Male,Female",
    access_token: "required",
    otp: "required|numeric",
    name: "required|string",
    priority: "required|numeric",
    idTeam: "required|numeric",
    idTask: "required|numeric",
    idProject: "required|numeric",
    startedAt: "required|numeric",
    finishedAt: "required|numeric",
    dob: "required|numeric",
    points: "required|numeric",
    state: "required|numeric|between:1,5",
    type: "required|numeric|between:1,3",
    members: "required|array|min:1"
  },

  // Non required rules (Use for update)
  non_required: {
    firstName: "min:3",
    lastName: "min:3",
    email: "email",
    gender: "in:Male,Female",
    access_token: "required",
    otp: "numeric",
    name: "string",
    priority: "numeric",
    idTeam: "numeric",
    idProject: "numeric",
    startedAt: "numeric",
    finishedAt: "numeric",
    dob: "numeric",
    state: "numeric|between:1,5",
    points: "numeric",
    type: "numeric|between:1,3",
    members: "array|min:1",
    description: "string"
  }
};

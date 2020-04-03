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
    priority: "required|numeric|between:1,4",
    idTeam: "required|numeric",
    idTask: "required|numeric",
    idProject: "required|numeric",
    startedAt: "required|dateFormat",
    finishedAt: "required|dateFormat",
    dob: "required|dateFormat",
    points: "required|numeric",
    state: "required|numeric|between:1,5",
    type: "required|numeric|between:1,3",
    members: "required|array|min:1",
    member: "required|numeric",
    id: "required|numeric",
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
    priority: "numeric|between:1,4",
    idTeam: "numeric",
    idProject: "numeric",
    startedAt: "dateFormat",
    finishedAt: "dateFormat",
    dob: "dateFormat",
    state: "numeric|between:1,5",
    points: "numeric",
    type: "numeric|between:1,3",
    members: "array|min:1",
    member: "numeric",
    description: "string"
  }
};

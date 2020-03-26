module.exports = {
  firstName: "required|min:3",
  lastName: "required|min:3",
  email: "required|email",
  gender: "required|in:Male,Female",
  access_token: "required",
  otp: "required|numeric",
  name: "required|string",
  priority: "required|numeric",
  idTeam: "required|numeric",
  idProject: "required|numeric",
  finishedAt: "required|numeric",
  dob: "required|numeric",
  points: "required|numeric",
  type: "required|numeric",
  duration: "required|string"
};

const Role = require("../models/role");

// Pure functions - no cache, no initialization
async function getAdminRole() {
  return await Role.findOne({ type: 1, name: "Admin" });
}

async function getManagerRole() {
  return await Role.findOne({ type: 2, name: "Manager" });
}

async function getEmployeeRole() {
  return await Role.findOne({ type: 3, name: "Employee" });
}

// ID-specific getters
async function getAdminRoleId() {
  const role = await getAdminRole();
  return role?._id;
}

async function getManagerRoleId() {
  const role = await getManagerRole();
  return role?._id || role?.id;
}

async function getEmployeeRoleId() {
  const role = await getEmployeeRole();
  return role?._id || role?.id;
}

module.exports = {
  getAdminRole,
  getManagerRole,
  getEmployeeRole,
  getAdminRoleId,
  getManagerRoleId,
  getEmployeeRoleId,
};

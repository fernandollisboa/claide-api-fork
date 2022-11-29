import loginSchema from "./authSchema";
import createProjectAssociationSchema from "./createProjectAssociationSchema";
import createProjectSchema from "./createProjectSchema";
import * as membersSchema from "./membersSchema";
import updateProjectAssociationSchema from "./updateProjectAssociationSchema";
import updateProjectSchema from "./updateProjectSchema";

const schemas = {
  ...membersSchema,
  loginSchema,
  createProjectAssociationSchema,
  createProjectSchema,
  updateProjectAssociationSchema,
  updateProjectSchema,
};

export default schemas;

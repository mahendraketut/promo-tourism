import express from "express";
import {createRole, updateRole, getAllRoles, deleteRole} from "../controllers/role.controller.js";
const router = express.Router();

//post routes
router.post('/create', createRole);
router.get('/', getAllRoles);
router.put('/update/:id',updateRole);
router.delete('/delete/:id', deleteRole)
export default router;
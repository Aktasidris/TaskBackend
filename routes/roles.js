var express = require("express");
const bcrypt = require("bcrypt-nodejs");
const is = require("is_js");

const Users = require("../db/models/Users");
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const UserRoles = require("../db/models/UserRoles");
const Roles = require("../db/models/Roles");
const rolePrivileges = require("../config/role_privileges");
var router = express.Router();
const authMiddleware = require("../middleware/auth");

/* GET roles listing. */
router.get("/", authMiddleware, async(req, res) => {
    try {
        let roles = await Roles.find({});

        // Get privileges for each role
        const rolesWithPrivileges = await Promise.all(
            roles.map(async(role) => {
                // Get privileges from the rolePrivileges.roles configuration
                const rolePermissions =
                    rolePrivileges.roles[role.role_name.toLowerCase()] || [];

                return {
                    ...role._doc,
                    privileges: rolePermissions,
                };
            })
        );

        res.json(Response.successResponse(rolesWithPrivileges));
    } catch (err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});

// Create new role
router.post("/", authMiddleware, async(req, res) => {
    try {
        const { role_name } = req.body;

        if (!role_name) {
            throw new CustomError(
                Enum.HTTP_CODES.BAD_REQUEST,
                "Validation Error!",
                "role_name field must be filled"
            );
        }

        const existingRole = await Roles.findOne({ role_name });
        if (existingRole) {
            throw new CustomError(
                Enum.HTTP_CODES.BAD_REQUEST,
                "Validation Error!",
                "Role with this name already exists"
            );
        }

        const role = new Roles({
            role_name,
        });

        await role.save();

        res.json(Response.successResponse(role));
    } catch (err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});

// Update role
router.put("/:id", authMiddleware, async(req, res) => {
    try {
        const { role_name } = req.body;
        const { id } = req.params;

        if (!role_name) {
            throw new CustomError(
                Enum.HTTP_CODES.BAD_REQUEST,
                "Validation Error!",
                "role_name field must be filled"
            );
        }

        const existingRole = await Roles.findOne({ role_name, _id: { $ne: id } });
        if (existingRole) {
            throw new CustomError(
                Enum.HTTP_CODES.BAD_REQUEST,
                "Validation Error!",
                "Role with this name already exists"
            );
        }

        const updatedRole = await Roles.findByIdAndUpdate(
            id, { role_name }, { new: true }
        );

        if (!updatedRole) {
            throw new CustomError(
                Enum.HTTP_CODES.NOT_FOUND,
                "Not Found!",
                "Role not found"
            );
        }

        res.json(Response.successResponse(updatedRole));
    } catch (err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});

// Delete role
router.delete("/:id", authMiddleware, async(req, res) => {
    try {
        const { id } = req.params;

        // Check if role is being used by any user
        const userRoles = await UserRoles.findOne({ role_id: id });
        if (userRoles) {
            throw new CustomError(
                Enum.HTTP_CODES.BAD_REQUEST,
                "Validation Error!",
                "Cannot delete role that is assigned to users"
            );
        }

        const deletedRole = await Roles.findByIdAndDelete(id);

        if (!deletedRole) {
            throw new CustomError(
                Enum.HTTP_CODES.NOT_FOUND,
                "Not Found!",
                "Role not found"
            );
        }

        res.json(Response.successResponse({ success: true }));
    } catch (err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});

module.exports = router;
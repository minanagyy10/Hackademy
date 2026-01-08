import { mongoose } from "../../../../src/db/connections.js";
import { systemRoles } from "../../../../src/constants/constants.js";

const adminSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            lowercase: true,
            trim: true,
            unique: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: [true, "Email is already taken"],
            match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        role: {
            type: String,
            default: systemRoles.ADMIN,
            enum: [systemRoles.ADMIN],
        },
    },
    { timestamps: true }
);

export const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

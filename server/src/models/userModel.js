// Stores user account info, authentication details, and favorite songs

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		// User's display name
		name: {
			type: String,
			required: true,
			trim: true,
		},
		// User's email - unique identifier for login
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		// Hashed password for email/password auth (null for OAuth users)
		passwordHash: {
			type: String,
		},
		// User role - determines access level (user or admin)
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
		// Google OAuth ID if user registered with Google
		googleId: {
			type: String,
		},
		// User's profile picture URL
		avatar: {
			type: String,
		},
		// Array of favorite songs user has added
		favorites: [
			{
				id: String,
				title: String,
				artist: String,
				album: String,
				cover: String,
				previewUrl: String,
			}
		],
	},
	// Automatically adds createdAt and updatedAt timestamps
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);


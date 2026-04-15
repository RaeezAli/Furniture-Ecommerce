const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();

exports.resetUserPassword = onRequest(
  { cors: true },
  async (req, res) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      return res.status(204).send("");
    }

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    res.set("Access-Control-Allow-Origin", "*");

    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ error: "Email and newPassword are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    try {
      const user = await admin.auth().getUserByEmail(email);
      await admin.auth().updateUser(user.uid, { password: newPassword });
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Password reset error:", error.code, error.message);

      if (error.code === "auth/user-not-found") {
        // Create the user if they don't exist
        try {
          await admin.auth().createUser({
            email: email,
            password: newPassword,
          });
          return res.status(200).json({ success: true, created: true });
        } catch (createError) {
          console.error("Create user error:", createError.message);
          return res.status(500).json({ error: createError.message });
        }
      }

      return res.status(500).json({ error: error.message });
    }
  }
);

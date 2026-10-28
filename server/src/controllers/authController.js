import jwt from "jsonwebtoken";

// POST /api/auth/login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPass = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;

    if (!adminEmail || !adminPass || !jwtSecret) {
      return res.status(503).json({
        success: false,
        message: "Admin authentication is not configured on the server."
      });
    }

    if (email === adminEmail && password === adminPass) {
      const token = jwt.sign(
        { email, role: "admin" },
        jwtSecret,
        { expiresIn: "7d" }
      );

      return res.json({
        success: true,
        message: "Admin authentication successful",
        token,
        admin: {
          email,
          role: "admin"
        }
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid email or password. Please check your admin credentials."
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error during authentication" });
  }
};

// GET /api/auth/me
export const verifyAdminSession = async (req, res) => {
  res.json({
    success: true,
    admin: req.admin
  });
};

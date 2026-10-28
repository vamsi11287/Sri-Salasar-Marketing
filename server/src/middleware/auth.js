import jwt from "jsonwebtoken";

export const requireAdminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized. Missing admin authentication token." });
  }

  const token = authHeader.split(" ")[1];
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return res.status(503).json({
      success: false,
      message: "Admin authentication is not configured on the server."
    });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired session token. Please log in again." });
  }
};

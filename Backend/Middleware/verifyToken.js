const jwt = require("jsonwebtoken");
const secretKey = "your_secret_key"; // keep this consistent

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // you can now access req.user.id or req.user.email
    next();
  } catch (err) {
    return res.status(400).json({ msg: "Invalid Token" });
  }
};

module.exports = verifyToken;

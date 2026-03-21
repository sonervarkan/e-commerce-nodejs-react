 
import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];


  if (!token) {
    return res.status(403).json({ message: "Missing token." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Reason for Verification Error:", err.message);
      return res.status(403).json({ message: "Invalid token." });
    }
    
    console.log("Token Resolved (Payload):", decoded); 
    
    req.user = decoded;
    next();
  });
};

export default verifyToken;
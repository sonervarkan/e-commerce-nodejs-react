 
export const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    const user = req.user; 

    if (!user) {
      return res.status(401).json({ message: "User information not found." });
    }

    if (user.role === requiredRole) {
      next();
    } else {
      return res.status(403).json({ 
        message: `For this process '${requiredRole}' permission is required.` 
      });
    }
  };
};
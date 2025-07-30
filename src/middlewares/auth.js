const auth = (req, res, next) => {
  const token = "asxyz";
  const isValidToken = token === "xyz";
    console.log("Admin authorized successfully");
  if (isValidToken) next();
  else res.status(401).send("Authorization error");
};

module.exports = { auth };

const validateSignUp = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Enter a valid name");
  } else if (firstName.length < 4 || firstName.length > 20) {
    throw new Error("First name should be 4-20 characters");
  }
};

module.exports = { validateSignUp };

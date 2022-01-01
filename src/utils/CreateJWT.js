import jwt from "jsonwebtoken";

const CreateJWT = (id, role) => {
  const token = jwt.sign(
    {
      id,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
  return token;
};

export default CreateJWT;

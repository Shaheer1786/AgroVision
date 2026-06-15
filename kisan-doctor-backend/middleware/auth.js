import jwt from "jsonwebtoken";

export default function auth(req, res, next) {

  try {

    console.log("AUTH HEADER:");
    console.log(req.headers.authorization);

    const token =
      req.headers.authorization?.split(" ")[1];

    if (!token) {

      return res.status(401).json({
        error: "No token provided"
      });

    }

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    console.log("DECODED TOKEN:");
    console.log(decoded);

    req.user = decoded;

    next();

  } catch (err) {

    console.log("AUTH ERROR:");
    console.log(err);

    return res.status(401).json({
      error: "Invalid token"
    });

  }

}
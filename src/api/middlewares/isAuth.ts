import { expressjwt } from "express-jwt";
import config from "@/config";
import { Request } from "express";

const getTokenFromHeader = (req: Request) => {
  if (
    (req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Token") ||
    (req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer")
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

const isAuth = expressjwt({
  secret: config.jwtSecret,
  algorithms: ["RS256"],
  requestProperty: 'token',
  getToken: getTokenFromHeader
});

export default isAuth;

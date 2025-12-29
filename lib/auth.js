import bcrypt from "bcrypt";
import { verifyToken } from "./jwt";

export async function verifyKey(key, hash) {
  return bcrypt.compare(key, hash);
}

export function getUserFromRequest(req) {
  const auth = req.headers.get("authorization");
  if (!auth) return null;
  const token = auth.replace("Bearer ", "");
  return verifyToken(token);
}

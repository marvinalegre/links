import { randomBytes, scrypt, timingSafeEqual } from "node:crypto"
import { promisify } from "node:util"

const scryptAsync = promisify(scrypt)

export async function hashPassword(password: string) {
  const salt = randomBytes(16)

  const key = (await scryptAsync(password, salt, 64)) as Buffer

  return `${salt.toString("hex")}:${key.toString("hex")}`
}

export async function verifyPassword(password: string, storedHash: string) {
  const [saltHex, keyHex] = storedHash.split(":")

  if (!saltHex || !keyHex) return false

  const salt = Buffer.from(saltHex, "hex")
  const key = Buffer.from(keyHex, "hex")

  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer

  return derivedKey.length === key.length && timingSafeEqual(derivedKey, key)
}

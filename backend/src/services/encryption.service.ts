import crypto from "node:crypto";
import { env } from "../config/env.js";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function getEncryptionKey() {
  const key = Buffer.from(env.ENCRYPTION_KEY, "base64");

  if (key.length !== 32) {
    throw new Error(
      "ENCRYPTION_KEY deve possuir exatamente 32 bytes em Base64.",
    );
  }

  return key;
}

export function encrypt(value: string) {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return [
    iv.toString("base64"),
    authTag.toString("base64"),
    encrypted.toString("base64"),
  ].join(".");
}

export function decrypt(value: string) {
  const key = getEncryptionKey();

  const [ivBase64, authTagBase64, encryptedBase64] = value.split(".");

  if (!ivBase64 || !authTagBase64 || !encryptedBase64) {
    throw new Error("Valor criptografado inválido.");
  }

  const iv = Buffer.from(ivBase64, "base64");
  const authTag = Buffer.from(authTagBase64, "base64");
  const encrypted = Buffer.from(encryptedBase64, "base64");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
const DEV_JWT_SECRET = 'jwtsecretindev';

export function readJwtSecret(): string {
  if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set');
  } else if (!process.env.JWT_SECRET) {
    return DEV_JWT_SECRET;
  }
  return process.env.JWT_SECRET;
}

export const isTrue = (s: string) => {
  const regex = /^\s*(true|1)\s*$/i;
  return regex.test(s);
};

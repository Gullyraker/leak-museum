// GOOD: secrets come from the environment, never from source.
module.exports = {
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
};
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not set (load it from your environment or secret manager)");
}

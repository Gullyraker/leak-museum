// ANTIPATTERN: JWTs signed with HS256 and a trivial, tutorial-grade secret.
const JWT_SECRET = "secret"; // brute-forced offline in seconds by hashcat
module.exports = { alg: "HS256", secret: JWT_SECRET };

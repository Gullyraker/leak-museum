// ANTIPATTERN: secrets hardcoded directly in application source.
module.exports = {
  stripeSecretKey: "sk_test_EXAMPLEonly_not_a_real_key_000",
  githubToken: "ghp_EXAMPLEonlyDEMOtokenDONOTUSE0000000",
  slackBotToken: "xoxb-EXAMPLE-demo-token-not-a-real-slack-token",
  googleMapsApiKey: "AIzaSyEXAMPLE-dummy-demo-key-DO-NOT-USE00",
  db: { host: "db.internal", user: "admin", password: "hunter2" },
};

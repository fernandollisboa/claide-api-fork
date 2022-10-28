const jwt = require("jsonwebtoken");
const { authenticate } = require("ldap-authentication");

export async function login(req, res) {
  const { user_name, password } = req.body;

  let user;
  try {
    user = await authenticate({
      ldapOpts: { url: "ldap://ldap.lsd.ufcg.edu.br" },
      userSearchBase: "cn=" + user_name,
      userDn: "ou=users,dc=lsd,dc=ufcg,dc=edu,dc=br",
      userPassword: password,
      usernameAttribute: "cn",
      username: user_name,
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error,
    });
  }

  return res.status(200).json({
    user: user,
    token: jwt.sign({ id: "user" }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    }),
  });
}

import ldap from "ldapjs";
import jwt from "jsonwebtoken";

export async function login(req, res) {
  const { user_name, password } = req.body;

  const client = ldap.createClient({
    url: "ldap://ldap.lsd.ufcg.edu.br",
  });

  client.on("error", (err) => {
    return res.status(404).json({
      user: user_name,
      error: err,
    });
  });

  const opts = {
    filter: "(uid=" + user_name + ")",
    scope: "sub",
    attributes: ["dn", "sn", "cn"],
    timeLimit: 10,
  };

  var flag = true;
  client.search(process.env.LDAP_SEARCHBASE, opts, (err, resp) => {
    resp.on("searchEntry", (entry) => {
      flag = false;
      client.bind(entry.objectName, password, function (err) {
        if (err) {
          return res.status(403).json({
            user: user_name,
            error: err,
          });
        } else {
          return res.status(200).json({
            user: user_name,
            token: jwt.sign({ id: entry.objectName }, process.env.JWT_SECRET, {
              expiresIn: process.env.JWT_EXPIRATION,
            }),
          });
        }
      });
    });
  });

  setTimeout(() => {
    if (flag) {
      return res.status(403).json({
        user: user_name,
      });
    }
  }, 100);
}

// const jwt = require("jsonwebtoken");
// const ldap = require("ldapjs");

// export async function login(req, res) {
//   const { user_name, password } = req.body;

//   const client = ldap.createClient({
//     url: "ldap://ldap.lsd.ufcg.edu.br",
//   });

//   client.on("error", (err) => {
//     console.log(err);
//   });

//   const opts = {
//     filter: "(uid=" + user_name + ")",
//     scope: "sub",
//     attributes: ["dn", "sn", "cn"],
//   };
//   var searchBase = "ou=users,dc=lsd,dc=ufcg,dc=edu,dc=br";
//   const user = await ldapSearch(client, searchBase, opts, password);

//   // console.log(user);
//   return res.status(200).json({
//     user: user,
//     token: jwt.sign({ id: "user" }, process.env.JWT_SECRET, {
//       expiresIn: process.env.JWT_EXPIRATION,
//     }),
//   });
// }

// function ldapSearch(client, searchBase, opts, password) {
//   client.search(searchBase, opts, (err, res) => {
//     // if (err) {
//     //   console.log(err);
//     // } else {
//     // res.on("searchRequest", () => {});
//     // console.log(res);
//     res.on("searchEntry", (entry) => {
//       // console.log("entry: " + JSON.stringify(entry.object));
//     });
//     res.on("end", (end) => {
//       console.log(end.matchedDN);
//     });
//   });
// }

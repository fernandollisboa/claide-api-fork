import jwt from "jsonwebtoken";
import ldap from "ldapjs";

export async function authenticateUser({ userName, password }) {
  const client = ldap.createClient({
    url: process.env.LDAP_URL,
  });

  client.on("error", (err) => {
    return { err: err, status: 403 };
  });

  const opts = {
    filter: "(uid=" + userName + ")",
    scope: "sub",
    attributes: ["dn", "sn", "cn"],
    timeLimit: 10,
  };
  return new Promise((resolve, reject) => {
    client.search(process.env.LDAP_SEARCHBASE, opts, (err, resp) => {
      let users = [];
      resp.on("searchEntry", (entry) => {
        users.push(entry.object);
        client.bind(entry.objectName, password, function (err) {
          if (err) {
            reject({ err, status: 403 });
          } else {
            const jwToken = jwt.sign({ id: entry.objectName }, process.env.JWT_SECRET, {
              expiresIn: process.env.JWT_EXPIRATION,
            });
            resolve({ userName: userName, jwToken: jwToken });
          }
        });
      });
      resp.on("end", () => {
        if (!users.length) {
          reject({ error: "Not found" });
        }
      });
    });
  });
}

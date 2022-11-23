import jwt from "jsonwebtoken";
import ldap from "ldapjs";

export async function authenticateUser({ username, password }) {
  const client = ldap.createClient({
    url: process.env.LDAP_URL,
  });

  client.on("error", (err) => {
    return { err, status: 403 };
  });

  const opts = {
    filter: "(uid=" + username + ")",
    scope: "sub",
    attributes: ["dn", "sn", "cn"],
    timeLimit: 10,
  };
  const members = await getMembers(client);
  return new Promise((resolve, reject) => {
    if (members.err) {
      reject(members);
    }
    client.search(process.env.LDAP_SEARCHBASE, opts, (err, resp) => {
      let users = [];
      resp.on("searchEntry", (entry) => {
        users.push(entry.object);
        if (members.member.includes(entry.object.dn)) {
          client.bind(entry.objectName, password, function (err) {
            if (err) {
              reject({ err, status: 403 });
            } else {
              const jwToken = jwt.sign({ id: entry.objectName }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRATION,
              });
              resolve({ username, jwToken });
            }
          });
        } else {
          reject({ err: "User unauthorized", status: 401 });
        }
      });
      resp.on("end", () => {
        if (!users.length) {
          reject({ err: "User not found", status: 404 });
        }
      });
    });
  });
}

async function getMembers(client) {
  const opts = {
    scope: "sub",
    attributes: ["member"],
    timeLimit: 10,
  };
  return new Promise((resolve, reject) => {
    client.search(process.env.LDAP_GROUP, opts, (err, resp) => {
      let users = [];
      resp.on("searchEntry", (entry) => {
        users.push(entry.object);
        resolve(entry.object);
      });
      resp.on("end", () => {
        if (!users.length) {
          reject({ err: "Group not found", status: 404 });
        }
      });
    });
  });
}

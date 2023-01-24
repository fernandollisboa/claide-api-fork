import jwt from "jsonwebtoken";
import ldap from "ldapjs";
import BaseError from "../errors/BaseError";
import UserUnauthorizedOrNotFoundError from "../errors/UserUnauthorizedOrNotFoundError";

//TO-DO após testar, refatorar isso aqui tudo !!!
export async function authenticateUser({ username, password }) {
  const client = ldap.createClient({
    url: process.env.LDAP_URL,
  });

  client.on("error", () => {
    return { err: true, status: 403 };
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
      reject(new BaseError("Wasn't possible to load the members list", 400));
    }
    client.search(process.env.LDAP_SEARCHBASE, opts, (err, resp) => {
      const users = [];
      resp.on("searchEntry", (entry) => {
        users.push(entry.object);
        if (members.member.includes(entry.object.dn)) {
          client.bind(entry.objectName, password, function (err) {
            if (err) {
              reject(new BaseError("Invalid Credentials", 403));
            } else {
              const jwToken = jwt.sign({ username: username }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRATION,
              });
              resolve({ username, jwToken });
            }
          });
        } else {
          reject(new UserUnauthorizedOrNotFoundError(username));
        }
      });
      resp.on("end", () => {
        if (!users.length) {
          reject(new UserUnauthorizedOrNotFoundError(username));
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
      const users = [];
      resp.on("searchEntry", (entry) => {
        users.push(entry.object);
        resolve(entry.object);
      });
      resp.on("end", () => {
        if (!users.length) {
          reject(new BaseError("LDAP group not found", 404));
        }
      });
    });
  });
}

export function getUsername(jwtToken) {
  const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);
  return payload.username;
}

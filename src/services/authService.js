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

  const professors = await getMembers(client, process.env.LDAP_PROFESSOR_GROUP);
  const receptionist = await getMembers(client, process.env.LDAP_RECEPTIONIST_GROUP);
  const support = await getMembers(client, process.env.LDAP_SUPPORT_GROUP);

  return new Promise((resolve, reject) => {
    if (professors.err || receptionist.err || support.err) {
      reject(new BaseError("Wasn't possible to load the members list", 400));
    }

    client.search(process.env.LDAP_SEARCHBASE, opts, (err, resp) => {
      const users = [];

      resp.on("searchEntry", (entry) => {
        users.push(entry.object);
        const roles = [];

        if (professors.member.includes(entry.object.dn)) {
          roles.push("professor");
        }
        if (receptionist.member.includes(entry.object.dn)) {
          roles.push("receptionist");
        }
        if (support.member.includes(entry.object.dn)) {
          roles.push("support");
        }

        if (roles.length > 0) {
          client.bind(entry.objectName, password, function (err) {
            if (err) {
              reject(new BaseError("Invalid Credentials", 403));
            } else {
              const jwToken = jwt.sign({ username: username, roles }, process.env.JWT_SECRET, {
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

async function getMembers(client, ldap_group) {
  const opts = {
    scope: "sub",
    attributes: ["member"],
    timeLimit: 10,
  };
  return new Promise((resolve, reject) => {
    client.search(ldap_group, opts, (err, resp) => {
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

import jwt from "jsonwebtoken";
import ldap from "ldapjs";
import BaseError from "../errors/BaseError";
import UserUnauthorizedOrNotFoundError from "../errors/UserUnauthorizedOrNotFoundError";

export async function authenticateUser({ username, password }) {
  // in case of test environment, use mockAuthenticateUser
  if (process.env.NODE_ENV === "test") {
    const { default: mockAuthenticateUser } = await import("../mockLdap/mockAuthenticateUser");
    return mockAuthenticateUser({ username, password });
  }

  const client = ldap.createClient({
    url: process.env.LDAP_URL,
  });

  client.on("error", () => {
    return { err: true, status: 401 };
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
      reject(new BaseError("Wasn't possible to load the members list", 500));
    }

    client.search(process.env.LDAP_SEARCHBASE, opts, (err, resp) => {
      const users = [];

      resp.on("searchEntry", (entry) => {
        users.push(entry.object);
        const roles = [];

        if (professors.member.includes(entry.object.dn)) {
          roles.push("PROFESSOR");
        }
        if (receptionist.member.includes(entry.object.dn)) {
          roles.push("RECEPTIONIST");
        }
        if (support.member.includes(entry.object.dn)) {
          roles.push("SUPPORT");
        }

        if (roles.length > 0) {
          client.bind(entry.objectName, password, function (err) {
            if (err) {
              reject(new BaseError("Invalid Credentials", 401));
            } else {
              const jwToken = jwt.sign({ username, roles }, process.env.JWT_SECRET, {
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
          reject(new BaseError("LDAP group not found", 500));
        }
      });
    });
  });
}

export function getUsername(jwtToken) {
  const { username } = jwt.verify(jwtToken, process.env.JWT_SECRET);
  return username;
}

export function getRole(jwtToken) {
  const { roles } = jwt.verify(jwtToken, process.env.JWT_SECRET);
  return roles;
}

const bcrypt = require('bcryptjs');

// In-memory user store — fine for the demo, not for production.
const users = [];
let nextId = 1;

async function create({ email, password }) {
  // No validation of email format or password strength.
  const hash = await bcrypt.hash(password, 8); // low cost factor
  const user = { id: nextId++, email, password: hash };
  users.push(user);
  return user;
}

function findByEmail(email) {
  // Case-sensitive lookup — "Foo@x.com" and "foo@x.com" are different users.
  for (let i = 0; i < users.length; i++) {
    if (users[i].email == email) {
      return users[i];
    }
  }
  return null;
}

function findById(id) {
  return users.find(u => u.id == id) || null;
}

async function verifyPassword(user, password) {
  return bcrypt.compare(password, user.password);
}

module.exports = { create, findByEmail, findById, verifyPassword, _users: users };

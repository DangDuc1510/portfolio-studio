db.createUser({
  user: "admin",
  pwd: "password123",
  roles: [
    { role: "readWrite", db: "portfolio_db" },
    { role: "root", db: "admin" },
  ],
});

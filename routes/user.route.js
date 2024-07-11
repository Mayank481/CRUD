const router = require("express").Router();
const user = require("../controllers/user.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
const { cache } = require("../middleware/cache");
const {
  validateRegister,
  validateLogin,
  validateUpdate,
} = require("../middleware/datavalidation.middleware");

router.post("/register", validateRegister, user.signUp);
router.post("/login", validateLogin, user.signIn);
router.get("/users/:id", authMiddleware, cache, user.fetchUserById);
router.get("/users", authMiddleware, user.fetchUsers);
router.put("/updateuser/:id", validateUpdate, authMiddleware, user.updateUser);
router.delete("/deleteuser/:id", authMiddleware, user.deleteUser);

module.exports = router;

const userdata = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require("../logger/logger");
const { redisSet } = require("../helpers");

module.exports.signUp = async (req, res) => {
  try {
    const payload = req.body;
    const existingUser = await userdata.findOne({ email: payload.email });
    if (existingUser) {
      return res.status(401).json({ message: "User already exists" });
    }
    const salt = bcrypt.genSaltSync(10);
    payload.password = bcrypt.hashSync(payload.password, salt);
    const user = await userdata(payload).save();
    logger.info("User Register Successfully :)");
    return res.json({
      message: "Account created Successfully",
      user,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "Somthings went worng. Please try again later",
    });
  }
};

module.exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userdata.findOne({ email });
    if (user) {
      if (!bcrypt.compareSync(password, user.password)) {
        logger.error("Error in Password");
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }

      const payload = {
        name: user.name,
        email: user.email,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "365d",
      });

      logger.info("User Login Successfully :)");
      return res.status(200).json({
        message: "Login Successfully",
        access_token: `Bearer ${token}`,
      });
    }
    logger.error("Invalid Credentials");
    return res.status(401).json({
      message: "Invalid credentials",
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "Something wants wrong :(",
    });
  }
};

module.exports.fetchUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const users = await userdata.find().skip(skip).limit(limit);
    if (users) {
      await redisSet(users);
      logger.info("cache User data fetch Successfully");
    }
    const totalCount = await userdata.countDocuments();
    let nextPageUrl = null;
    if (skip + limit < totalCount) {
      const nextPage = page + 1;
      nextPageUrl = `${req.protocol}://${req.get("host")}${
        req.baseUrl
      }?page=${nextPage}&limit=${limit}`;
    }
    logger.info("User's Fetch Successfully :)");
    return res.json({
      message: "Fetch All User's :)",
      data: users,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalUsers: totalCount,
      nextPageUrl: nextPageUrl,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "Something wants wrong :(",
    });
  }
};

module.exports.fetchUserById = async (req, res) => {
  try {
    const user_id = req.params.id;
    const user = await userdata.findById(user_id);
    if (user) {
      await redisSet(user);
      logger.info("cache User data fetch Successfully");
    }
    logger.info("User Data Successfully");
    return res.status(200).json({
      message: "User fetch Successfully :)",
      data: user,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "Something wants wrong :(",
    });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const user_id = req.params.id;
    const update = {
      firstName: req.body?.firstName,
      lastName: req.body?.lastName,
      phoneNumber: req.body?.phoneNumber,
      email: req.body?.email,
      password: req.body?.password,
    };

    const result = await userdata.findByIdAndUpdate(user_id, update, {
      new: true,
    });
    logger.info("User Data Updated Successfully :)");
    res.status(200).json({
      message: "User Information Updated Successfully :)",
      data: result,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: "Something went wrong :(",
    });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const user_id = req.params.id;
    const result = await userdata.findByIdAndDelete(user_id, { new: true });
    logger.info("User Deleted Successfully :(");
    res.status(200).json({
      message: "User Deleted Successfully :(",
      data: result,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "Something went wrong :(",
    });
  }
};

import User from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

const frontendBaseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

const registerUser = async (req, res) => {
  try {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      provider: "local"
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.username,
        email: user.email
      }
    });

  } catch (error) {

    res.status(500).json({message: "Server error", error: error.message});

  }
};

const loginUser = async (req, res) => {
  try {
    
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if(!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    if (!user.password) {
      return res.status(400).json({
        message: "This account uses Google sign-in. Please continue with Google."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const token = generateToken(user._id)
    res.json({
      token,
      user:{
        id: user._id,
        name: user.username,
        email: user.email
      }
    })

  } catch (error) {
    res.status(500).json({message: "Internal Server Error", error: error.message})
  }
}

const googleAuth = async (req, res) => {
  try {
    const user = req.user;
    const token = generateToken(user._id)

    res.redirect(`${frontendBaseUrl}/oauth-success?token=${token}`)

  } catch (error) {
    res.status(500).json({ message: "Google Login Failed" })
  }
}

export { registerUser, loginUser, googleAuth }

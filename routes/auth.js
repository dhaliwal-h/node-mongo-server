const express = require('express')
const bcryptjs = require('bcryptjs')
const User = require('../models/user');
const { default: mongoose } = require('mongoose');
const authRouter = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth')


// Signup Route
authRouter.post('/api/signup', async (req, res) => {
    try {
        console.log(req.body);
        const { name, email, password } = req.body;
        console.log(`passwrod was ${name}`);
        console.log(`passwrod was ${email}`);
        console.log(`passwrod was ${password}`);
        const hash = bcryptjs.hashSync(password, 10)

        const returnedData = await User.findOne({ email });
        if (returnedData) {
            return res.status(400).json({ msg: "user with same email exists" });
        }
        let user = new User({
            name: name,
            email: email,
            password: hash
        }
        )

        user = await user.save();
        return res.json({ user });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: e.message });
    }

})

// SignIn Route
authRouter.post('/api/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "User with email does not exist." })
        }


        const isMatched = await bcryptjs.compare(password, user.password);

        if (!isMatched) {
            return res.status(400).json({ msg: "Incorrect password." });
        }

        const token = jwt.sign({ id: user._id }, "passwordKey");
        return res.status(200).json({ token, ...user._doc });
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

// Token Verification
authRouter.post('/api/token', async (req, res) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) return res.json(false);
        const verified = jwt.verify(token, "passwordKey");

        if (!verified) return res.json(false);

        const user = await User.findById(verified.id);
        if (!user) return res.json(false);
        return res.json(true);
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
})

// Get user data 
authRouter.get('/', auth, async (req, res) => {
    const user = await User.findById(req.userId);
    res.json({ ...user._doc, token: req.token });
})


module.exports = authRouter;
const express = require('express');
const router = express.Router();
const {registerValidation, loginValidation} = require("../auth/validation")
const verify = require("../auth/checkToken")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../modal/user.modal');

router.get('/', verify, function(req, res, next) {
    res.json({ message: 'Chào mừng đến với thư viện Lucid, chúc bạn có một ngày tốt lành với sách!' });
})

router.post('/register', async function(req, res) {
    const{ error } = registerValidation(req.body);

    if (error) return res.status(400).json({ message: error.details[0].message });

    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) return res.status(400).json({ message: "Email này đã được sử dụng" });

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.password, salt);

    const newUser = new User();

    newUser.name = req.body.name;
    newUser.email = req.body.email;
    newUser.password = hashPass;

    try {
        const user = await newUser.save();
        res.status(201).json({
            message: "Đăng ký thành công",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        res.status(400).json({ message: "Lỗi khi đăng ký tài khoản" });
    }
})

router.post('/login', async function(req, res) {
    const { error } = loginValidation(req.body);

    if (error) return res.status(400).json({ message: error.details[0].message });

    const userLogin = await User.findOne({email: req.body.email});
    if (!userLogin) return res.status(400).json({ message: "Sai email hoặc mật khẩu" });

    const passLogin = await bcrypt.compare(req.body.password, userLogin.password);
    if (!passLogin) return res.status(400).json({ message: "Sai email hoặc mật khẩu" });

    const token = jwt.sign({_id: userLogin._id}, process.env.SECRET_TOKEN);
    res.header("auth-token", token).json({
        message: "Đăng nhập thành công",
        token: token,
        user: {
            id: userLogin._id,
            name: userLogin.name,
            email: userLogin.email
        }
    });
})

module.exports = router;
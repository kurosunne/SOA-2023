const { QueryTypes } = require('sequelize');
const database = require('../databases/connection');

const registerUser = async (req, res) => {
    let body = req.body
    
    if (!body.username || !body.password || !body.nama || !body.alamat || !body.telephone){
        return res.status(400).json({
            message: "Data tidak lengkap"
        })
    }

    const checkUsername = await database.query(
        "select * from users where username = :username",
        {
            type: QueryTypes.SELECT,
            replacements: {
                username: body.username
            }
        }
    )
    if (checkUsername.length > 0){
        return res.status(400).json({
            message: "Username sudah ada"
        })
    }

    const result = await database.query(
        "insert into users (username, password, nama, alamat, telephone) values (:username,:password,:nama,:alamat,:telephone)",
        {
            type: QueryTypes.INSERT,
            replacements: {
                username: body.username,
                password: body.password,
                nama: body.nama,
                alamat: body.alamat,
                telephone: body.telephone
            }
        }
    )
    if (result){
        return res.status(200).json({
            message: "Berhasil Register",
        })
    }else{
        return res.status(400).json({
            message: "Gagal Register",
        })
    }
}

const loginUser = async (req, res) => {
    let body = req.body
    const result = await database.query(
        "select * from users where username = :username and password = :password",
        {
            type: QueryTypes.SELECT,
            replacements: {
                username: body.username,
                password: body.password
            }
        }
    )
    if (result.length > 0){
        return res.status(200).json({
            message: "Berhasil Login",
            data: result
        })
    }else{
        return res.status(400).json({
            message: "Gagal Login",
        })
    }
}

const updateUser = async (req, res) => {
    let params = req.params
    let body = req.body

    if (!body.oldpassword || !body.newpassword || !body.nama || !body.alamat || !body.telephone){
        return res.status(400).json({
            message: "Data tidak lengkap"
        })
    }

    const checkUsername = await database.query(
        "select * from users where username = :username",
        {
            type: QueryTypes.SELECT,
            replacements: {
                username: params.username
            }
        }
    )
    if (checkUsername.length == 0){
        return res.status(400).json({
            message: "Username tidak ada"
        })
    }

    if (checkUsername[0].password != body.oldpassword){
        return res.status(400).json({
            message: "Password salah"
        })
    }

    const result = await database.query(
        "update users set password = :password, nama = :nama, alamat = :alamat, telephone = :telephone where username = :username",
        {
            type: QueryTypes.UPDATE,
            replacements: {
                username: params.username,
                password: body.newpassword,
                nama: body.nama,
                alamat: body.alamat,
                telephone: body.telephone
            }
        }
    )
    if (result){
        return res.status(200).json({
            message: "Berhasil Update",
        })
    }else{
        return res.status(400).json({
            message: "Gagal Update",
        })
    }
}

const addFriend = async (req, res) => {
    let body = req.body
    if (!body.username || !body.password || !body.usercari){
        return res.status(400).json({
            message: "Data tidak lengkap"
        })
    }

    if (body.username == body.usercari){
        return res.status(400).json({
            message: "Tidak bisa berteman dengan diri sendiri"
        })
    }

    const checkUser = await database.query(
        "select * from users where username = :username and password = :password",
        {
            type: QueryTypes.SELECT,
            replacements: {
                username: body.username,
                password: body.password
            }
        }
    )
    if (checkUser.length == 0){
        return res.status(400).json({
            message: "Username atau Password salah"
        })
    }

    const checkUserCari = await database.query(
        "select * from users where username = :username",
        {
            type: QueryTypes.SELECT,
            replacements: {
                username: body.usercari
            }
        }
    )
    if (checkUserCari.length == 0){
        return res.status(404).json({
            message: "Username yang dicari tidak ada"
        })
    }

    const checkFriend = await database.query(
        "select * from friends where (username1 = :username1 and username2 = :username2) or (username1 = :username2 and username2 = :username1)",
        {
            type: QueryTypes.SELECT,
            replacements: {
                username1: body.username,
                username2: body.usercari
            }
        }
    )
    if (checkFriend.length > 0){
        return res.status(400).json({
            message: "Sudah berteman"
        })
    }

    const addFriend = await database.query(
        "insert into friends (username1, username2) values (:username1,:username2)",
        {
            type: QueryTypes.INSERT,
            replacements: {
                username1: body.username,
                username2: body.usercari
            }
        }
    )
    if (addFriend){
        return res.status(200).json({
            message: "Berhasil menambahkan teman",
        })
    }else{
        return res.status(400).json({
            message: "Gagal menambahkan teman",
        })
    }
}

const viewFriend = async (req, res) => {
    let params = req.params
    let body = req.body
    if (!body.password){
        return res.status(400).json({
            message: "Data tidak lengkap"
        })
    }

    const checkUser = await database.query(
        "select * from users where username = :username and password = :password",
        {
            type: QueryTypes.SELECT,
            replacements: {
                username: params.username,
                password: body.password
            }
        }
    )
    if (checkUser.length == 0){
        return res.status(400).json({
            message: "Username atau Password salah"
        })
    }

    const viewFriend = await database.query(
        "select u.nama,u.alamat,u.telephone from friends f, users u where (username1 = :username or username2 = :username) and (username1 = u.username or username2 = u.username) and u.username != :username",
        {
            type: QueryTypes.SELECT,
            replacements: {
                username : params.username,
            }
        }
    )
    if (viewFriend){
        return res.status(200).json({
            data: viewFriend
        })
    }else{
        return res.status(400).json({
            message: "Gagal menampilkan teman",
        })
    }
}

const sendMessage = async (req, res) => {
    let body = req.body
    if (!body.username || !body.password || !body.usercari || !body.pesan){
        return res.status(400).json({
            message: "Data tidak lengkap"
        })
    }

    const checkUser = await database.query(
        "select * from users where username = :username and password = :password",
        {
            type: QueryTypes.SELECT,
            replacements: {
                username: body.username,
                password: body.password
            }
        }
    )
    if (checkUser.length == 0){
        return res.status(400).json({
            message: "Username atau Password salah"
        })
    }

    const checkUserCari = await database.query(
        "select * from users where username = :usercari",
        {
            type: QueryTypes.SELECT,
            replacements: {
                usercari: body.usercari
            }
        }
    )
    if (checkUserCari.length == 0){
        return res.status(404).json({
            message: "Username yang dicari tidak ada"
        })
    }

    const checkFriend = await database.query(
        "select * from friends where (username1 = :username and username2 = :usercari) or (username1 = :usercari and username2 = :username)",
        {
            type: QueryTypes.SELECT,
            replacements: {
                username: body.username,
                usercari: body.usercari
            }
        }
    )
    if (checkFriend.length == 0){
        return res.status(404).json({
            message: "Username yang dicari bukan teman"
        })
    }

    const sendMessage = await database.query(
        "insert into messages (sender_username, receiver_username, pesan) values (:sender_username,:receiver_username,:pesan)",
        {
            type: QueryTypes.INSERT,
            replacements: {
                sender_username: body.username,
                receiver_username: body.usercari,
                pesan: body.pesan
            }
        }
    )
    if (sendMessage){
        return res.status(200).json({
            message: "Berhasil mengirim pesan",
        })
    }else{
        return res.status(400).json({
            message: "Gagal mengirim pesan",
        })
    }
}

const viewMessage = async (req, res) => {
    let params = req.params
    let body = req.body

    if (!body.password){
        return res.status(400).json({
            message: "Data tidak lengkap"
        })
    }

    const checkUser = await database.query(
        "select * from users where username = :username and password = :password",
        {
            type: QueryTypes.SELECT,
            replacements: {
                username: params.username,
                password: body.password
            }
        }
    )
    if (checkUser.length == 0){
        return res.status(400).json({
            message: "Username atau Password salah"
        })
    }

    const viewMessage = await database.query(
        "select sender_username as 'from', receiver_username as 'to', pesan as 'message' from messages where sender_username = :username",
        {
            type: QueryTypes.SELECT,
            replacements: {
                username : params.username,
            }
        }
    )
    if (viewMessage){
        return res.status(200).json({
            data: viewMessage
        })
    }else{
        return res.status(400).json({
            message: "Gagal menampilkan pesan",
        })
    }
}

module.exports = {
    registerUser,
    loginUser,
    updateUser,
    addFriend,
    viewFriend,
    sendMessage,
    viewMessage
}
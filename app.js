require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

//config JSON response
app.use(express.json())

//models
const User = require('./models/User')

//open route - public route
app.get('/', (req, res) => {
    res.status(200).json({ msg: 'Bem vindo!' })
})

//private route
app.get('/user/:id', checkToken, async (req, res) => {

    const id = req.params.id

    //check if user exists
    const user = await User.findById(id, '-password')

    if(!user) {
    return res.status(404).json({ msg: 'Usuário não encontrado!' })
    }

    res.status(200).json({user})
})

//check token
function checkToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(!token) {
        return res.status(401).json({msg: 'Acesso negado!'})
    }

    try{

        const secret = process.env.SECRET

        jwt.verify(token, secret)

        next()
    }catch(error){
        res.status(400).json({msg: 'Token Inválido!'})
    }
}

//register user
app.post('/auth/register', async (req, res) => {

    const { name, email, password, confirmpassword } = req.body

    //validations
    if (!name) {
        return res.status(422).json({ msg: 'nome é obrigatório!' })
    }

    if (!email) {
        return res.status(422).json({ msg: 'email é obrigatório!' })
    }

    if (!password) {
        return res.status(422).json({ msg: 'senha é obrigatório!' })
    }

    if (password !== confirmpassword) {
        return res.status(422).json({ msg: 'senhas não conferem' })
    }

    //check if user exists
    const userExists = await User.findOne({ email: email })

    if (userExists) {
        return res.status(422).json({ msg: 'email inválido, por favor ultilize outro...' })
    }

    //create pass
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    //create user
    const user = new User({
        name,
        email,
        password: passwordHash
    })


    try {
        await user.save()
        res.status(201).json({ msg: 'Usuário criado com sucesso!' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Server ERROR, contact your provider...' })
    }

})

//login User
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body

    //validatios
    if (!email) {
        return res.status(422).json({ msg: 'email é obrigatório!' })
    }

    if (!password) {
        return res.status(422).json({ msg: 'senha é obrigatória!' })
    }

    //check if user exist
    const user = await User.findOne({ email: email })

    if (!user) {
        return res.status(404).json({ msg: 'Usuário não encontrado!' })
    }

    //check if password match
    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) {
        return res.status(422).json({ msg: 'Senha inválida!' })
    }

    try {

        const secret = process.env.SECRET

        const token = jwt.sign({
            id: user._id
        },
            secret,
        )

        res.status(200).json({ msg: 'Autenticação realizada com sucesso!', token })

    } catch (err) {
        console.log(error)

        return res.status(500).json({ msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!' })
    }
})

//creditals
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.vdihbff.mongodb.net/?retryWrites=true&w=majority`).then(() => {
    console.log('Conectou ao banco!');
    app.listen(3000);
}).catch((err) => console.log(err));
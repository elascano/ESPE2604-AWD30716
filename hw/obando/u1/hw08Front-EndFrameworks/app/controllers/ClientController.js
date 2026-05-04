const path = require('path')

const viewsPath = path.join(__dirname, '../views/client')

exports.dashboard = (req, res) => {
    res.sendFile(path.join(viewsPath, 'dashboard.html'))
}

exports.login = (req, res) => {
    res.sendFile(path.join(viewsPath, 'auth/login.html'))
}

exports.register = (req, res) => {
    res.sendFile(path.join(viewsPath, 'auth/register.html'))
}

exports.profile = (req, res) => {
    res.sendFile(path.join(viewsPath, 'dashboard.html'))
}

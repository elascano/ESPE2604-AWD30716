const path = require('path')

const viewsPath = path.join(__dirname, '../views/barber')

exports.dashboard = (req, res) => {
    res.sendFile(path.join(viewsPath, 'dashboard.html'))
}

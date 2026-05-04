const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 3000

// Configurar directorio de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')))

// Importar controladores
const InfoController = require('./app/controllers/InfoController')
const ClientController = require('./app/controllers/ClientController')
const OwnerController = require('./app/controllers/OwnerController')
const BarberController = require('./app/controllers/BarberController')

// Rutas de Información Pública
app.get('/', InfoController.index)
app.get('/about', InfoController.about)
app.get('/service', InfoController.service)
app.get('/price', InfoController.price)
app.get('/team', InfoController.team)
app.get('/testimonial', InfoController.testimonial)
app.get('/contact', InfoController.contact)
app.get('/open', InfoController.open)
app.get('/404', InfoController.notFound)

// Rutas de Cliente
app.get('/client/dashboard', ClientController.dashboard)
app.get('/client/login', ClientController.login)
app.get('/client/register', ClientController.register)
app.get('/client/profile', ClientController.profile)

// Rutas de Owner
app.get('/owner/dashboard', OwnerController.dashboard)

// Rutas de Barber
app.get('/barber/dashboard', BarberController.dashboard)

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'app/views/info/404.html'))
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})

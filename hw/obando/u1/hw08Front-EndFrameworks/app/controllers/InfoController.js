const path = require('path');

const viewsPath = path.join(__dirname, '../views/info');

exports.index = (req, res) => {
    res.sendFile(path.join(viewsPath, 'index.html'));
};

exports.about = (req, res) => {
    res.sendFile(path.join(viewsPath, 'about.html'));
};

exports.service = (req, res) => {
    res.sendFile(path.join(viewsPath, 'service.html'));
};

exports.price = (req, res) => {
    res.sendFile(path.join(viewsPath, 'price.html'));
};

exports.team = (req, res) => {
    res.sendFile(path.join(viewsPath, 'team.html'));
};

exports.testimonial = (req, res) => {
    res.sendFile(path.join(viewsPath, 'testimonial.html'));
};

exports.contact = (req, res) => {
    res.sendFile(path.join(viewsPath, 'contact.html'));
};

exports.open = (req, res) => {
    res.sendFile(path.join(viewsPath, 'open.html'));
};

exports.notFound = (req, res) => {
    res.sendFile(path.join(viewsPath, '404.html'));
};
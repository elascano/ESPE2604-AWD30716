const express = require("express");
const router = express.Router();

router.delete(`/${process.env.APP_NAME}/${process.env.ITEM_SINGULAR}/:id`, async (req, res) => {
    try {
        const response = await fetch(`http://${process.env.DB_HOST || 'localhost'}:${process.env.PORT_DB}/db/${process.env.ITEM_SINGULAR}/${req.params.id}`, {
            method: "DELETE"
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

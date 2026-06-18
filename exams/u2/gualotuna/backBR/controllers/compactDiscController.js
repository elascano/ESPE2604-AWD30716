const axios = require("axios");

const ORM_URL = process.env.ORM_URL || "http://localhost:3009";

exports.deleteCompactDisc = async (req, res) => {
    try {
        const { serial } = req.body;
        
        if (serial === undefined || serial === null) {
            return res.status(400).json({ message: "Serial number is required in the request body" });
        }

        const serialNumber = parseInt(serial, 10);
        if (isNaN(serialNumber)) {
            return res.status(400).json({ message: "Invalid serial number format" });
        }

        let cd;
        try {
            const getResponse = await axios.get(`${ORM_URL}/compactdisc/${serialNumber}`);
            cd = getResponse.data;
        } catch (err) {
            if (err.response && err.response.status === 404) {
                return res.status(404).json({ message: "CD not found" });
            }
            throw err;
        }

        if (cd.buyer === true) {
            return res.status(400).json({ message: "CD cannot be deleted because it has a buyer" });
        }

        await axios.delete(`${ORM_URL}/compactdisc/${serialNumber}`);

        res.status(200).json({ message: "CD deleted" });

    } catch (err) {
        if (err.response) {
            return res.status(err.response.status).json(err.response.data);
        }
        res.status(500).json({ message: err.message });
    }
};

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getCompactDiscBySerial = async (req, res) => {
    try {
        const serial = parseInt(req.params.serial, 10);
        if (isNaN(serial)) {
            return res.status(400).json({ message: "Invalid serial number format" });
        }
        const cd = await prisma.compactDisc.findUnique({
            where: { serial: serial }
        });
        if (!cd) {
            return res.status(404).json({ message: "Compact Disc not found" });
        }
        res.json(cd);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteCompactDiscBySerial = async (req, res) => {
    try {
        const serial = parseInt(req.params.serial, 10);
        if (isNaN(serial)) {
            return res.status(400).json({ message: "Invalid serial number format" });
        }

        await prisma.compactDisc.delete({
            where: { serial: serial }
        });

        res.json({ message: "CD deleted" });
    } catch (err) {
        if (err.code === "P2025") {
            return res.status(404).json({ message: "Compact Disc not found" });
        }
        res.status(500).json({ message: err.message });
    }
};

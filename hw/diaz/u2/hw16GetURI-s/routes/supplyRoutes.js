const express = require("express");
const router = express.Router();

router.get("/api/supplies", async (req, res) => {
    try {
        const supabase = req.app.get("supabaseClient");
        
        const { data, error } = await supabase
            .from("supplies")
            .select('id, "supplyName", quantity, "expirationDate", status');

        if (error) {
            return res.status(500).json({ error: "Unable to fetch inventory." });
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// [2] RENDER SUPPLY MANAGEMENT FORM
router.get("/supplies/new", async (req, res) => {
    try {
        // Apuntamos a la subcarpeta interna
        res.render("html/supplyNew");
    } catch (err) {
        res.status(500).json({ error: "Unable to load form." });
    }
});

// [3] RENDER SUPPLY EDIT FORM
router.get("/supplies/:id/edit", async (req, res) => {
    try {
        const supabase = req.app.get("supabaseClient");
        const { id } = req.params;

        const { data, error } = await supabase
            .from("supplies")
            .select("*")
            .eq("id", id)
            .single();

        if (error || !data) {
            return res.status(404).json({ error: "Supply not found." });
        }

        // Apuntamos a la subcarpeta interna mandando el objeto supply
        res.render("html/supplyEdit", { supply: data });
    } catch (err) {
        res.status(500).json({ error: "Unable to load edit form." });
    }
});

module.exports = router;
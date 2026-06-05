const express = require("express");
const router = express.Router();

router.get("/api/payments", async (req, res) => {
    try {
        const supabase = req.app.get("supabaseClient");
        
        const { data, error } = await supabase
            .from("payments")
            .select("*");

        if (error) {
            return res.status(500).json({ error: "Unable to fetch payments." });
        }

        res.render("html/paymentList", { payments: data });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/payments/new", async (req, res) => {
    try {
        res.render("html/paymentNew");
    } catch (err) {
        res.status(500).json({ error: "Unable to load form." });
    }
});

router.get("/payments/:id/edit", async (req, res) => {
    try {
        const supabase = req.app.get("supabaseClient");
        const { id } = req.params;

        const { data, error } = await supabase
            .from("payments")
            .select("*")
            .eq("id", id)
            .single();

        if (error || !data) {
            return res.status(404).json({ error: "Payment not found." });
        }

        res.render("html/paymentEdit", { payment: data });
    } catch (err) {
        res.status(500).json({ error: "Unable to load edit form." });
    }
});

module.exports = router;

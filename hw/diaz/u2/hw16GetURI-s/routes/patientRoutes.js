const express = require("express");

const router = express.Router();

router.get("/api/patients", async (req, res) => {
    try {
        const supabase = req.app.get("supabaseClient");

        const { data, error } = await supabase
            .from("patients")
            .select('patientID, "fullName", phone');

        if (error) {
            return res.status(400).json({ error: "Unable to fetch patients." });
        }

        return res.status(200).json(data);
    } catch (err) {
        return res.status(400).json({ error: "Unable to fetch patients." });
    }
});

router.get("/patients/new", (req, res) => {
    try {
        return res.render("html/patient-form");
    } catch (err) {
        return res.status(500).json({ error: "Unable to load form." });
    }
});

router.get("/patients/:patientId/edit", async (req, res) => {
    const { patientId } = req.params;

    if (!patientId) {
        return res.status(400).json({ error: "Patient ID required." });
    }

    try {
        const supabase = req.app.get("supabaseClient");

        const { data, error } = await supabase
            .from("patients")
            .select("*")
            .eq("patientID", patientId)
            .single();

        if (error && error.code !== "PGRST116") {
            return res.status(500).json({ error: "Unable to load edit form." });
        }

        if (!data) {
            return res.status(404).json({ error: "Patient not found." });
        }

        return res.render("html/patient-edit", { patient: data });
    } catch (err) {
        return res.status(500).json({ error: "Unable to load edit form." });
    }
});

router.post("/api/patients", async (req, res) => {
    try {
        const supabase = req.app.get("supabaseClient");
        const payload = req.body || {};

        if (!payload.patientID) {
            return res.status(400).json({ error: "Patient ID required." });
        }

        const { data, error } = await supabase
            .from("patients")
            .insert([payload])
            .select("*")
            .single();

        if (error) {
            return res.status(500).json({ error: "Unable to create patient." });
        }

        return res.status(201).json(data);
    } catch (err) {
        return res.status(500).json({ error: "Unable to create patient." });
    }
});

router.put("/api/patients/:patientId", async (req, res) => {
    const { patientId } = req.params;

    if (!patientId) {
        return res.status(400).json({ error: "Patient ID required." });
    }

    try {
        const supabase = req.app.get("supabaseClient");
        const payload = req.body || {};

        const { data, error } = await supabase
            .from("patients")
            .update(payload)
            .eq("patientID", patientId)
            .select("*")
            .single();

        if (error && error.code !== "PGRST116") {
            return res.status(500).json({ error: "Unable to update patient." });
        }

        if (!data) {
            return res.status(404).json({ error: "Patient not found." });
        }

        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({ error: "Unable to update patient." });
    }
});

router.delete("/api/patients/:patientId", async (req, res) => {
    const { patientId } = req.params;

    if (!patientId) {
        return res.status(400).json({ error: "Patient ID required." });
    }

    try {
        const supabase = req.app.get("supabaseClient");

        const { data, error } = await supabase
            .from("patients")
            .delete()
            .eq("patientID", patientId)
            .select("patientID");

        if (error) {
            return res.status(500).json({ error: "Unable to delete patient." });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: "Patient not found." });
        }

        return res.status(200).json({ success: true });
    } catch (err) {
        return res.status(500).json({ error: "Unable to delete patient." });
    }
});

module.exports = router;

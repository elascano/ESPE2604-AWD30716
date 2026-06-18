const Notebook = require("../models/insect");

class NotebookController {

    classifyBySize(notebooks) {
        const classified = {
            small: [],
            medium: [],
            large: []
        };

        notebooks.forEach(notebook => {
            const leaves = parseInt(notebook.size_leaves, 10) || 0;
            if (leaves < 80) {
                classified.small.push(notebook);
            } else if (leaves <= 150) {
                classified.medium.push(notebook);
            } else {
                classified.large.push(notebook);
            }
        });

        return classified;
    }

    async getAll(req, res) {
        try {
            const notebooks = await Notebook.find();
            res.json(notebooks);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async getBySize(req, res) {
        try {
            const allNotebooks = await Notebook.find();
            const classified = this.classifyBySize(allNotebooks);
            res.json(classified);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async deleteById(req, res) {
        try {
            const notebookId = Number(req.params.id);
            if (isNaN(notebookId)) {
                return res.status(400).json({ message: "Invalid notebook ID format" });
            }

            const deletedNotebook = await Notebook.findOneAndDelete({ id: notebookId });
            if (deletedNotebook == null) {
                return res.status(404).json({ message: "Notebook not found" });
            }
            res.json({ message: "Notebook deleted successfully", deletedNotebook });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async deleteByCategory(req, res) {
        try {
            const sizeType = req.params.sizeType.toLowerCase();
            if (sizeType !== "small" && sizeType !== "medium" && sizeType !== "large") {
                return res.status(400).json({ message: "Invalid size category. Use small, medium, or large." });
            }

            const allNotebooks = await Notebook.find();

            const classified = this.classifyBySize(allNotebooks);

            const notebooksToDelete = classified[sizeType];

            if (notebooksToDelete.length === 0) {
                return res.status(404).json({ message: `No notebooks found in the '${sizeType}' category.` });
            }

            const idsToDelete = notebooksToDelete.map(notebook => notebook.id);

            await Notebook.deleteMany({ id: { $in: idsToDelete } });

            res.json({
                message: `Notebooks in category '${sizeType}' deleted successfully`,
                count: notebooksToDelete.length,
                deletedNotebooks: notebooksToDelete
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = new NotebookController();

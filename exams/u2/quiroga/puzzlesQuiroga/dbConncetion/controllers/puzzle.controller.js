const Puzzle = require('../models/puzzle');

class PuzzleController {


    static async postPuzzle(req, res) {
        try {
            const puzzle = new Puzzle(req.body);
            await puzzle.save();
            res.status(201).json(puzzle);
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }

    
}

module.exports = PuzzleController;
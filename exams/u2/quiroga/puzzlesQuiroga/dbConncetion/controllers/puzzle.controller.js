const Puzzle = require('../models/Puzzle');

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

    static async healthCheck(req, res){
        res.status(200).json({
            message: "OK"
        });
    }
}


module.exports = PuzzleController;
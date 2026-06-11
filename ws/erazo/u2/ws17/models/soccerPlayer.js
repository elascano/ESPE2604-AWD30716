const mongoose = require("mongoose");

const soccerPlayerSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    club: { type: String, required: true },
    country: { type: String, required: true },
    age: { type: Number },
    goals: { type: Number, default: 0 },
    assist: { type: Number, default: 0 },
    contributions: { type: Number, default: 0 },
  },
  {
    collection: "soccerPlayer",
    timestamps: true,
  }
);

soccerPlayerSchema.pre("save", function calculateContributions(next) {
  this.contributions = (this.goals || 0) + (this.assist || 0);
  next();
});

soccerPlayerSchema.pre("findOneAndUpdate", function calculateUpdateContributions(next) {
  const update = this.getUpdate() || {};
  const data = update.$set || update;

  if (data.goals == null && data.assist == null) {
    next();
    return;
  }

  this.model
    .findOne(this.getQuery())
    .lean()
    .then((player) => {
      const goals = data.goals != null ? Number(data.goals) : player?.goals || 0;
      const assist = data.assist != null ? Number(data.assist) : player?.assist || 0;

      if (update.$set) {
        update.$set.contributions = goals + assist;
      } else {
        update.contributions = goals + assist;
      }

      this.setUpdate(update);
      next();
    })
    .catch(next);
});

module.exports = mongoose.model("SoccerPlayer", soccerPlayerSchema);

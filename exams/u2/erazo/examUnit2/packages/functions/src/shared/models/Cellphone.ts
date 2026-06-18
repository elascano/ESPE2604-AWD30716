import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const cellphoneSchema = new Schema(
  {
    serial_number: { type: String, required: true, unique: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    model: { type: String, required: true, trim: true },
    year_launched: { type: Number, required: true },
    brand: { type: String, required: true, trim: true },
    camera_quality: { type: String, required: true, trim: true }
  },
  {
    collection: "cellphones",
    timestamps: true
  }
);

export type CellphoneDocument = InferSchemaType<typeof cellphoneSchema>;

export const CellphoneModel =
  (models.Cellphone as Model<CellphoneDocument> | undefined) ??
  model<CellphoneDocument>("Cellphone", cellphoneSchema);

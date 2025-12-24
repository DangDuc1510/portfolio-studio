import mongoose, { Schema, Model, Document } from "mongoose";

export type EquipmentType = "camera" | "lens" | "drone" | "gimbal" | "other";

export interface IEquipment extends Document {
  name: string;
  type: EquipmentType;
  createdAt?: Date;
  updatedAt?: Date;
}

const EquipmentSchema = new Schema<IEquipment>(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["camera", "lens", "drone", "gimbal", "other"],
      required: true,
    },
  },
  { timestamps: true }
);

const Equipment: Model<IEquipment> =
  mongoose.models.Equipment ||
  mongoose.model<IEquipment>("Equipment", EquipmentSchema);

export default Equipment;


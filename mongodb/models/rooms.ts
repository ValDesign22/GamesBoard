import {Schema, model, models} from "mongoose";

export default models.rooms || model("rooms", new Schema({
    id: { type: String, required: true }, // The id of the room
    name: { type: String, required: true }, // The name of the room
    owner: { type: String, required: true }, // The owner of the room
    users: { type: [String], required: false }, // The users in the room
    private: { type: Boolean, required: true }, // If the room is private or not
    password: { type: String, required: false }, // The password to join the room, only if the room is private
    roomType: { type: String, required: true }, // Game type: "Monopoly"
}));
import mongoose from "mongoose";

const collection = 'users';

const schema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true,
  },
  age: Number,
  password: String,
  role: {
    type: String,
    default: 'usuario'
  },
  loggedBy: String,
  documents: [{
    name: String,
    reference: String,
  }], // Array de documentos
  last_connection: Date, // Propiedad para la última conexión
});

const userModel = mongoose.model(collection, schema);

export default userModel;

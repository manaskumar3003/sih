import mongoose, { Model, Schema } from "mongoose";

interface IUser {
  name: string;
  username: string;
  email:string;
  password: string;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email:{
    type:String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
});

const User: Model<IUser> = mongoose.models.user || mongoose.model('user', userSchema);

export default User;
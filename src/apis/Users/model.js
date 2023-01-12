import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, required: true, min: 3, max: 20, unique: true },
    email: { type: String, required: true, max: 50, unique: true },
    password: { type: String, required: true, min: 6 },
    profilePicture: { type: String, default: "" },
    coverPicture: { type: String, default: "" },
    followers: { type: Array, default: [] },
    followings: { type: Array, default: [] },
    isAdmin: { type: Boolean, default: false },
    desc: { type: String, max: 50 },
    city: { type: String, max: 50 },
    from: { type: String, max: 50 },
    relationship: { type: Number, enum: [1, 2, 3] },
  },
  { timestamps: true }
);

// before saving to data base hash the password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 11);
  }
  next();
});

// compare password with hashed password
userSchema.static("checkCredentials", async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      return user;
    } else {
      return null;
    }
  }
  return null;
});

// exclude password and __v from the response
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

export default model("User", userSchema);

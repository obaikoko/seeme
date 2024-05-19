import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      publicId: {
        type: String,
        default: '',
      },
      url: {
        type: String,
        default:
          'https://res.cloudinary.com/dzajrh9z7/image/upload/v1716123883/SeeMe/omgwiw9mcp0e91lanaic.jpg',
      },
    },
    password: {
      type: String,
      required: true,
    },
    resetNumber: {
      type: String,
    },
    resetNumberExpires: {
      type: Date,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
const User = mongoose.model('User', userSchema);

export default User;

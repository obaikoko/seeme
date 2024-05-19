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
          'https://res.cloudinary.com/duz7maquu/image/upload/v1716037111/SeeMe/Ellipse_6_mkpxi8.png',
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

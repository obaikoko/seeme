import asyncHandler from 'express-async-handler';
import User from '../model/userModel.js';
import FriendRequest from '../model/friendModel.js';

// @desc Send Friend Request
// @route POST api/friends/add
// @access Private
const addFriend = asyncHandler(async (req, res) => {
  const { recipient } = req.body;
  const sender = req.user._id;

  // Check if request already exist
  const requestExist = await FriendRequest.findOne({
    sender: sender,
    recipient,
  });
  if (requestExist) {
    res.status(400);
    throw new Error('Request already sent');
  }

  const friendRequest = await FriendRequest.create({
    sender,
    recipient,
    status: 'pending',
  });

  if (friendRequest) {
    res.status(200);
    res.json(friendRequest);
  } else {
    res.status(500);
    throw new Error(' Request was not sent');
  }
});

// @desc updates  Friend status
// @route PUT api/friends/
// @access Private

const updateFriendStatus = asyncHandler(async (req, res) => {
  const { sender, status } = req.body;

  try {
    const user = await User.findById(req.user._id);
    const updatSender = await User.findById(sender);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const request = await FriendRequest.findOne({ sender }).populate(
      'sender',
      'username'
    );
    if (!request) {
      res.status(404);
      throw new Error('Request not found');
    }

    request.status = status || request.status;
    const savedRequest = await request.save();

    switch (savedRequest.status) {
      case 'accepted':
        const isFriend = user.friends.includes(sender);
        if (isFriend) {
          res.status(200).json('Request already accepted');
        } else {
          user.friends.push(sender);
          updatSender.friends.push(req.user._id);
          await updatSender.save();
          const acceptedFriend = await user.save();
          res.status(200).json(acceptedFriend);
        }
        break;

      case 'rejected':
        await FriendRequest.findOneAndDelete({ sender });
        user.friends.pull(sender);
        updatSender.friends.pull(req.user._id);
        await updatSender.save();
        const rejectedFriend = await user.save();
        res.status(200).json(rejectedFriend);
        break;

      case 'pending':
        updatSender.friends.pull(req.user._id);
        await updatSender.save();
        user.friends.pull(sender);
        const pendingFriend = await user.save();
        res.status(200).json(pendingFriend);
        break;

      default:
        res.status(400).json({ message: 'Invalid status' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { addFriend, updateFriendStatus };

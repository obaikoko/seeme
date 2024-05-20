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
  const user = await User.findById(req.user._id);
  const request = await FriendRequest.findOne({ sender }).populate(
    'sender',
    'username'
  );
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }
  request.status = status || request.status;
  const savedRequest = await request.save();

  if (savedRequest.status === 'accepted') {
    const requestAccepted = user.friends.find(
      (friend) => friend.toString() === sender
    );
    if (requestAccepted) {
      res.status(200);
      res.json('Request already accepted');
    } else {
      user.friends = [...user.friends, sender];
      const acceptedFriend = await user.save();
      res.status(200);
      res.json(acceptedFriend);
    }
  } else if (savedRequest.status === 'rejected') {
    await FriendRequest.findOneAndDelete({ sender });

    user.friends.pull(sender);
    const rejectedFriend = await user.save();
    res.status(200);
    res.json(rejectedFriend);
  } else if (savedRequest.status === 'pending') {
    user.friends.pull(sender);
    const pendFriend = await user.save();
    res.status(200);
    res.json(pendFriend);
  }
});

const getUserFriends = asyncHandler(async (req, res) => {
  const friends = await FriendRequest.find({ recipient: req.user._id });
  if (friends) {
    res.status(200);
    res.json(friends);
  } else {
    res.status(200);
    res.json('No friends yet');
  }
});

export { addFriend, updateFriendStatus, getUserFriends };

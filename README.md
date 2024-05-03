*INTRODUCTION*

SeeMe is a lightweight social app that allows face-to-face communication amongst friends through audio and video means, that gets one talking in seconds. 
Due to lack of spontaneity of real time connection, often disruption on text and calls workflow, and scheduling of traditional video calls in existing
social media interaction, SeeMe walkie-talkie app will help users connect with close friends of their choice and give a smooth flow connections and also maintaining 
the users privacySCOPE: This develops user-friendly web application inspired by TenTen, but with a video chat functionality. SeeMe-walkie-talkie app will allow close 
friends to connect for quick face-to-face interactions without storing videos and audio.

*FUNCTIONALITIES*:
- Compatibility - connect with friends with any device you get in touch with.
- Low Memory Footprint - your videos and audio are not stored, so memory usage is low.
- In chat features.
- Real time communication.
- Voice option
- Call mode - for longer communication.
- Voice option.
- Call Mode - for longer communication.
- Privacy - your audio and video are not stored. We prioritize your privacy.
- Friend Management - manage a list of close friends providing more secure connection.
- Quick reaction (emojis').
- Customization notification
- Group calls.

*Getting Started*;
Let's get know more about the project structure and the specifics of each. So the folder structure for this project follows the MVC (Model-View-Controller)
pattern with some added customizations.

*Model*-This describes the schema (data model) of the entities that make up the project. In this case our models include:
- chat
- friend request
- user
The model gives us a clear picture of how entities will be stored in the database. It tells us the data-type of a particular field.

*View* - This describes the appearance of the complete application our user interact with (This section is handled by the front-end developers).

*Controller* - This is where the business logic takes place.

*Config* - This folder holds configuration files that our project depends on.

*Env-samples* - This file holds data that should be private. Data like:
  -token secrets
  -database password
  -database connection string
  -session secrets

*Utils* - This is a folder that holds custom user helper libraries that is used during the project. They are written to facilitate some task. In this project, our helper
library is the generateToken function as the name implies, htis function helps us to generate a token based on the argument passed to it.

*Package.json, **Package.lock.json* - A project would be incomplete without a package manager. The package.json holds metadat about our project. Metadata like our project entry
file, project version number, installed dependencies, author (the creator of the project) etc. The package.lock.json on the other end holds a complete hierarchy of our
dependency tree including their specific version number. Both files help us to achieve consistent project environment when other developers contirbute to our project.
Server.js - This is the project enrty file. This is the file that is run to start up the application.

*Routes* - This folder holds the files that in some way describes the features of our application. Various user interaction with our application are routed to these files.
The route to a specific file are determined by some parameters.

*Middlewares* - just as the name implies, the folder contain files that are executed before a specific route to a file is hit. The files an be used to implement different
functionality. Authentication is integrated using this approach.

I hope we were able to get you started.
let's take you from Getting Started to communicating with friends - SeeMe.

# Project Name

SeeMe

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Getting Started](#getting-started)

## Introduction

SeeMe is a lightweight social app that allows for face-to-face communication amongst friends through audio and video means, you get talking in seconds. Due to lack of spontaneity of real time connection, often disruption on text and calls workflow, and scheduling of traditional video calls in existing
social media interaction, SeeMe walkie-talkie app will help users connect with close friends of their choice and give a smooth flow connections and also maintaining 
the users privacySCOPE: This develops user-friendly web application inspired by TenTen, but with a video chat functionality. SeeMe-walkie-talkie app will allow close 
friends to connect for quick face-to-face interactions without storing videos and audio.

## Features

SeeMe provide the following functionalites:

- compatibility - connect with friends with any device you get in touch with.
- low memory footprint - your videos and audio are not stored, so memory usage is low.
- in chat features
- real-time communication
- voice option
- call mode - for longer conversatioin.
- privacy - your audio and video are not stored. We prioritize your privacy.
- friend management - manage a list of close friends providing more secure connection.

### Future features

- group calls
- quick reaction (emojis)
- customization notification

## Getting Started

Let's get to know more about the project structure and the specifics of each. So the folder structure for this project follows the MVC (Model-View-Controller) pattern with some added customizations.

Model - This describes the schema(data model) of the entities that make up the project, in this case our models include:

- chat
- friendRequest
- user

The model gives us a clear picture of how our entities will be stored in the database, it tells us the data-type of a particular field.

View - This describes the apperance of the complete application our user interact with (This is the section the front-end developer handles).

Controller - This is where the business logic takes place.

Config - This folder holds configuration files that our project depends on.

Env-samples - This file holds data that should be private. Data like:

- token secrets
- database password
- database connection string
- session secrets

Utils - This is a folder that holds custom user helper libraries that is used during the project. They are written to facilitate some task. In this project our helper library is the generateToken function, as the name implies, this function helps us to generate a token based on the argument passed to it.

Package.json, Package.lock.json - a project would be incomplete without a package manager. The package.json holds metadata about our project. Metadata like our project entry file, project version number, installed dependencies, author(the creator of the project) etc. The package.lock.json on the other end holds a complete hierarchy of our dependency tree including their specific version number. Both files help us to achieve consistent project environment when other developers contribute to our project.

Server.js - This is the project entry file. This is the file that is run to start up the application.

Routes - This folder holds the files that in some way describes the features of our application have. Various user interaction with our application our routed to these files. The route to a specific file are determined by some parameters.

Middlewares - The name give it out. This folder contain files that are executed before a specific route to a file is hit. The files can be used to implement different functionality. Authentication are integrated using this approach.

I hope we were able to get you started.

Let's take you from Getting Started to communicating with friends - SeeMe.











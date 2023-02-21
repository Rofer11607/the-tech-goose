# Nrwl-Blaze (NX Firebase CLI)

The nrwl-blaze is a command-line interface that integrates Nx (the mono repo provider) with Firebase. It provides four methods to streamline your workflow:

- create - creates a project with Nx. You can choose to create a project for Firebase Functions or Front End. For Front End projects, you can use supported generators like @nrwl/react and @nrwl/angular, while for Firebase Functions, the supported generators are @nrwl/node and @nrwl/nest. If you have other generators in mind, please email the author with details on how to add them. The create method also includes an option to generate a Firebase Hosting target and automatically links it to the project. This feature works in tandem with the deploy method, which allows you to deploy your project straight from the CLI.
- deploy - enables you to deploy any project set up with Nx-Firebase.
- register - currently under construction, this method allows you to set up a project that has not been created with Nx-Firebase and use it as if it was created with the library.
- delete - this method lets you select multiple projects for deletion. If a project was created with Nx-Firebase, it will also remove it from your firebase.json and firebaserc.


### Installation
** Note ** The firebase CLI is required for this cli to work. If you do not have it installed, please install it first.
you can find how to do that [here](https://firebase.google.com/docs/cli)

```
npm install -g nrwl-blaze

``

### Usage
from within  your Nx workspace, run the following command:

```
nrwl-blaze

```
then just follow the prompts

### Note
This is a work in progress. If you have any suggestions or issues, please email the me


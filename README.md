# GitHub Issue Tracker

## Build instructions
- Configure organization and repo names in ```src/config.json```. An example repo is already provided.
- Install dependencies: ```npm install```
- Build app: ```npm run build:production```
- Start local server: ```npm run serve``` and access the app on ```localhost:8080```

## Considerations
- Since this is a front-end oriented project, there is no server implementation: the App talks directly to the GitHub API. This means that it can only work with public organizations, repositories and members.
- Since it's a small project, I focused on implementing as much functionality as possible in vanilla JS.
- I've implemented a basic version of a finite state machine to keep app state and execute side effects in an organized way.
- Another benefit of the usage of a finite state machine is application logic visualization. An interactive visualization of the app behavior can be visualized on the [following link](https://xstate.js.org/viz/?gist=8badce66ad9469373b7f21dc23380ee4).
- DOM manipulation was performed imperatively since it was a small project and I wanted to use Nunjucks and as few libraries as possible, but for larger projects I think that this is a tech stack that may not scale well.
- Layout animations are implemented in a performant way using the [FLIP technique](https://css-tricks.com/animating-layouts-with-the-flip-technique/).
- The score calculation can easily be customized by modifying a single function definition: ```src/js/services/calculateScore.js```.
- I assumed that an issue without a priority label would have a Low Priority, and an issue with more than one will have the higher priority assigned.
- Although much of the variants weren't used, I left the design system outlined at the start of the project in ```src/scss/global/_variables.scss```
- When building for production, a bundle analysis is performed automatically.

## Possible enhancements
Due to time restrictions, there were some features that I planned that I could not implement. In particular, I think that two helpful features missing are:
- Alerts or toast messages indicating unexistent users passed in the query string.
- Alerts or toast messages giving more info about errors.

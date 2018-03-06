# Very opinionated workflow

**for static HTML/SASS/JS projects**

This project is meant to simplify the repetitive process of creating static web projects. It's based on subjective choice of tools and frameworks (gulp, bootstrap, html5 boilerplate, sass etc.). Cut down to bare essentials.

##How to:

**Pro tip:** clone repo to a folder with a name of your choice:  
`git clone https://github.com/jakub-c/very_opinionated_workflow.git your-folder-name`

Run `remove-git.js` to remove git files connected to this repo, feel free to delete `remove-git.js` afterwards.

`npm start` - starts dev mode

`npm run build` - moves files to `build/` folder, minifies code, optimizes images

Images should be kept in `source/img` folder

Styleguide provided by ESLint and eslint-config-airnbnb, eslint-config-prettier presets

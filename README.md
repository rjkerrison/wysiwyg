# draft-wysiwyg
A wysiwyg editor that mimics medium, build on top of https://github.com/facebook/draft-js and https://github.com/draft-js-plugins/draft-js-plugins. All the relevant behaviour comes from plugins, so this may serve as an example of using the plugin architecture and the different plugins. You can also install and use draft-wysiwyg right away.

## Demo
https://textio-editor.herokuapp.com/

## Features
- Copy-Paste Functionality
- Inline toolbar for text
- Block drag/drop
- Block toolbars
- Block keydown handling to remove blocks (backspace) or move cursor to next/previous block
- Bold, H1, H2, UL, LI
- Blocks copying of undesirable things like tables, images, etc

## Needs Work
- Allows multiple empty blocks
- It's hard to end a list in an intuitive way

## Installation
```
npm install draft-wysiwyg
```
or
```
sudo npm install draft-wysiwyg
```

## Usage
```
npm install
npm start
```
    
Then open [localhost:3030](http://localhost:3030)

## Contributing
Pull requests are very welcome, feel free to commit your ideas!

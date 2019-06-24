const fs = require('fs');
const path = require('path');
const reactDocs = require('react-docgen');
const ReactDocGenMarkdownRenderer = require('react-docgen-markdown-renderer');

// The React components to load
const componentFolder = './src/components/';
const componentPath = path.join(__dirname, 'components/');
// Where the JSON file ends up
const componentJsonPath = './docs/components.json';
const documentationPath = './docs';

const componentDataArray = [];
const renderer = new ReactDocGenMarkdownRenderer(/* constructor options object */);

function pushComponent(component) {
  componentDataArray.push(component);
}
function createComponentFile() {
  const componentJsonArray = JSON.stringify(componentDataArray, null, 2);
  fs.writeFile(componentJsonPath, componentJsonArray, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    console.log('Created component file');
  });
}
/**
 * Use React-Docgen to parse the loaded component
 * into JS object of props, comments
 *
 * @param {File} component
 * @param {String} filename
 */
function parseComponent(component, filename) {
  const componentInfo = reactDocs.parse(component);
  const splitIndex = filename.indexOf('/src/');
  const shortname = filename.substring(splitIndex + 4);
  const documentationPath =
    path.basename(componentPath, path.extname(componentPath)) +
    shortname +
    renderer.extension;
  const componentName =
    shortname.split('/')[2].split('.')[0] + renderer.extension;
  componentInfo.filename = shortname;
  fs.appendFileSync(
    './docs/index.md',
    `
(${componentName})[https://nusantech-react.github.io/kapalapi-ui/components/${componentName}]\n\n
`
  );
  fs.writeFile(
    `./docs/components/${componentName}`,
    renderer.render(
      /* The path to the component, used for linking to the file. */
      filename,
      /* The actual react-docgen AST */
      component,
      /* Array of component ASTs that this component composes*/
      []
    ),
    () => {}
  );
  pushComponent(componentInfo);
}
/**
 * Loads a component file, then runs parsing callback
 * @param {String} file
 * @param {Promise} resolve
 */
function loadComponent(file, resolve) {
  fs.readFile(file, (err, data) => {
    if (err) {
      throw err;
    }
    // Parse the component into JS object
    resolve(parseComponent(data, file));
  });
}
/**
 * Explores recursively a directory and returns all the filepaths and folderpaths in the callback.
 *
 * @see http://stackoverflow.com/a/5827895/4241030
 * @param {String} dir
 * @param {Function} done
 */
function filewalker(dir, done) {
  let results = [];
  const dira = fs.readdirSync(dir);
  const mainTemplate = `
# KapalApi Project's UI

## Docs

(Read Here)[https://github.com/nusantech-react/kapalapi-ui/blob/master/readme.md]
  
## Components\n
`;
  fs.writeFileSync('./docs/index.md', mainTemplate);
  fs.readdir(dir, async (err, list) => {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(file => {
      file = path.resolve(dir, file);
      fs.stat(file, async (err, stat) => {
        // If directory, execute a recursive call
        if (stat && stat.isDirectory()) {
          filewalker(file, (err, res) => {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          // Check if is a Javascript file
          // And not a story or test
          if (
            file.endsWith('.js') &&
            !file.endsWith('.story.js') &&
            !file.endsWith('.test.js')
          ) {
            await new Promise(resolve => {
              loadComponent(file, resolve);
            });
            await results.push(file);
          }
          if (!--pending) done(null, results);
        }
      });
    });
  });
}
filewalker(componentFolder, (err, data) => {
  if (err) {
    throw err;
  }
  createComponentFile();
});

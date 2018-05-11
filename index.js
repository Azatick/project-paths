const root = require('app-root-path'),
    path = require('path'),
    fs = require('fs');

class ProjectPaths {

    constructor () {
        // config object
        this.config = this.__getConfig('project.paths.json');
        // paths object for optimizations
        this.paths = {};
    }

    /**
     * Return config file
     * @param configFileName
     * @returns Object
     * @private
     */
    __getConfig (configFileName) {
        let file = fs.readFileSync(path.resolve(root.toString(), configFileName));
        return JSON.parse(file);
    }

    __resolveMasks (p, mustaches, calcPaths) {
        if (mustaches.length > 1) throw new Error(`In path for alias "${p}" founded more than 1 masks: ${calcPaths}`);
        else {
            let mustacheStart = calcPaths.replace(/^\//g, '').match(/^{.+?}/g);
            // path starts from mustache?
            if (mustacheStart == null) throw new Error(`Path for alias "${p}" founded 1 mask which don't stay in start of path: ${calcPaths}`);
            else {
                let p = mustacheStart[0].replace(/[{}]/g, '');
                return this.getA(p, calcPaths.replace(/{.+}/g, ''));
            }
        }
    }

    /**
     * Return absolute path by alias
     * @param p Alias for path in project.paths file
     */
    getA (p) {
        if (arguments.length == 1) {
            if (['root', '/'].includes(p)) return root.toString();
            if (this.config[p] == null) throw new Error(`Path for alias "${p}" not defined in project.paths.json`);
            let calcPaths = this.config[p];
            // check the path to mustache masks
            let mustaches = calcPaths.match(/{.+?}/g);
            if (mustaches) {
                calcPaths = this.__resolveMasks(p, mustaches, calcPaths);
            }
            this.paths[p] = path.resolve(this.root(), calcPaths);
            return this.paths[p];
        } else if (arguments.length > 1) {
            let calcPath = this.getA(p);
            let paths = [calcPath, ...[].slice.call(arguments, 1)];
            return path.resolve(`${paths.join('/')}`);
        } else throw new Error(`Alias is undefined`);
    }

    /**
     * Return path relatively of current working directory
     * @param p
     */
    get(p) {
        return `./${path.relative(process.cwd(), this.getA(...arguments))}`;
    }

    /**
     * Return path to root of the project
     * @returns string
     */
    root () {
        return root.toString();
    }

}

module.exports = new ProjectPaths();
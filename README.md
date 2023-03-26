# // put logo here //

Application for compiling scouting data collected using the [VictiScout](https://github.com/frc1418/VictiScout/releases) Application. Written using [Electron](http://electron.atom.io/) for easy customization.

// put release here //

## Development Dependencies
* [Node.js](https://nodejs.org)
* [npm](https://npmjs.com)
* [CSV](https://csv.js.org)

## Development Installation
1. `cd` into `VictiScout` directory.
2. Run `npm install` to install node dependencies.
3. Run `npm install csv-parser` to install node's csv-parser.

## Usage in Development
While in `VictiScout` directory, run

    npm start

## Packaging
While in `VictiScout` directory, run

    npm run-script package-mac
    npm run-script package-win
    npm run-script package-linux

Choose the suffix appropriate for your target OS.

See [here](https://github.com/electron-userland/electron-packager#readme) for an explanation of how to modify your packaging settings.

## Authors
This software was created by [David O'Regan](https://github.com/Git-HorizonZz) for [Team 1418](https://github.com/frc1418). See [Contributors](https://github.com/Git-HorizonZz/VictiScout-Compiler/graphs/contributors) for further information.

## License
VictiScout is available under the [MIT License](LICENSE).

# DossierEtu

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

First, you have to install Node.js and Npm -> https://nodejs.org/en/

### Installing

To install all the dependencies please run while beeing in the project folder :

```
npm install
```

You are now ready to dev !

## Deployment

To live deploy the extension, you will need two terminal windows.
In the first one, run :

```
npm start
```

It will launch a firefox instance with the last builded extension. It will also reload it each time you run in the second window terminal :

```
npm run build
```

## Built With

* [Web extension](https://developer.mozilla.org/en-US/Add-ons/WebExtensions) - The web extension standard
* [NPM](https://www.npmjs.com/) - Dependency Management
* [Webpack](https://webpack.js.org/) - Used to bundle extension's file

## Authors

* **Florent PERGOUD** - _Initial work_ - [Flopshoubox](https://github.com/flopshoubox)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

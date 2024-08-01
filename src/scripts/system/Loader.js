export class Loader {
  constructor(loader, config) {
    this.loader = loader;
    this.config = config;
    this.resources = {};
  }
  preload() {
    for (const asset of this.config.loader) {
      let key = asset.key.substr(asset.key.lastIndexOf('/') + 1);
      key = key.substring(0, key.indexOf('.'));
      if (asset.key.indexOf(".png") || asset.key.indexOf(".jpg")) {
        this.loader.add(key, asset.data.default)
      }
    }
    return new Promise(resolve => {
      this.loader.load((_, resources) => {
        this.resources = resources;
        resolve()
      })
    });
  }
}

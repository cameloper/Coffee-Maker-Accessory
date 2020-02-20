var Service, Characteristic;
const gpio = require('rpi-gpio');

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-coffee-maker-accessory", "CoffeeMaker", CoffeeMaker);
};

function CoffeeMaker(log, config) {
    this.log = log;
    this.mode = config["mode"];
    this.pin = config["pin"];
    this.name = config["name"];
  
    gpio.setMode(this.mode);
    gpio.setup(this.pin, gpio.DIR_OUT);
  
    let informationService = new Service.AccessoryInformation();
    informationService.setCharacteristic(Characteristic.Manufacturer, 'cameloper Electronics')
         .setCharacteristic(Characteristic.Model, 'Coffee Maker')
         .setCharacteristic(Characteristic.SerialNumber, '447-269-449');
  
    this.lightService = new Service.Switch;
    this.lightService
      .getCharacteristic(Characteristic.On)
        .on('get', this.getLightbulbOnCharacteristic.bind(this))
        .on('set', this.setLightbulbOnCharacteristic.bind(this));
    this.informationService = informationService;
  }

  CoffeeMaker.prototype = {
    getServices: function () {
        return [this.informationService, this.lightService];
      },

      getLightbulbOnCharacteristic: function (next) {
          gpio.read(this.pin, function(err, value) {
            return next(err, value);
          })
      },

      setLightbulbOnCharacteristic: function (on, next) {
        if(on) {
          gpio.write(this.pin, 1, function(err) {
            next(err);
          });
        } else {
          gpio.write(this.pin, 0, function(err) {
            next(err);
          });
        }
      }
}

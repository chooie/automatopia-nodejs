(function() {
  "use strict";

  var assert = require("_assert");
  var chrome = require("selenium-webdriver/chrome");

  var http = require("http");
  var runServer = require("./_run_server.js");
  var webdriver = require('selenium-webdriver');

  var HOME_PAGE_URL = "http://localhost:5000";
  var EXPECTED_BROWSER = "firefox 58.0.2";

  describe("Smoke test", function() {
    this.timeout(30 * 1000);

    var serverProcess;
    var driver;

    before(function (done) {
      runServer.runProgrammatically(function(process) {
        serverProcess = process;

        driver = createDriver();
        driver.getCapabilities().then(function(capabilities) {
          var version =
              capabilities.get("browserName") + " " +
              capabilities.get("browserVersion");
          if (version !== EXPECTED_BROWSER) {
            console.log("Warning: Smoke test browser expected " +
                        EXPECTED_BROWSER + ", but was " + version);
          }
          done();
        });
      });
    });

    after(function(done) {
      serverProcess.on("exit", function(code, signal) {
        driver.quit().then(done);
      });
      serverProcess.kill();
    });

    it("can get home page", function(done) {
      httpGet(HOME_PAGE_URL, function(response, receivedData) {
        var marker = "App home page";
        var foundHomePage =
            receivedData.indexOf(marker) !== -1;

        assert.equal(
          foundHomePage,
          true,
          `home page should have contained test marker '${marker}'`
        );
        done();
      });
    });
  });

  function createDriver() {
    require("chromedriver");
    const options = new chrome.Options();
    options.addArguments('headless');

    return new webdriver.Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
  }

  function httpGet(url, callback) {
    var request = http.get(url);
    request.on("response", function(response) {
      var receivedData = "";
      response.setEncoding("utf8");

      response.on("data", function(chunk) {
        receivedData += chunk;
      });
      response.on("end", function() {
        callback(response, receivedData);
      });
    });
  }

}());

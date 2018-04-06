(function() {
  "use strict";

  const assert = require("_assert");
  const chrome = require("selenium-webdriver/chrome");
  const http = require("http");
  const webdriver = require('selenium-webdriver');

  const By = webdriver.By;

  const config = require("./shared/config.js");
  const runServer = require("./_run_server.js");

  const HOME_PAGE_URL = `http://localhost:${config.defaultPort}`;
  const EXPECTED_BROWSER = "chrome";

  describe("Smoke test", function() {
    this.timeout(5 * 1000);

    let serverProcess;
    let driver;

    before(function (done) {
      runServer.runProgrammatically(function(process) {
        serverProcess = process;

        try {
          driver = createDriver();
          driver.getCapabilities() .then(function(capabilities) {
            const version = capabilities.get("browserName");
            if (version !== EXPECTED_BROWSER) {
              console.log("Warning: Smoke test browser expected " +
                          EXPECTED_BROWSER + ", but was " + version);
            }
          }).catch(function(err) {
            console.log(err);
          }).then(done);
        } catch (error) {
          throw error;
        }
      });
    });

    after(function(done) {
      serverProcess.on("exit", function(code, signal) {
        driver.quit()
          .then(function() {})
          .catch(function(error){
            console.log(error);
          })
          .then(done);
      });
      serverProcess.kill();
    });

    it("can get home page", function(done) {
      httpGet(HOME_PAGE_URL, function(response, receivedData) {
        const marker = "App home page";
        const foundHomePage = receivedData.indexOf(marker) !== -1;

        assert.equal(
          foundHomePage,
          true,
          `home page should have contained test marker '${marker}'`
        );
        done();
      });
    });

    it("can find the header", async function() {
      driver.get(HOME_PAGE_URL);
      const elements = await driver.findElements(By.id("header-text"));
      const element = elements[0];
      const text = await element.getText();
      assert.equal(text, "Hello, world!");
    });
  });

  function createDriver() {
    require("chromedriver");
    const options = new chrome.Options();
    options.addArguments('headless', 'disable-gpu', 'no-sandbox');

    return new webdriver.Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();
  }

  function httpGet(url, callback) {
    const request = http.get(url);
    request.on("response", function(response) {
      let receivedData = "";
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

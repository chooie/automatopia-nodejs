const assert = require("_assert");
const preformatted = require("_preformatted");

const cssObjectToString = require("./cssObjectToString.js");

describe("CSS: CSS in JS util", function() {
  it("converts a css object to a valid css string", function() {
    const styles = {
      ".hello": {
        "font-size": "16px"
      },
      ".bye": preformatted`
        color: blue;
        font-size: 48px;
      `,
      "@media screen and (min-width: 1000px)": {
        ".hello": {
          "font-size": "48px"
        }
      }
    };
    assert.equal(
      cssObjectToString(styles),
      preformatted`
        .hello {
          font-size: 16px;
        }
        .bye {
          color: blue;
          font-size: 48px;
        }
        @media screen and (min-width: 1000px) {
          .hello {
            font-size: 48px;
          }
        }
      `
    );
  });
});

const assert = require("_assert");

const cssHelper = require("../_css_test_helper.js");
const mainStyles = require("./main.js");
const normalize = require("./normalize.js");

let frame;
let body;

describe("CSS: Layout", function() {
  before(function(done) {
    frame = cssHelper.createFrame(
      {
        width: cssHelper.smallestDeviceWidth,
        css: normalize + mainStyles
      },
      done
    );
  });

  beforeEach(function() {
    frame.reset();
    body = frame.body();
  });

  after(function() {
    frame.remove();
  });

  describe("Page container", function() {
    let container;

    beforeEach(function() {
      container = frame.add(
        "<div class='page-container page-container--light'>hello</div>",
        "container"
      );
    });

    it("uses the border-box box-sizing model", function() {
      assert.equal(container.getRawStyle("box-sizing"), "border-box");
    });

    it("takes up the whole page width on small devices", function() {
      const paddingWidthValue = cssHelper.getPaddingWidthValue(body);
      container.assert({
        width: body.width.minus(paddingWidthValue)
      });
    });

    it("takes up the full height of the page", function() {
      const paddingHeightValue = cssHelper.getPaddingHeightValue(body);
      container.assert({
        height: body.height.minus(paddingHeightValue)
      });
    });

    it("prevents any margin being applied to it by margin collapsing", function() {
      let domContainer = container.toDomElement();
      assertDoesNotCollapseItsMargins(domContainer);
    });

    it("is colored", function() {
      assert.equal(
        cssHelper.getBackgroundColor(container),
        cssHelper.pageBackgroundColor
      );
    });

    it("is horizontally centered", function() {
      assert.equal(cssHelper.containerIsHorizontallyCentered(container), true);
    });

    it("centers all containing text", function() {
      assert.equal(cssHelper.textAlign(container), "center");
    });
  });

  describe("Body", function() {
    it("is IIT brand color", function() {
      assert.equal(
        cssHelper.getBackgroundColor(frame.body()),
        cssHelper.backgroundColor
      );
    });
  });

  describe("Header", function() {
    let header;

    beforeEach(function() {
      header = frame.add("<h1 class='header'>hello</h1>", "page header");
    });

    it("is centered in page", function() {
      assert.equal(header.getRawStyle("text-align"), "center");
    });

    it("is colored", function() {
      assert.equal(cssHelper.textColor(header), cssHelper.headerTextColor);
    });

    it("is big ", function() {
      assert.equal(cssHelper.fontSize(header), "32px");
    });

    it("is even bigger on wider devices", function() {
      frame.resize(cssHelper.mediumDeviceWidth, 500);
      assert.equal(cssHelper.fontSize(header), "64px");
    });
  });

  describe("Eye-catching text", function() {
    let catchyText;

    beforeEach(function() {
      catchyText = frame.add("<p class='catchy-text'>hello</p>", "page header");
    });

    it("is large and bold", function() {
      assert.equal(cssHelper.fontSizeByDecimalPlaces(catchyText, 1), "19.2px");
      assert.equal(cssHelper.fontWeight(catchyText), "600");
    });

    it("is even bigger on wider devices", function() {
      frame.resize(cssHelper.mediumDeviceWidth, 500);
      assert.equal(cssHelper.fontSizeByDecimalPlaces(catchyText, 1), "38.4px");
    });

    it("has a color", function() {
      assert.equal(cssHelper.textColor(catchyText), cssHelper.catchyTextColor);
    });
  });

  describe("Contact Email", function() {
    let contactLinkContainer;
    let contactLink;

    beforeEach(function() {
      contactLinkContainer = frame.add(
        `<div class="container--contact-link">
          <a id="contact-link" class="contact-link">hello</a>
         </div>`,
        "page header"
      );
      contactLink = frame.get("#contact-link");
    });

    it("has centered text", function() {
      assert.equal(contactLinkContainer.getRawStyle("text-align"), "center");
    });

    it("has a color", function() {
      assert.equal(
        cssHelper.textColor(contactLink),
        cssHelper.contactMailColor
      );
    });

    it("is big", function() {
      assert.equal(cssHelper.fontSizeByDecimalPlaces(contactLink, 1), "12.8px");
    });

    it("is even bigger on wider devices", function() {
      frame.resize(cssHelper.mediumDeviceWidth, 500);
      assert.equal(cssHelper.fontSizeByDecimalPlaces(contactLink, 1), "25.6px");
    });
  });

  describe("footer", function() {
    let footer;

    beforeEach(function() {
      footer = frame.add("<h1 class='footer'>hello</h1>", "page footer");
    });

    it("is small and justified left", function() {
      assert.equal(cssHelper.fontSize(footer), "12px");
      assert.equal(footer.getRawStyle("text-align"), "left");
    });

    it("has a color scheme", function() {
      assert.equal(cssHelper.textColor(footer), cssHelper.headerTextColor);
    });

    it("is nicely padded", function() {
      assert.equal(cssHelper.padding(footer), "10px");
    });

    it("has a top border", function() {
      assert.equal(footer.getRawStyle("border-top-width"), "1px");
      assert.equal(footer.getRawStyle("border-top-style"), "solid");
      assert.equal(
        footer.getRawStyle("border-top-color"),
        "rgb(253, 253, 253)"
      );
      assert.equal(footer.getRawStyle("border-right-style"), "none");
      assert.equal(footer.getRawStyle("border-bottom-style"), "none");
      assert.equal(footer.getRawStyle("border-left-style"), "none");
    });

    it("has a height and vertically centers its children", function() {
      footer.assert({
        height: 60
      });
      assert.equal(footer.getRawStyle("display"), "flex");
      assert.equal(footer.getRawStyle("align-items"), "center");
    });
  });
});

function assertDoesNotCollapseItsMargins(element) {
  const beforePseudoElementStyles = getComputedStyle(element, ":before");
  const emptyString = '""';

  assert.equal(
    beforePseudoElementStyles.getPropertyValue("content"),
    emptyString
  );
  assert.equal(beforePseudoElementStyles.getPropertyValue("display"), "table");
}

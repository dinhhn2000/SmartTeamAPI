const expect = require("chai").expect;
var request = require("request");

describe("Simple Math Test", () => {
  it("1 + 1 = 2 test", () => {
    expect(1 + 1).to.equal(2);
  });
  it("3 * 3 = 9 test", () => {
    expect(3 * 3).to.equal(9);
  });
  it("Welcome route test", () => {
    request("http://localhost:3000/welcome", function (error, response, body) {
      expect(body).to.equal("Hello to smart team API");
    });
  });
});

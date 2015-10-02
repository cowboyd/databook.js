/*global it, describe, chai */

var expect = chai.expect;

describe("Dataset", function() {
  it("exists", function() {
    expect(Dataset).not.to.be.undefined;
  });
  it("can be instantiated", function() {
    expect(new Dataset()).to.be.instanceOf(Dataset);
  });
});

/*global it, describe, chai */

var expect = chai.expect;

describe("Databook", function() {
  it("exists", function() {
    expect(Databook).not.to.be.undefined;
  });
  it("can be instantiated", function() {
    expect(new Databook()).to.be.instanceOf(Databook);
  });
});

/*global it, describe, chai, beforeEach, afterEach */

var expect = chai.expect;
var Dataset = window.Dataset;

describe("Dataset", function() {
  describe("with no fetch function", function() {
    it("emits an observation of the state");
    it("indicates that the dataset is not doing any loading");
  });

  describe("with a fetch function and the default load horizon", function() {
    it("requests the first page only");
    it("now has a requested page");
    it("indicates that the dataset is now loading");
    it("indicates that the first page is loading");
    describe("when the first page resolves", function() {
      it("integrates the statistics");
      it("reflects the total number of records");
      it("reflects the total number of pages");
      it("indicates that the dataset is no longer loading");
      it("indicates that the page is no longer loading");
      it("contains empty objects for the items that have not even been requested");
      it("contains unequested pages for the pages that have not been requested");
    });
  });

  afterEach(function() {
    delete this.dataset;
    delete this.model;
    delete this.fetches;
  });
});

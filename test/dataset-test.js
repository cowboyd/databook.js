/*global it, describe, chai, beforeEach, afterEach */

var expect = chai.expect;
var Dataset = window.Dataset;

describe("Dataset", function() {
  describe("with no fetch function", function() {
    beforeEach(function() {
      var _this = this;
      this.dataset = new Dataset({
        pageSize: 10,
        observe: function(model) {_this.model = model; }
      });
    });
    it("initializes the model", function() {
      expect(this.model).to.be.instanceOf(Object);
      expect(this.model.totalSize).to.equal(0);
    });
    it("indicates that the dataset is not doing any loading", function() {
      expect(this.model.isPending).to.equal(false);
      expect(this.model.isResolved).to.equal(true);
      expect(this.model.isRejected).to.equal(false);
      expect(this.model.isSettled).to.equal(true);
    });
  });

  describe("with a fetch function (but no load horizon)", function() {
    beforeEach(function() {
      var _this = this;
      this.dataset = new Dataset({
        pageSize: 10,
        fetch: function(pageOffset, pageSize, stats) {
          stats.totalRecords = 1000;
          stats.totalPages = 100;
          _this.fetches = (_this.fetches || []);
          var fetch = {
            pageOffset: pageOffset,
            pageSize: pageSize,
            promise: new Promise(function(resolve, reject) {
              _this.resolve = resolve;
              _this.reject = reject;
            })
          };
          _this.fetches.push(fetch);
          return fetch.promise;
        },
        observe: function(model) {
          _this.model = model;
        }
      });
    });
    it("requests the first page only", function() {
      var fetches = this.fetches;
      expect(fetches).to.have.length(1);
      expect(fetches[0].pageOffset).to.equal(0);
    });
    it("now has a page", function() {
      expect(this.model.pages).to.have.length(1);
    });
    it("indicates that the dataset is now loading", function() {
      expect(this.model.isPending).to.equal(true);
      expect(this.model.isResolved).to.equal(false);
      expect(this.model.isRejected).to.equal(false);
      expect(this.model.isSettled).to.equal(false);
    });
    it("indicates that the first page is loading", function() {
      var page = this.model.pages[0];
      expect(page).to.be.instanceOf(Object);
      expect(page.isRequested).to.equal(true);
      expect(page.isPending).to.equal(true);
      expect(page.isResolved).to.equal(false);
      expect(page.isRejeted).to.equal(false);
      expect(page.isSettled).to.equal(false);
    });
    describe("when the page resolves", function() {
      beforeEach(function() {
        var fetch = this.fetches[0];
        this.resolve(new Array(fetch.pageSize).map(function (item, i) {
          return fetch.pageOffset * fetch.pageSize + i;
        }));
        return fetch.promise;
      });
      it("integrates the statistics", function() {
        expect(this.model.totalRecords).to.equal(10000);
        expect(this.model.totalPages).to.equal(1000);
      });
      it("reflects the total number of records", function() {
        expect(this.model.items).to.have.length(10000);
      });
      it("reflects the total number of pages", function() {
        expect(this.model.pages).to.have.length(1000);
      });
      it("indicates that the dataset is no longer loading", function() {
        expect(this.model.isPending).to.equal(false);
        expect(this.model.isResolved).to.equal(true);
        expect(this.model.isRejeted).to.equal(false);
        expect(this.model.isSettled).to.equal(true);
      });
      it("indicates that the page is no longer loading", function() {
        var page = this.model.pages[0];
        expect(page.isRequested).to.equal(true);
        expect(page.isPending).to.equal(false);
        expect(page.isResolved).to.equal(true);
        expect(page.isRejeted).to.equal(false);
        expect(page.isSettled).to.equal(true);
      });
      it("contains empty objects for the items that have not even been requested", function() {
        expect(this.model.items[999]).to.deep.equal({});
      });
      it("contains unequested pages for ", function() {
        var page = this.model.pages[99];
        expect(page.isRequested).to.equal(false);
        expect(page.isPending).to.equal(false);
        expect(page.isResolved).to.equal(false);
        expect(page.isRejeted).to.equal(false);
        expect(page.isSettled).to.equal(false);
      });
    });
  });

  afterEach(function() {
    delete this.dataset;
    delete this.model;
    delete this.fetch;
  });
});

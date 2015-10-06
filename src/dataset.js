import Page from './page';

class State {
  constructor() {
    this.isPending = false;
    this.isResolved = true;
    this.isRejected = false;
    this.isSettled = true;
    this.pages = [];
  }

  update(change) {
    let next = new State();
    next.isPending = this.isPending;
    next.isResolved = this.isResolved;
    next.isRejected = this.isRejected;
    next.isSettled = this.isSettled;
    next.totalSize = this.totalSize;
    next.pages = this.pages.slice();
    return change.call(this, next);
  }

  get records() {
    return this.pages.reduce(function(records, page) {
      return records.concat(page.records);
    }, []);
  }
}

export default class Dataset {

  constructor(options = {}) {
    if (!options.pageSize) {
      throw new Error('created Dataset without pageSize');
    }
    this._pageSize = options.pageSize;
    this._fetch = options.fetch || function(/*pageOffset,*/ /*pageSize,*/ /*stats*/) {};
    this._observe = options.observe || function() {};
    this._loadHorizon = options.loadHorizon || 1;
    this._unloadHorizon = options.unloadHorizon || Infinity;
    this.state = new State();
    this._observe(this.state);
    this.setReadOffset(0);
  }

  setReadOffset(offset) {
    let currentOffset = this._currentReadOffset;
    if (currentOffset === offset) { return; }

    this.state = this.state.update((next)=> {
      var pages = next.pages;
      for (var i = offset; i < i + this._loadHorizon; i++) {
        pages.length = Math.max(pages.length, i + 1);
        var page = pages[i];
        if (!page || !page.isRequested) {
          pages.splice(i, 1, new Page());
          this._fetchPage(i);
        }
      }
    });
    this._observe(this.state);
  }

  _fetchPage(offset) {
    let stats = {
      totalPages: this.state.pages.length
    };
    let pageSize = this._pageSize;
    this._fetch.call(this, offset, pageSize, stats).then((records)=> {
      this.state.update((next)=> {
        let currentPages = next.pages.length;
        next.pages.length = stats.totalPages;
        next.pages.fill(new Page(offset, pageSize), currentPages, stats.totalPages);

        let page = next.pages[offset];
        next.pages.splice(offset, 1, page.resolve(records));
      });
      this._observe(this.state);
    });
  }
};

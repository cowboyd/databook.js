```js

import Dataset from 'dataset'; import getStuff from 'get-stuff';

let currentState = null;

// Dataset.js is a JavaScript only object for navigating through paged
// data. It understands that rendering a paged dataset in realtime as
// it is incrementally and asynchronously loaded is no mean feat, and
// so it's got your back.
//
// It's goal is to give you as much information about what exactly is
// happening at any give moment so that you can represent it
// appropriately at any given moment.  To use a dataset, you pass it a
// single parameter called `fetch` which is a function responsible for
// loading a single page into your dataset. Dataset will keep track of
// which pages have been requested, loaded, and it will publish a copy
// of its model which you can use to do things like render a
// visualization of said dataset.
let dataset = new Dataset({

  // Dataset does not emit events in the classical sense. Instead, it works by
  // publishing a new, immutable version of its model in its entirety, any time
  // there is a change of any significance. You can observe this state with a
  // function.

  observe: function(state) {
    currentState = state;
  },

  // the fetch function gets passed two parameters, `pageOffset` which says
  // which page in the whole dataset this request should fetch, and a `stats`
  // object which can be used to say things about the dataset as a whole (such
  // as how many total pages there are.
  //
  // This function should return a promise that yields an array of
  // records corresponding to the contens of that page.
  fetch: function(pageOffset, pageSize, stats) {
    // make the request
    return getStuff({limit: 10, offset: pageOffset}).then(function(result) {
      // you have the opportunity to set dataset level metadata
      // from your response if you want.
      stats.totalPages = result.metadata.pageCount;
      stats.totalRecords = result.metadat.recordCount;
      return result;
    });
  },

  // We can tell the dataset that wherever the read offset is, we want to make
  // sure that two pages are loaded in front and behind
  loadHorizion: 2,

  // If a page is outside the unloadHorizon, then it will be unloaded so that
  // the memory can be reclaimed. Infinity is the default value, which means
  // "don't ever unload"
  unloadHorizon: Infinity
});


// the current state starts out completely empty.
currentState === {
  pages: []
};

// let's fetch a couple of pages in the dataset. We do this by telling
// the dataset what we want to set the read offset to `2`. Because our load
// horizon is two, this will result in pages 0,1,2,3 being loaded. Since a newer
// version of the model will be published as an event letting you know
// that there are some pages in  flight.
dataset.setReadOffset(2);

// It will emit something like this. Note that the pages are
// requested, but not yet loaded. There is going to be a request in
// flight for each page, and because our fetch function indicates the
// page size, there will be 10 empty records in each page.
currentState === {
  pageSize: 10,
  isPending: true,
  isSettled: false,
  isRejected: false,
  isFulfilled: false,
  error: null,
  pages: [
    {
      size: 10,
      isPending: true,
      isSettled: false,
      isRejected: false,
      isFulfilled: false,
      records: Array(10)
    },
    {
      size: 10,
      isPending: true,
      isSettled: false,
      isRejected: false,
      isFulfilled: false,
      records: Array(10)
    }
  ]
};

// Let's assume that the request for the second page actually comes
// back first. In that case, we'd see something like.
currentState === {
  pageSize: 10,
  isPending: true,
  isSettled: false,
  isRejected: false,
  isFulfilled: false,
  error: null,
  pages: [
    {
      size: 10,
      isPending: true,
      isSettled: false,
      isRejected: false,
      isFulfilled: false,
      records: Array(10)
    },
    {
      size: 10,
      isPending: false,
      isSettled: true,
      isRejected: false,
      isFulfilled: true,
      records: [
        // contains the records returned by fetch
      ]
    }
  ]
};

// Because each page's promise state is tracked individually, this
// makes it easy to represent.
//
// Sometime later, that second request comes in. Note that now, the
// dataset as a whole is considered to be fulfilled because all of
// the in-flight requests are rolled up into a single promise.

currentState === {
  pageSize: 10,
  isPending: true,
  isSettled: false,
  isRejected: false,
  isFulfilled: false,
  error: null,
  pages: [
    {
      size: 10,
      isPending: false,
      isSettled: true,
      isRejected: false,
      isFulfilled: true,
      records: [
        // contains the records yieled by fetch for the first page.
      ]
    },
    {
      size: 10,
      isPending: false,
      isSettled: true,
      isRejected: false,
      isFulfilled: true,
      records: [
        // contains the records returned by fetch
      ]
    }
  ]
};

// Now let's load another page, rememebring that the maximum number of
// pages that we can keep in memory is two (In practice, the maxium
// simultaneous pages would be in the thousands, but maybe we're on an arduino,
// I dunno), so one page will have to go.
//
// Right now we have pages 1 and 2 loaded, so our dataset looks like this:
//
//   1    2    3    4    5    6    7
//   O----O----*----*----*----*----*
//   ^    ^
//   |    |
// first last
//
// We want to load page 3, but that means page 1 will have to go.
// So a call to:
//

dataset.setLastPage(3);

// will make the dataset look like:
//   1    2    3    4    5    6    7
//   *----O----O----*----*----*----*
//        ^    ^
//        |    |
//      first last
//
//
// By the same token, now seting the first page to page 1, it will unload page 3
```

## Develoment

```
$ npm install
$ npm test ci # run tests from command line
$ npm test # run test server
```

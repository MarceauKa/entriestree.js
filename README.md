# EntriesTree.js

This library is intended to work with recursive array of data in Javascript.

- [Installation](#installation)
- [Guide](#guide)
- [API](#api)
- [Tests](#tests)
- [Licence](#licence)

## Installation

⬆️ [Top](#entriestreejs) ➡️ [Guide](#guide) 

This package is available on [NPM](https://www.npmjs.com/package/entriestree).

`npm i entriestree`

## Guide

⬆️ [Top](#entriestreejs) ➡️ [API](#api)

### Example data

This kind of data looks familiar? This is the sample data used below. You'll find this [sample data](https://github.com/MarceauKa/entriestree.js/blob/master/fixtures/readmeCollection.js) in `fixtures/readmeCollection.js`.

```
- {id: 1, ...}
	- {id: 10, ...}
	- {id: 11, ...}
		- {id: 110, ...}
		- {id: 111, ...}
			- {id: 1110, ...}
			- {id: 1111, ...}
		- {id: 112, ...}
	- {id: 12, ...}
- {id: 2, ...}
	- {id: 20, ...}
		- {id: 200, ...}
	- {id: 21, ...}
	- {id: 22, ...}
		- {id: 221, ...}
- {id: 3, ...}
- {id: 4, ...}
	- {id: 40, ...}
		- {id: 400, ...}
		- {id: 401, ...}
			- {id: 4010, ...}
	- {id: 41, ...}
	- {id: 42, ...}
```

### Initialization

In this example, `collection` is our structure and each item has an unique identifier called `id` (_customizable_). Child items are stored in a property called `children` (_customizable too_).

```js
import collection from '...' // above sample data
import EntriesTree from 'entriestree'

const tree = new EntriesTree(collection, 'id', 'children')
```

### Find element

Properties starting with `_` are added by the library.

```js
tree.find(11) // returns {id: 11, children: [{id: 110, ...}, ...]}
tree.find(3) // returns {id: 3, ...}
tree.find(-1) // returns null
```

Also, you can find the nearest ancestor.

```js
tree.findAncestor(110) // returns {id: 11, ...}
tree.findAncestor(1) // returns {id: 1, ...}
tree.findAncestor(-1) // returns null
```

### Find element's parent

```js
tree.findParent(110) // returns {id: 1, children: [...], ...}
tree.findParent(4) // returns null because {id: 4} is a root element
```

### Find element's siblings

```js
tree.findSiblings(1)
// returns {prevItem: null, nextItem: {id: 2, ...}}
tree.findSiblings(111)
// returns {prevItem: {id: 110, ...}, nextItem: {id: 112, ...}}
tree.findSiblings(-1)
// returns {prevItem: null, nextItem: null}
```

### Count elements

It's super easy to get the collection length (recursively).

```js
tree.count() // returns 23
tree.countFrom(11) // returns 5
````

### Update element

```js
tree.find(221) // returns {id: 221, ...}

tree.update(221, (item) => {
  item.foo = 'bar';
  return item
})

tree.find(221) // returns {id: 221, foo: 'bar', ...}
```

### Update element recursively

```js
tree.updateUp(110, (item) => {
  item.foo = 'bar'
  return item
}) // updates 110, 11 and 1 

tree.updateDown(111, (item) => {
  item.bar = 'baz'
  return item
}) // updates 111, 1110 and 1111 
```

⚠️ Don't forget to return the updated element in your updater function!

### Delete element

```js
tree.delete(111) // returns the deleted item
tree.count() // returns 20 since {id: 111} as two children
tree.delete(-1) // returns null
```

### Insert before or after element

```js
tree.insertAfter(1, toInsert) // returns EntriesTree's instance
tree.insertBefore(111, toInsert) // same as above
tree.insertAfter(-1, toInsert) // can't insert after an unexisting element
```

### Loop over flattened elements

```js
tree.iterable()
// returns [{id: 1, ...}, {id: 2, ...}, {id: 3, ...}, ...]
```

### Deep clone a collection

Sometimes it's useful to work on a copy of your elements without noising your original collection.

```js
const tree = new EntriesTree().setCollection(collection, true)
// collection will be untouched
const tree = new EntriesTree().clone(collection)
// same as above

tree.update(1, (item) => {
  item.foo = 'bar'
  return item
})

collection[0].foo !== tree.find(1).foo
// returns false
```

# API

⬆️ [Top](#entriestreejs) ➡️ [Tests](#tests)

Methods meant to be private are not listed. Eg: `isTheOne`, `isNode`, `isRoot`, etc

| Method | Params | Return |
|--------|--------|--------|
| `constructor` | `{Object[]} collection = []`, `{string} id = 'id'`, `{string} childkey` | `{EntriesTree}` |
| `setCollection` | `{Object[]} collection = []`, `{boolean} clone` | `{EntriesTree}` |
| `getCollection` |  | `{Object[]}` |
| `clone` | `{?Object[]} collection = null` | `{Object[]}` |
| `iterable` | `{Object[]}` |  |
| `count` | | `@returns {number}` |
| `countFrom` | `{Object,string,number} toFind` | `{number}` |
| `find` | `{Object,string,number} toFind` | `{?Object}` |
| `findParent` | `{Object,string,number} toFind` | `{?Object}` |
| `findSiblings` | `{Object,string,number} toFind` | `{?Object}` |
| `findAncestor` | `{Object,string,number} toFind` | `{?Object}` |
| `update` | `{Object,string,number} toFind`, `{function} updater` | `{EntriesTree}` |
| `updateUp` | `{Object,string,number} toFind`, `{function} updater` | `{EntriesTree}` |
| `updateDown` | `{Object,string,number} toFind`, `{function} updater` | `{EntriesTree}` |
| `delete` | `{Object,string,number} toFind` | `{?Object}` |
| `insertAfter` | `{Object,string,number} toFind`, `{Object} toInsert` | `{EntriesTree}` |
| `insertBefore` | `{Object,string,number} toFind`, `{Object} toInsert` | `{EntriesTree}` |

# Tests

⬆️ [Top](#entriestreejs) ➡️ [Licence](#licence)

Tests are made with [ava](https://github.com/avajs/ava)

`npm run test`

# Licence

⬆️ [Top](#entriestreejs)

MIT

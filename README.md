# EntriesTree.js

This library is intended to work with recursive array of data in Javascript.

⚠️ This library is under active development

- [Installation](#installation)
- [Guide](#guide)
- [Tests](#tests)
- [Licence](#licence)

## Installation

⚠️ Not yet registered on NPM

`npm i entriestree`

## Guide

### Example data

This kind of data looks familiar? This is the sample data used below.

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

## Initialization

In this example, `collection` is our structure and each item has an unique identifier called `id`. Child items are stored in a property called `children`.

```js
import collection from '...' // above sample data
import EntriesTree from 'entriestree'
const tree = new EntriesTree(collection, 'id', 'children')
```

### Find element

Properties starting with `_` are added by the library.

```js
tree.find(11)
// returns {id: 11, children: [{id: 110, ...}, {id: 111, ...}], _parent: 1, _deepness: 1}

tree.find(collection[0].children[1])
// same as above (collection[0] => {id: 1}, children[1] => {id: 11})

tree.find(3)
// returns {id: 3, _parent: null, _deepness: 0, ...}

tree.find(-1)
// return null
```

### Count elements

It's super easy to get the collection length (recursively).

```js
tree.count()
// returns 23 in our sample data
````

### Update element

```js
tree.find(221)
// returns {id: 221, ...}

tree.update(221, (item) => {
	item.foo = 'bar';
	return item
})

tree.find(221)
// returns {id: 221, foo: 'bar', ...}
```

### Delete element

```js
tree.delete(111)
// returns the deleted item

tree.count()
// returns 20 since {id: 111} as two children

tree.delete(-1)
// returns null
```

### Get element's parent

```js
tree.parent(110)
// returns {id: 1, children: [...], ...}

tree.parent(collection[0].children[1].children[0])
// same as above

tree.parent(4)
// returns null because {id: 4} is a root element
```

### Get element's siblings

```js
tree.siblings(1)
// returns {prevItem: null, nextItem: {id: 2, ...}}

tree.siblings(111)
// returns {prevItem: {id: 110, ...}, nextItem: {id: 112, ...}}

tree.siblings(-1)
// returns {prevItem: null, nextItem: null}
```

# Tests

Tests are made with [ava](https://github.com/avajs/ava)

`npm run test`

# Licence

MIT

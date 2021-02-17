import demoCollection from './src/dummy.js'
import EntriesTree from './src/EntriesTree.js'

const tree = new EntriesTree(demoCollection)

// Find
console.group('Find')
console.log('find unexisting element should be null:', tree.find(-1))
console.log('find existing element:', tree.find(11))
console.groupEnd()

// Update
console.group('Update')
console.log('before update:', tree.find(3).type)
tree.update(3, (item) => {
	item.type = 'updated'
	return item
})
console.log('after update:', tree.find(3).type)
console.groupEnd()

// Count
console.group('Count')
console.log('count from method:', tree.count())
console.log('existing collection:', tree.collection)
console.groupEnd()

// Parent
console.group('Parent')
console.log('parent of root must be null:', tree.parent(1))
console.log('parent of children:', tree.parent(2))
console.groupEnd()

// Delete
console.group('Delete')
console.log('count before delete:', tree.count())
tree.delete(2)
console.log('count after delete:', tree.count())
console.groupEnd()

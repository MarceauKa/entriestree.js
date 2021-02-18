import test from 'ava'
import defaultCollection from '../fixtures/defaultCollection.js'
import collectionWithCustomId from '../fixtures/collectionWithCustomId.js'
import collectionWithCustomChildren from '../fixtures/collectionWithCustomChildren.js'
import EntriesTree from '../src/EntriesTree.js'

test.beforeEach(t => {
  t.context.tree = new EntriesTree(defaultCollection)
})

test('it returns null when item is not found ', t => {
  t.is(t.context.tree.find(-1), null)
})

test('it finds root item', t => {
  t.is(t.context.tree.find(1), defaultCollection[0])
})

test('it finds children item', t => {
  t.is(t.context.tree.find(8), defaultCollection[1].children[1].children[0])
})

test('it finds item from object', t => {
  t.is(t.context.tree.find(defaultCollection[0].children[1]), t.context.tree.find(3))
})

test('it finds item with custom structure id', t => {
  const tree = new EntriesTree(collectionWithCustomId, 'uuid')
  t.is(tree.find('2210'), collectionWithCustomId[1].children[1].children[0])
})

test('it finds item with custom structure children', t => {
  const tree = new EntriesTree(collectionWithCustomChildren, 'id', 'blocks')
  t.is(tree.find(4), collectionWithCustomChildren[0].blocks[2])
})

test('it updates item', t => {
  t.context.tree.update(2, (item) => {
    item.type = 'updated'
    return item
  })
  t.is(t.context.tree.find(2).type, 'updated')
})

test('it count items', t => {
  t.is(t.context.tree.count(), 14)
})

test('it finds parent item', t => {
  t.is(t.context.tree.parent(1), null)
  t.is(t.context.tree.parent(2), t.context.tree.find(1))
})

test.todo('it deletes item')

test.todo('it swaps items')

test.todo('it walks tree')

test.todo('it flattens tree')

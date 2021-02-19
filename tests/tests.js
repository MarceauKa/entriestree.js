import test from 'ava'
import defaultCollection from '../fixtures/defaultCollection.js'
import collectionWithCustomId from '../fixtures/collectionWithCustomId.js'
import collectionWithCustomChildren from '../fixtures/collectionWithCustomChildren.js'
import EntriesTree from '../src/EntriesTree.js'

test.beforeEach(t => {
  // Hm, we need a better alternative for deep copying!
  t.context.tree = new EntriesTree(JSON.parse(JSON.stringify(defaultCollection)))
})

test('it finds root item', t => {
  t.is(t.context.tree.find(1).id, defaultCollection[0].id)
})

test('it finds children item', t => {
  t.is(t.context.tree.find(8).id, defaultCollection[1].children[1].children[0].id)
})

test('it returns null when item is not found ', t => {
  t.is(t.context.tree.find(99), null)
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

test('it count items', t => {
  t.is(t.context.tree.count(), 14)
})

test('it parentizes items', t => {
  t.is(t.context.tree.find(1)._parent, null)
  t.is(t.context.tree.find(1)._deepness, 0)

  t.is(t.context.tree.find(4)._parent, 1)
  t.is(t.context.tree.find(4)._deepness, 1)

  t.is(t.context.tree.find(10)._parent, 9)
  t.is(t.context.tree.find(10)._deepness, 3)
})

test('it finds parent item', t => {
  t.is(t.context.tree.parent(1), null)
  t.is(t.context.tree.parent(2), t.context.tree.find(1))
})

test('it finds siblings of an item', t => {
  let siblings = t.context.tree.siblings(1)
  t.is(siblings.prevItem, null)
  t.is(siblings.nextItem.id, 5)

  siblings = t.context.tree.siblings(5)
  t.is(siblings.prevItem.id, 1)
  t.is(siblings.nextItem.id, 12)

  siblings = t.context.tree.siblings(11)
  t.is(siblings.prevItem.id, 10)
  t.is(siblings.nextItem, null)
})

test('it finds siblings of an item from an object', t => {
  let siblings = t.context.tree.siblings(t.context.tree.find(5))
  t.is(siblings.prevItem.id, 1)
  t.is(siblings.nextItem.id, 12)

  siblings = t.context.tree.siblings(defaultCollection[1].children[1].children[1].children[0])
  t.is(siblings.prevItem, null)
  t.is(siblings.nextItem.id, 11)
})

test('it updates item', t => {
  t.context.tree.update(2, (item) => {
    item.type = 'updated'
    return item
  })
  t.is(t.context.tree.find(2).type, 'updated')
})

test('it deletes root item', t => {
  t.not(t.context.tree.delete(12), null)
  t.is(t.context.tree.count(), 11)
})

test('it deletes children item', t => {
  t.not(t.context.tree.delete(4), null)
  t.is(t.context.tree.count(), 13)
})

test('it returns null when deleting unexisting item', t => {
  t.is(t.context.tree.delete(99), null)
  t.is(t.context.tree.count(), 14)
})

import test from 'ava'
import defaultCollection from '../fixtures/defaultCollection.js'
import collectionWithCustomId from '../fixtures/collectionWithCustomId.js'
import collectionWithCustomChildren from '../fixtures/collectionWithCustomChildren.js'
import EntriesTree from '../src/EntriesTree.js'

test.beforeEach(t => {
  t.context.tree = new EntriesTree().setCollection(defaultCollection, true)
})

test('it walks through items', t => {
  let loop = 0

  for (let item of t.context.tree.iterable()) {
    t.is(item.id, loop + 1)
    loop++
  }

  t.is(t.context.tree.iterable().length, 14)
})

test('it finds root item', t => {
  t.is(t.context.tree.find(1).id, defaultCollection[0].id)
  t.is(t.context.tree.find(8).id, defaultCollection[1].children[1].children[0].id)
  t.is(t.context.tree.find(99), null)
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

test('it finds ancestor', t => {
  t.is(t.context.tree.find(1), t.context.tree.findAncestor(3))
  t.is(t.context.tree.find(1), t.context.tree.findAncestor(1))
  t.is(t.context.tree.find(5), t.context.tree.findAncestor(10))
  t.is(t.context.tree.find(99), null)
})

test('it count items', t => {
  t.is(t.context.tree.count(), 14)
})

test('it count items from item', t => {
  t.is(t.context.tree.countFrom(1), 3)
  t.is(t.context.tree.countFrom(99), 0)
  t.is(t.context.tree.countFrom(4), 0)
  t.is(t.context.tree.countFrom(9), 2)
})

test('it parentizes items', t => {
  t.is(t.context.tree.find(1)._parent, null)
  t.is(t.context.tree.find(1)._deepness, 0)

  t.is(t.context.tree.find(4)._parent, 1)
  t.is(t.context.tree.find(4)._deepness, 1)

  t.is(t.context.tree.find(10)._parent, 9)
  t.is(t.context.tree.find(10)._deepness, 3)
})

test('it clones tree', t => {
  let collection = [{ id: 1, children: [{ id: 2 }, { id: 3, children: [{ id: 4 }] }] }]
  let originalTree = new EntriesTree(collection)
  let copyTree = new EntriesTree(originalTree.clone())

  originalTree.update(2, (item) => {
    item.foo = 'bar'
    return item
  })

  t.is(originalTree.count(), copyTree.count())

  t.not(originalTree.find(2), copyTree.find(2))
  t.is(originalTree.find(2).id, copyTree.find(2).id)

  copyTree.update(4, (item) => {
    item.test = 'foo'
    return item
  })

  originalTree.update(4, (item) => {
    item.test = 'bar'
    return item
  })

  t.not(originalTree.find(4).test, copyTree.find(4).test)

  originalTree.delete(3)
  t.not(originalTree.count(), copyTree.count())
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

test('it deletes item', t => {
  t.not(t.context.tree.delete(12), null)
  t.is(t.context.tree.count(), 11)

  t.is(t.context.tree.delete(99), null)
  t.is(t.context.tree.count(), 11)

  t.not(t.context.tree.delete(4), null)
  t.is(t.context.tree.count(), 10)
})

test('it inserts item after child', t => {
  t.context.tree.insertAfter(2, { id: 222, message: 'added after first' })
  t.is(t.context.tree.countFrom(1), 4)
  t.is(t.context.tree.siblings(222).prevItem.id, 2)
  t.is(t.context.tree.siblings(222).nextItem.id, 3)
  t.truthy(t.context.tree.find(222).hasOwnProperty('_parent'))

  t.context.tree.insertAfter(4, { id: 444, message: 'added after last' })
  t.is(t.context.tree.countFrom(1), 5)
  t.is(t.context.tree.siblings(444).prevItem.id, 4)
  t.is(t.context.tree.siblings(444).nextItem, null)
  t.truthy(t.context.tree.find(444).hasOwnProperty('_parent'))
})

test('it inserts item after root', t => {
  t.context.tree.insertAfter(1, { id: 111, message: 'added after first' })
  t.is(t.context.tree.count(), 15)
  t.is(t.context.tree.siblings(111).prevItem.id, 1)
  t.is(t.context.tree.siblings(111).nextItem.id, 5)
  t.truthy(t.context.tree.find(11).hasOwnProperty('_parent'))

  t.context.tree.insertAfter(12, { id: 1212, message: 'added after last' })
  t.is(t.context.tree.count(), 16)
  t.is(t.context.tree.siblings(1212).prevItem.id, 12)
  t.is(t.context.tree.siblings(1212).nextItem, null)
  t.truthy(t.context.tree.find(1212).hasOwnProperty('_parent'))
})

test('it inserts item before child', t => {
  t.context.tree.insertBefore(2, { id: 222, type: 'added before first' })
  t.is(t.context.tree.count(), 15)
  t.is(t.context.tree.siblings(222).prevItem, null)
  t.is(t.context.tree.siblings(222).nextItem.id, 2)
  t.truthy(t.context.tree.find(222).hasOwnProperty('_parent'))

  t.context.tree.insertBefore(4, { id: 444, type: 'added before last' })
  t.is(t.context.tree.count(), 16)
  t.is(t.context.tree.siblings(444).prevItem.id, 3)
  t.is(t.context.tree.siblings(444).nextItem.id, 4)
  t.truthy(t.context.tree.find(444).hasOwnProperty('_parent'))
})

test('it inserts item before root', t => {
  t.context.tree.insertBefore(1, { id: 111, type: 'added before first' })
  t.is(t.context.tree.count(), 15)
  t.is(t.context.tree.siblings(111).prevItem, null)
  t.is(t.context.tree.siblings(111).nextItem.id, 1)
  t.truthy(t.context.tree.find(111).hasOwnProperty('_parent'))

  t.context.tree.insertBefore(12, { id: 1212, type: 'added before last' })
  t.is(t.context.tree.count(), 16)
  t.is(t.context.tree.siblings(1212).prevItem.id, 5)
  t.is(t.context.tree.siblings(1212).nextItem.id, 12)
  t.truthy(t.context.tree.find(1212).hasOwnProperty('_parent'))
})

import test from 'ava'
import demoCollection from '../fixtures/dummy.js'
import EntriesTree from '../src/EntriesTree.js'

test.beforeEach(t => {
  t.context.tree = new EntriesTree(demoCollection)
})

test('it returns null when item is not found ', t => {
  t.is(t.context.tree.find(-1), null)
})

test('it finds root item', t => {
  t.is(t.context.tree.find(1), demoCollection[0])
})

test('it finds children item', t => {
  t.is(t.context.tree.find(8), demoCollection[1].children[1].children[0])
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

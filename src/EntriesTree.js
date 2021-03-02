export default class EntriesTree {
  /**
   * @constructor
   * @param {Object[]} collection
   * @param {string} itemKey
   * @param {string} childKey
   */
  constructor (collection = [], itemKey = 'id', childKey = 'children') {
    this.itemKey = itemKey
    this.childKey = childKey
    this.setCollection(collection)
  }

  /**
   * @returns {Object[]}
   */
  getCollection () {
    return this.collection
  }

  /**
   * @param {Object[]} collection
   * @param {boolean} clone
   * @returns {EntriesTree}
   */
  setCollection (collection, clone = false) {
    if (clone) {
      collection = this.clone(collection)
    }

    this.collection = this.parentize(collection)

    return this
  }

  /**
   * @param {?Object[]} collection
   * @return {Object[]}
   */
  clone (collection = null) {
    const cloner = (elements, stack = []) => {
      elements.forEach(item => {
        let copy = {}

        Object.keys(item).forEach(key => {
          let value = item[key]

          if (Object.prototype.toString.call(value) === '[object Object]' || Array.isArray(value)) {
            copy[key] = cloner(value)
          } else {
            copy[key] = value
          }
        })

        stack.push(copy)
      })

      return stack
    }

    return cloner(collection || this.collection, [])
  }

  /**
   * @param {Object|number|string} findable
   * @param {Object} comparable
   * @returns {boolean}
   */
  isTheOne (findable, comparable) {
    if (typeof findable === 'object') {
      return findable[this.itemKey] === comparable[this.itemKey]
    }

    return findable === comparable[this.itemKey]
  }

  /**
   * @param {Object} item
   * @returns {boolean}
   */
  isNode (item) {
    return item.hasOwnProperty(this.childKey)
  }

  /**
   * @param {Object} item
   * @returns {boolean}
   */
  isRoot (item) {
    return item.hasOwnProperty('_deepness') && item._deepness === 0
  }

  /**
   * @param {Object[]} elements
   * @returns {Object[]}
   */
  parentize (elements) {
    const invokable = (elements, parent = null) => {
      let stack = []

      elements.forEach(item => {
        item._parent = parent ? parent[this.itemKey] : null
        item._deepness = parent ? parent._deepness + 1 : 0

        if (this.isNode(item)) {
          item[this.childKey] = invokable(item[this.childKey], item)
        }

        stack.push(item)
      })

      return stack
    }

    return invokable(elements)
  }

  /**
   * @returns {Object[]}
   */
  iterable () {
    const invokable = (elements, parent = []) => {
      let stack = parent

      elements.forEach(item => {
        stack.push(item)

        if (this.isNode(item)) {
          stack = invokable(item[this.childKey], stack)
        }
      })

      return stack
    }

    return invokable(this.collection)
  }

  /**
   * @returns {number}
   */
  count () {
    const invokable = elements => {
      let total = 0

      elements.forEach(item => {
        total += 1

        if (this.isNode(item)) {
          total += invokable(item[this.childKey])
        }
      })

      return total
    }

    return invokable(this.collection)
  }

  /**
   * @param {Object|string|number} toFind
   * @returns {number}
   */
  countFrom (toFind) {
    toFind = this.find(toFind)

    const counter = (elements, total = 0) => {
      elements.forEach(item => {
        total += 1

        if (this.isNode(item)) {
          total += counter(item[this.childKey], total)
        }
      })

      return total
    }

    if (toFind && this.isNode(toFind)) {
      return counter(toFind[this.childKey])
    }

    return 0
  }

  /**
   * @param {Object|string|number} toFind
   * @returns {?Object}
   */
  find (toFind) {
    const invokable = (elements, parent = null) => {
      let found = null

      elements.some(item => {
        if (found !== null) {
          return false
        }

        if (this.isTheOne(toFind, item)) {
          found = item

          return false
        } else if (this.isNode(item)) {
          found = invokable(item[this.childKey], item)

          return found !== null
        }
      })

      return found
    }

    return invokable(this.collection)
  }

  /**
   * @param {Object|string|number} toFind
   * @returns {?Object}
   */
  findSiblings (toFind) {
    toFind = this.find(toFind)

    let siblings = {
      prevItem: null,
      nextItem: null
    }

    if (!toFind) {
      return siblings
    }

    let collection = toFind._parent ? this.find(toFind._parent)[this.childKey] : this.collection
    let index = collection.indexOf(toFind)

    if (index === -1) {
      return siblings
    }

    siblings.nextItem = collection[index + 1] || null
    siblings.prevItem = collection[index - 1] || null

    return siblings
  }

  /**
   * @param {Object|string|number} toFind
   * @returns {?Object}
   */
  findParent (toFind) {
    toFind = this.find(toFind)

    if (toFind && toFind._parent) {
      return this.find(toFind._parent)
    }

    return null
  }

  /**
   * @param {Object|string|number} toFind
   * @returns {?Object}
   */
  findAncestor (toFind) {
    toFind = this.find(toFind)

    const finder = element => {
      if (element._parent) {
        return finder(this.find(element._parent))
      }

      return element
    }

    if (toFind) {
      return finder(toFind)
    }

    return null
  }

  /**
   * @param {Object|string|number} toFind
   * @param {function} updater
   * @returns {EntriesTree}
   */
  update (toFind, updater) {
    toFind = this.find(toFind)

    const invokable = (elements) => {
      let stack = []

      elements.forEach(item => {
        if (this.isTheOne(toFind, item)) {
          item = updater(item)
        }

        if (this.isNode(item)) {
          item[this.childKey] = invokable(item[this.childKey])
        }

        stack.push(item)
      })

      return stack
    }

    if (toFind) {
      this.setCollection(invokable(this.collection))
    }

    return this
  }

  /**
   * @param {Object|string|number} toFind
   * @returns {?Object}
   */
  delete (toFind) {
    toFind = this.find(toFind)

    let deleted = null

    const invokable = (elements) => {
      let stack = []

      elements.forEach(item => {
        if (this.isTheOne(toFind, item)) {
          deleted = item

          return
        }

        if (this.isNode(item)) {
          item[this.childKey] = invokable(item[this.childKey])
        }

        stack.push(item)
      })

      return stack
    }

    if (toFind) {
      this.setCollection(invokable(this.collection))
    }

    return deleted
  }

  /**
   * @param {Object|string|number} toFind
   * @param {Object} toInsert
   * @returns {EntriesTree}
   */
  insertAfter (toFind, toInsert) {
    toFind = this.find(toFind)

    let parentCollection = toFind._parent ? this.findParent(toFind)[this.childKey] : this.collection
    parentCollection.splice(parentCollection.indexOf(toFind) + 1, 0, toInsert)

    if (toFind._parent) {
      this.update(toFind._parent, (item) => {
        item[this.childKey] = parentCollection
        return item
      })

      return this
    }

    return this.setCollection(parentCollection)
  }

  /**
   * @param {Object|string|number} toFind
   * @param {Object} toInsert
   * @returns {EntriesTree}
   */
  insertBefore (toFind, toInsert) {
    toFind = this.find(toFind)

    let parentCollection = toFind._parent ? this.findParent(toFind)[this.childKey] : this.collection
    parentCollection.splice(parentCollection.indexOf(toFind), 0, toInsert)

    if (toFind._parent) {
      this.update(toFind._parent, (item) => {
        item[this.childKey] = parentCollection
        return item
      })

      return this
    }

    return this.setCollection(parentCollection)
  }
}

export default class EntriesTree {
  #collection = []
  #itemKey = 'id'
  #childKey = 'children'

  /**
   * @constructor
   * @param {Object[]} collection
   * @param {?string} itemKey
   * @param {?string} childKey
   */
  constructor (collection = [], itemKey = 'id', childKey = 'children') {
    this.#itemKey = itemKey
    this.#childKey = childKey
    this.#setCollection(collection)
  }

  /**
   * @returns {Object[]}
   */
  getCollection () {
    return this.#collection
  }

  /**
   * @param {Object[]} collection
   * @returns {EntriesTree}
   */
  #setCollection (collection) {
    this.#collection = this.#parentize(collection)

    return this
  }

  /**
   * @param {Object|number|string} findable
   * @param {Object} comparable
   * @returns {boolean}
   */
  #isTheOne (findable, comparable) {
    if (typeof findable === 'object') {
      return findable[this.#itemKey] === comparable[this.#itemKey]
    }

    return findable === comparable[this.#itemKey]
  }

  /**
   * @param {Object} item
   * @returns {boolean}
   */
  #isNode (item) {
    return item.hasOwnProperty(this.#childKey)
  }

  /**
   * @param {Object[]} elements
   * @returns {Object[]}
   */
  #parentize (elements) {
    const invokable = (elements, parent = null) => {
      let stack = []

      elements.forEach(item => {
        item._parent = parent ? parent[this.#itemKey] : null
        item._deepness = parent ? parent._deepness + 1 : 0

        if (this.#isNode(item)) {
          item[this.#childKey] = invokable(item[this.#childKey], item)
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

        if (this.#isNode(item)) {
          stack = invokable(item[this.#childKey], stack)
        }
      })

      return stack
    }

    return invokable(this.#collection)
  }

  /**
   * @returns {number}
   */
  count () {
    const invokable = elements => {
      let total = 0

      elements.forEach(item => {
        total += 1

        if (this.#isNode(item)) {
          total += invokable(item[this.#childKey])
        }
      })

      return total
    }

    return invokable(this.#collection)
  }

  /**
   * @param {Object|string|number} toFind
   * @returns {?Object}
   */
  find (toFind) {
    const invokable = (toFind, elements, parent = null) => {
      let found = null

      elements.some(item => {
        if (found !== null) {
          return false
        }

        if (this.#isTheOne(toFind, item)) {
          found = item

          return false
        } else if (this.#isNode(item)) {
          found = invokable(toFind, item[this.#childKey], item)

          return found !== null
        }
      })

      return found
    }

    return invokable(toFind, this.#collection)
  }

  /**
   * @param {Object|string|number} toFind
   * @param {function} updater
   * @returns {EntriesTree}
   */
  update (toFind, updater) {
    toFind = this.find(toFind)

    const invokable = (updater, elements) => {
      let stack = []

      elements.forEach(item => {
        if (this.#isTheOne(toFind, item)) {
          item = updater(item)
        }

        if (this.#isNode(item)) {
          item[this.#childKey] = invokable(updater, item[this.#childKey])
        }

        stack.push(item)
      })

      return stack
    }

    if (toFind) {
      this.#setCollection(invokable(updater, this.#collection))
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
        if (this.#isTheOne(toFind, item)) {
          deleted = item

          return
        }

        if (this.#isNode(item)) {
          item[this.#childKey] = invokable(item[this.#childKey])
        }

        stack.push(item)
      })

      return stack
    }

    if (toFind) {
      this.#setCollection(invokable(this.#collection))
    }

    return deleted
  }

  /**
   * @param {Object|string|number} toFind
   * @returns {?Object}
   */
  parent (toFind) {
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
  siblings (toFind) {
    toFind = this.find(toFind)

    let siblings = {
      prevItem: null,
      nextItem: null
    }

    if (!toFind) {
      return siblings
    }

    let collection = toFind._parent ? this.find(toFind._parent)[this.#childKey] : this.#collection
    let index = collection.indexOf(toFind)

    if (index === -1) {
      return siblings
    }

    siblings.nextItem = collection[index + 1] || null
    siblings.prevItem = collection[index - 1] || null

    return siblings
  }
}

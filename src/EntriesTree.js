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
    this.setCollection(collection)
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
  setCollection (collection) {
    this.#collection = this.parentize(collection)

    return this
  }

  /**
   * @param {Object|number|string} findable
   * @param {Object} comparable
   * @returns {boolean}
   */
  isTheOne (findable, comparable) {
    if (typeof findable === 'object') {
      return findable[this.#itemKey] === comparable[this.#itemKey]
    }

    return findable === comparable[this.#itemKey]
  }

  /**
   * @param {Object} item
   * @returns {boolean}
   */
  isNode (item) {
    return item.hasOwnProperty(this.#childKey)
  }

  /**
   * @param {Object[]} elements
   * @returns {Object[]}
   */
  parentize (elements) {
    const invokable = (elements, parent = null) => {
      let stack = []

      elements.forEach(item => {
        if (parent) {
          item._parentId = parent !== null ? parent[this.#itemKey] : null
          item._hasSiblings = parent !== null ? parent.hasOwnProperty(this.#childKey) : null
        }

        if (this.isNode(item)) {
          item[this.#childKey] = invokable(item[this.#childKey], item)
        }

        stack.push(item)
      })

      return stack
    }

    return invokable(elements)
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

        if (this.isTheOne(toFind, item)) {
          found = item

          return false
        } else if (this.isNode(item)) {
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
    const invokable = (toFind, updater, elements) => {
      let stack = []

      elements.forEach(item => {
        if (this.isTheOne(toFind, item)) {
          item = updater(item)
        }

        if (this.isNode(item)) {
          item[this.#childKey] = invokable(toFind, updater, item[this.#childKey])
        }

        stack.push(item)
      })

      return stack
    }

    this.setCollection(invokable(toFind, updater, this.#collection))

    return this
  }

	/**
	 * @todo
	 * @param {Object|string|number} block
	 */
  delete (block) {

  }

	/**
	 * @param {Object|string|number} block
	 * @returns {?Object}
	 */
  parent (block) {
    block = this.find(block)

    if (block._parentId) {
      return this.find(block._parentId)
    }

    return null
  }
}

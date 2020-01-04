class DoublyLinkedList {
  constructor(array) {
    this.head = null
    this.tail = null
    this.length = 0

    if (array) {
      for (let i = 0; i < array.length; i++) {
        const a = array[i]
        this.push(a)
      }
    }
  }

  push(val) {
    if (this.length === 0) {
      const head = {
        val,
        next: null,
        prev: null
      }

      this.head = head
      this.tail = head
    } else {
      const newTail = {
        val,
        next: null,
        prev: this.tail
      }

      this.tail.next = newTail
      this.tail = newTail
    }
    this.length++
    return this.length
  }

  pop() {
    if (this.length === 0) {
      return undefined
    } else if (this.length === 1) {
      const val = this.head.val
      this.head = null
      this.tail = null
      this.length--
      return val
    } else {
      const newTail = this.tail.prev
      const val = this.tail.val
      this.tail = newTail
      this.length--
      return val
    }
  }

  unshift(val) {
    if (this.length === 0) {
      const head = {
        val,
        next: null,
        prev: null
      }

      this.head = head
      this.tail = head
    } else {
      const newHead = {
        val,
        next: this.head,
        prev: null
      }
      this.head.prev = newHead
      this.head = newHead
    }
    this.length++
    return this.length
  }

  shift() {
    if (this.length === 0) {
      return undefined
    } else if (this.length === 1) {
      const val = this.head.val
      this.head = null
      this.tail = null
      this.length--
      return val
    } else {
      const newHead = this.head.next
      const val = this.head.val
      this.head = newHead
      this.length--
      return val
    }
  }

  includes(val) {
    let current = this.head
    while (current !== null) {
      if (current.val === val) {
        return true
      }
      current = current.next
    }
    return false
  }

  reverse() {
    if (this.length <= 1) {
      return
    }

    let prev = null
    let current = this.tail
    while (current !== this.head) {
      const follower = current.prev
      current.next = current.prev
      current.prev = prev
      prev = current
      current = follower
    }
    this.head.next = null
    this.head.prev = prev

    // swap head and tail
    this.tail.prev = null
    const temp = this.tail
    this.tail = this.head
    this.head = temp

    return this
  }

  map(f) {
    const newList = new DoublyLinkedList()
    let current = this.head
    let i = 0
    while (current) {
      const mappedVal = f(current.val, i++)
      newList.push(mappedVal)
      current = current.next
    }
    return newList
  }

  filter(f) {
    const newList = new DoublyLinkedList()
    let current = this.head
    let i = 0
    while (current) {
      if (f(current.val, i++)) {
        newList.push(current.val)
      }
      current = current.next
    }
    return newList
  }

  forEach(f) {
    let current = this.head
    let i = 0
    while (current) {
      f(current.val, i++)
      current = current.next
    }
  }

  reduce(f, initialValue) {
    let accumulator = initialValue
    let current = this.head
    let i = 0
    while (current) {
      accumulator = f(accumulator, current.val, i++)
      current = current.next
    }
    return accumulator
  }

  find(f) {
    let current = this.head
    while (current) {
      if (f(current.val)) {
        return current.val
      }
      current = current.next
    }
  }

  concat(otherList) {
    const newList = new DoublyLinkedList()
    let current = this.head
    while (current) {
      if (f(current.val)) {
        newList.push(current)
      }
      current = current.next
    }
    current = otherList.head
    while (current) {
      if (f(current.val)) {
        newList.push(current)
      }
      current = current.next
    }
    return newList
  }

  toArray() {
    const array = []
    let current = this.head
    while (current) {
      array.push(current.val)
      current = current.next
    }
    return array
  }
}


module.exports = DoublyLinkedList

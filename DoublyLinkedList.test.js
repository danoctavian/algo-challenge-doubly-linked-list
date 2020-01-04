const DoublyLinkedList = require('./DoublyLinkedList')
const jsc = require('jsverify')
const lodash = require('lodash')


const arbitraryArrayOperations = jsc.bless({
  generator: jsc.generator.bless(function () {
    switch (jsc.random(0, 3)) {
      case 0: return {
        op: 'push',
        val: jsc.random(0, 100)
      }
      case 1: return {
        op: 'pop',
      }
      case 2: return {
        op: 'shift'
      }
      case 3: return {
        op: 'unshift',
        val: jsc.random(0, 100)
      }
    }
  })
})

describe('DoublyLinkedList jsverify', () => {
   jsc.property('has correct length', jsc.array(jsc.int32), arr => {
     const list = new DoublyLinkedList(arr)
     return lodash.isEqual(list.length, arr.length)
   })

   jsc.property('converts to array', jsc.array(jsc.int32), arr => {
     const list = new DoublyLinkedList(arr)
     return lodash.isEqual(list.toArray(), arr)
   })

  jsc.property('check for includes', jsc.array(jsc.int8), jsc.int8, (arr, elemToCheck) => {
    const list = new DoublyLinkedList(arr)
    return list.includes(elemToCheck) === arr.includes(elemToCheck)
  })

  jsc.property('supports arbitrary sequences of array mutation operations',
    jsc.array(jsc.int8), jsc.array(arbitraryArrayOperations), (arr, operations) => {
    arr = arr.slice(0, 100)
    operations = operations.slice(0, 100)
    const list = new DoublyLinkedList(arr)
    for (let i = 0; i < operations.length; i++) {
      const operation = operations[i]
      const r1 = list[operation.op](operation.val)
      const r2 = arr[operation.op](operation.val)
      if (!lodash.isEqual(r1, r2) || !lodash.isEqual(list.toArray(), arr)) {
        return false
      }
    }
    return true
  })

  jsc.property('executes map function like an Array', jsc.array(jsc.uint32), (arr) => {
    const mappingFunction = x => x + 32
    const mappedArray = arr.map(mappingFunction)
    const list = new DoublyLinkedList(arr)
    const mappedList = list.map(mappingFunction)
    return lodash.isEqual(mappedArray, mappedList.toArray())
  })

  jsc.property('executes filter function like an Array', jsc.array(jsc.uint32), (arr) => {
    const filterFunction = x => x % 3 === 0
    const filteredArray = arr.filter(filterFunction)
    const list = new DoublyLinkedList(arr)
    const filteredList = list.filter(filterFunction)
    return lodash.isEqual(filteredArray, filteredList.toArray())
  })

  const BIG_PRIME = 10 ** 9 + 7
  jsc.property('executes reduce function like an Array', jsc.array(jsc.uint32), (arr) => {
    const reduceFunction = (a, b) => (a + b) % BIG_PRIME
    const reducedFromArray = arr.reduce(reduceFunction, 0)
    const list = new DoublyLinkedList(arr)
    const reducedFromList = list.reduce(reduceFunction, 0)
    return lodash.isEqual(reducedFromArray, reducedFromList)
  })

  jsc.property('executes find function like an Array', jsc.array(jsc.uint8), jsc.uint8, (arr, findElement) => {
    const findFunction = x => x === findElement
    const foundFromArray = arr.find(findFunction)
    const list = new DoublyLinkedList(arr)
    const foundFromList = list.find(findFunction)
    return lodash.isEqual(foundFromArray, foundFromList)
  })

  jsc.property('executes forEach function like an Array', jsc.array(jsc.uint32), (arr) => {
    const transform = x => x + 21
    let forEachedFromArray = []
    arr.forEach(x => {
      forEachedFromArray.push(transform(x))
    })

    const list = new DoublyLinkedList(arr)
    let forEachedFromList = []
    list.forEach(x => {
      forEachedFromList
      forEachedFromList.push(transform(x))
    })
    return lodash.isEqual(forEachedFromArray, forEachedFromList)
  })

  jsc.property('executes reverse function like an Array', jsc.array(jsc.uint32), (arr) => {
    const arrCloneReversed = lodash.cloneDeep(arr)
    arrCloneReversed.reverse()
    const list = new DoublyLinkedList(arr)
    list.reverse()
    return lodash.isEqual(arrCloneReversed, list.toArray())
  })

  jsc.property('reversing the list twice results into the original list', jsc.array(jsc.uint32), (arr) => {
    const arrClone = lodash.cloneDeep(arr)
    const list = new DoublyLinkedList(arr)
    list.reverse()
    list.reverse()
    return lodash.isEqual(arrClone, list.toArray())
  })
})

describe('DoublyLinkedList', () => {
  test('Initializes to a length = 0', () => {
    const list = new DoublyLinkedList()
    expect(list.length).toBe(0)
  })

  test('Pushes 1 element to a length = 1', () => {
    const list = new DoublyLinkedList()
    list.push(13)
    expect(list.length).toBe(1)
  })

  test('Pushes 2 element to a length = 2', () => {
    const list = new DoublyLinkedList()
    list.push(13)
    list.push(14)
    expect(list.length).toBe(2)
  })

  test('Pushes 5 elements to a length = 5', () => {
    const list = new DoublyLinkedList()
    list.push(13)
    list.push(14)
    list.push(15)
    list.push(15)
    list.push(15)
    expect(list.length).toBe(5)
  })

  test('Pops from empty list getting undefined', () => {
    const list = new DoublyLinkedList()
    const result = list.pop()
    expect(result).toBeUndefined()
  })

  test('Pops 1 pushed element from a length = 1 list', () => {
    const list = new DoublyLinkedList()
    const e1 = 13
    list.push(e1)
    const result = list.pop()
    expect(list.length).toBe(0)
    expect(result).toBe(e1)
  })

  test('Pops 1 pushed element from a length = 2 list', () => {
    const list = new DoublyLinkedList()
    const e1 = 13
    const e2 = 14
    list.push(e1)
    list.push(e2)
    const result = list.pop()
    expect(list.length).toBe(1)
    expect(result).toBe(e2)
  })

  test('Pops 1 pushed element from a length = 3 list', () => {
    const list = new DoublyLinkedList()
    const e1 = 13
    const e2 = 14
    const e3 = 15
    list.push(e1)
    list.push(e2)
    list.push(e3)
    const result = list.pop()
    expect(list.length).toBe(2)
    expect(result).toBe(e3)
  })

  test('Pops all pushed elements from a length = 3 list', () => {
    const list = new DoublyLinkedList()
    const e1 = 13
    const e2 = 14
    const e3 = 15
    list.push(e1)
    list.push(e2)
    list.push(e3)
    let result = list.pop()
    expect(result).toBe(e3)
    result = list.pop()
    expect(result).toBe(e2)
    result = list.pop()
    expect(result).toBe(e1)
    expect(list.length).toBe(0)
  })

  test('Pops all pushed elements from a length = 3 list 2 times i a row', () => {
    const list = new DoublyLinkedList()

    for (let i = 0; i < 2; i++) {
      const e1 = 13
      const e2 = 14
      const e3 = 15
      list.push(e1)
      list.push(e2)
      list.push(e3)
      let result = list.pop()
      expect(result).toBe(e3)
      result = list.pop()
      expect(result).toBe(e2)
      result = list.pop()
      expect(result).toBe(e1)
      expect(list.length).toBe(0)
    }

  })

  test('Unshifts 1 element to a length = 1', () => {
    const list = new DoublyLinkedList()
    list.unshift(13)
    expect(list.length).toBe(1)
  })

  test('Unshifts 2 elements to a length = 2', () => {
    const list = new DoublyLinkedList()
    list.unshift(13)
    list.unshift(14)
    expect(list.length).toBe(2)
  })

  test('Unshifts 5 elements to a length = 5', () => {
    const list = new DoublyLinkedList()
    list.unshift(13)
    list.unshift(14)
    list.unshift(15)
    list.unshift(15)
    list.unshift(15)
    expect(list.length).toBe(5)
  })

  test('Shifts from empty list getting undefined', () => {
    const list = new DoublyLinkedList()
    const result = list.shift()
    expect(result).toBeUndefined()
  })

  test('Shifts 1 unshifted element from a length = 1 list', () => {
    const list = new DoublyLinkedList()
    const e1 = 13
    list.unshift(e1)
    const result = list.shift()
    expect(list.length).toBe(0)
    expect(result).toBe(e1)
  })

  test('Unshifts 1 pushed element from a length = 2 list', () => {
    const list = new DoublyLinkedList()
    const e1 = 13
    const e2 = 14
    list.unshift(e1)
    list.unshift(e2)
    const result = list.shift()
    expect(list.length).toBe(1)
    expect(result).toBe(e2)
  })

  test('Shifts 1 unshifted element from a length = 3 list', () => {
    const list = new DoublyLinkedList()
    const e1 = 13
    const e2 = 14
    const e3 = 15
    list.unshift(e1)
    list.unshift(e2)
    list.unshift(e3)
    const result = list.shift()
    expect(list.length).toBe(2)
    expect(result).toBe(e3)
  })

  test('Unshifts all shifted elements from a length = 3 list', () => {
    const list = new DoublyLinkedList()
    const e1 = 13
    const e2 = 14
    const e3 = 15
    list.unshift(e1)
    list.unshift(e2)
    list.unshift(e3)
    let result = list.shift()
    expect(result).toBe(e3)
    result = list.shift()
    expect(result).toBe(e2)
    result = list.shift()
    expect(result).toBe(e1)
    expect(list.length).toBe(0)
  })

  test('Shifts all unshifted elements from a length = 3 list 2 times i a row', () => {
    const list = new DoublyLinkedList()

    for (let i = 0; i < 2; i++) {
      const e1 = 13
      const e2 = 14
      const e3 = 15
      list.unshift(e1)
      list.unshift(e2)
      list.unshift(e3)
      let result = list.shift()
      expect(result).toBe(e3)
      result = list.shift()
      expect(result).toBe(e2)
      result = list.shift()
      expect(result).toBe(e1)
      expect(list.length).toBe(0)
    }
  })

  test('shifts pushed elements from a length = 3', () => {
    const list = new DoublyLinkedList()
    const e1 = 13
    const e2 = 14
    const e3 = 15
    list.push(e1)
    list.push(e2)
    list.push(e3)
    let result = list.shift()
    expect(result).toBe(e1)
    result = list.shift()
    expect(result).toBe(e2)
    result = list.shift()
    expect(result).toBe(e3)
    expect(list.length).toBe(0)
  })

  test('pops an unshifted element', () => {
    const list = new DoublyLinkedList()
    const e1 = 13
    list.unshift(e1)
    let result = list.pop()
    expect(result).toBe(e1)
  })

  test('pops unshifted elements from a length = 3', () => {
    const list = new DoublyLinkedList()
    const e1 = 13
    const e2 = 14
    const e3 = 15
    list.unshift(e1)
    list.unshift(e2)
    list.unshift(e3)
    let result = list.pop()
    expect(result).toBe(e1)
    result = list.pop()
    expect(result).toBe(e2)
    result = list.pop()
    expect(result).toBe(e3)
    expect(list.length).toBe(0)
  })

  test('creates list from array', () => {
    const array = [1, 2, 3, 4, 5, 6, 7]
    const list = new DoublyLinkedList(array)
    expect(list.length).toBe(array.length)
    expect(list.shift()).toEqual(array.shift())
    expect(list.shift()).toEqual(array.shift())

    expect(list.pop()).toEqual(array.pop())
    expect(list.pop()).toEqual(array.pop())
  })

  test('creates array from list', () => {
    const array = [1, 2, 3, 4, 5, 6, 7]
    const list = new DoublyLinkedList(array)
    expect(list.toArray()).toEqual(array)
  })

  test('creates  empty array from empty list', () => {
    const array = []
    const list = new DoublyLinkedList(array)
    expect(list.toArray()).toEqual(array)
  })

  test('creates  1 elem array from 1 elem list', () => {
    const array = [0]
    const list = new DoublyLinkedList(array)
    expect(list.toArray()).toEqual(array)
  })

  test('checks for element inclusion', () => {
    const array = [1, 2, 3, 4, 5, 6, 7]
    const list = new DoublyLinkedList(array)
    expect(list.includes(5)).toBe(true)
    expect(list.includes(1)).toBe(true)
    expect(list.includes(7)).toBe(true)
    expect(list.includes(21)).toBe(false)
    expect(list.includes(0)).toBe(false)
  })

  test('checks for element inclusion on empty array', () => {
    const array = []
    const list = new DoublyLinkedList(array)
    expect(list.includes(21)).toBe(false)
    expect(list.includes(0)).toBe(false)
  })

  test('checks for element inclusion on 1 element array', () => {
    const array = [1]
    const list = new DoublyLinkedList(array)
    expect(list.includes(1)).toBe(true)
    expect(list.includes(23)).toBe(false)
    expect(list.includes(0)).toBe(false)
  })

  test('checks for element inclusion on 1 element array', () => {
    const array = [1]
    const list = new DoublyLinkedList(array)
    expect(list.includes(1)).toBe(true)
    expect(list.includes(23)).toBe(false)
    expect(list.includes(0)).toBe(false)
  })
})

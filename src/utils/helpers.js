import { compose, join, split, map } from 'ramda'

const utf16LeToString = part => Buffer.from(part, 'hex').toString('utf16le')

const refSecurableToString = (securable = '') =>
  compose(join('/'), map(utf16LeToString), split('/'))(securable)

const demasker = bitmask => arr =>
  arr.reduce((acc, current) => {
    if (bitmask & current.bit) {
      acc.push(current)
    }
    return acc
  }, [])

const finding = id => group => group.find(member => member.id === id)

export { refSecurableToString, demasker, finding }

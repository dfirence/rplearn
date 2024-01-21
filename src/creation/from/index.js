import { from } from 'rxjs'
import { show } from '../../common/callbacks.js'

/**
 * The from Array function shows how to use the `from  rxjs operator
 * and subscribe to its resultant observable.
 *
 * The resultant observable is an rxjs object type `subscription` where
 * few methods are available, like the `unsubscribe` method.
 *
 * @param {Array} array of any values
 * @returns
 */
const fromArray = array => {
  const source$ = from(array).subscribe(show)
  source$.unsubscribe()
}

const fromManyArrays = many => {
  const source$ = from(many).subscribe(show)
  source$.unsubscribe()
}

const fromString = string => {
  const source$ = from(string).subscribe(show)
  source$.unsubscribe()
}

const fromSet = _set => {
  const source$ = from(_set).subscribe(show)
  source$.unsubscribe()
}
// Any primitive that has a .length property
// can work with the rxjs `from()` operator.
const main = () => {
  const zeros = Array(10).fill(0)
  fromArray(zeros)

  // The rxjs `from()` operator does not flatten nested arrays
  const manyArrays = [
    [1, 2, 3],
    [2, 4, 6],
    [5, 7, 9]
  ]
  fromManyArrays(manyArrays)

  const string = 'Lorem Ipsum'
  fromString(string)

  const s = new Set(['a', 'b', 'c'])
  fromSet(s)
}
main()

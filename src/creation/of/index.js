import { of } from 'rxjs'
import { findIndex } from 'rxjs/operators'
import { show } from '../../common/callbacks.js'

// The rxjs `of()` operator is `synchronous`.

const ofArray = array => {
  // The rxjs `of()` operator does not flatten array or object inputs.
  // It emmits each value supplied in its natural state.
  //
  console.log(`\nArray Input to 'of()'\n`)
  const source$ = of(array)
  const subscription = source$.subscribe(show)
  subscription.unsubscribe()
}

const ofSequence = () => {
  console.log(`\nSequence with 'of()'\n`)
  const source$ = of(9, 8, 7, 6, 5)
  const subscription = source$.subscribe(show)
  subscription.unsubscribe()
}

const ofWithIndex = () => {
  console.log(`\nEmmit Index Value of First Odd Item\n`)
  const source$ = of(9, 8, 7, 6, 5).pipe(findIndex(x => x % 3 === 0))
  const subscription = source$.subscribe(show)
  subscription.unsubscribe()
}
const main = () => {
  const array = [1, 2, 3, 4, 5]
  ofArray(array)
  ofSequence()
  ofWithIndex()
}
main()

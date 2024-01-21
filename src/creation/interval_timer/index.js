import { interval, map, take, timer } from 'rxjs'
import { show } from '../../common/callbacks.js'

const ONE_SEC = 1000

const everyTwoSeconds = () => {
  const TWO_SECONDS = ONE_SEC * 2
  const TEN_SECONDS = TWO_SECONDS * 5
  const obs$ = interval(TWO_SECONDS).subscribe(show)
  setTimeout(() => {
    obs$.unsubscribe()
    console.log(`Stopped Subscription A`)
  }, TEN_SECONDS)
}

const takeFive = () => {
  console.log(`\nTaking Five`)
  const obs$ = interval(ONE_SEC)
    .pipe(take(5))
    .pipe(map(x => x * x))
    .subscribe(show)
}

const useTimer = () => {
  // Produce sequences of computations using a Timer.
  // The rxjs `timer()` operator produces iterations
  // when using the params, the first param is immediate first value
  // and the second param is subsequent delay to emit the rest of the
  // values.
  //
  console.log(`\nTaking Five With Timer`)
  const THREE_SECONDS = ONE_SEC * 3
  const obs$ = timer(0, THREE_SECONDS)
    .pipe(map(x => x * x))
    .pipe(take(5))
    .pipe(
      map(x => {
        const m = `Item ${x} => ${x / 2}`
        return m
      })
    )
    .subscribe(show)
}

const main = () => {
  everyTwoSeconds()
  setTimeout(() => {
    takeFive()
  }, ONE_SEC * 10)
  setTimeout(() => {
    useTimer()
  }, ONE_SEC * 20)
}
main()

import { from, of } from 'rxjs'
import { concatMap, delay, filter, map, mergeMap, take } from 'rxjs/operators'
import data from '../datasamples/dc1.json' assert { type: 'json' }

const cbShowProcessNames = record => {
  const time = record.context.time_generated
  const pid = record.context.pid
  const pguid = record.context.scguid
  const process = record.context.process
  console.log(`${time}|${pguid}|${pid}|${process}`)
}

const emitUniqueValuesWithDelay = collection => {
  const DELAY = 50
  const cache = new Set()
  const source$ = from(collection)
    // Take the all item from the collection, emmits complete
    .pipe(take(collection.length))
    // Transform collection
    .pipe(
      // Extract the sub array of sysmon entries
      mergeMap(records => from(records.Sysmon)),
      // Select only the processes that are not in the cache by guid
      filter(record => !cache.has(record.context.scguid)),
      // Update cache and return the sysmon entry
      map(record => {
        cache.add(record.context.scguid)
        return record
      }),
      concatMap(record => of(record).pipe(delay(DELAY)))
    )
    .subscribe(cbShowProcessNames)
}
const main = () => {
  emitUniqueValuesWithDelay(data)
}

main()

#! /usr/bin/env node

'use strict'

import { from, of } from 'rxjs'
import { concatMap, delay, filter, map, take } from 'rxjs/operators'

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
  const collection_size = collection.length
  const source$ = from(collection)
    // Transform collection
    .pipe(
      // Take the all items from the collection, emmits complete
      take(collection_size),
      // Extract the sub array of sysmon entries
      concatMap(records => records.Sysmon),
      // Select only the processes that are not in the cache by guid
      filter(record => !cache.has(record.context.scguid)),
      // Update cache and return the sysmon entry
      map(record => {
        cache.add(record.context.scguid)
        return record
      }),
      // Emit record based on DELAY
      concatMap(record => of(record).pipe(delay(DELAY)))
    )
    .subscribe(cbShowProcessNames)
}

// Entry Point
const main = () => {
  emitUniqueValuesWithDelay(data)
}

main()

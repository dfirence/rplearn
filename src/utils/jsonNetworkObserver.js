#! /usr/bin/env node

'use strict'

import { Axios } from 'axios-observable'
import { from, interval, of } from 'rxjs'
import { concatMap, delay, filter, map, take } from 'rxjs/operators'

const cbShowProcessNames = record => {
  const time = record.context.time_generated
  const pid = record.context.pid
  const pguid = record.context.scguid
  const process = record.context.process
  console.log(`${time}|${pguid}|${pid}|${process}`)
}

const flattenApiResponse = x => {
  let response_size = x.data.length
  return from(x.data).pipe(
    take(response_size),
    concatMap(x => from(x.Sysmon))
  )
}
const fetchData = url => {
  const DELAY = 50
  const INTERVAL = 10_000
  // Run every N seconds
  const cycles$ = interval(INTERVAL)
  // Initiate Recurring Run
  cycles$.subscribe(() => {
    // Clear Screen
    console.clear()
    // Initiate a New Cache
    const cache = new Set()
    // Initiate a Network Get Request
    const source$ = Axios.get(url)
      .pipe(
        // Flatten Network Api Response
        concatMap(x => flattenApiResponse(x)),
        // Exclude Sysmon Events By Process Guid
        filter(x => !cache.has(x.context.scguid)),
        // Update Cache with New Process & Return Record
        map(x => {
          cache.add(x.context.scguid)
          return x
        }),
        // Emit every record on a set Delay
        concatMap(x => of(x).pipe(delay(DELAY)))
      )
      .subscribe(cbShowProcessNames)
  })
}
const main = () => {
  const URL =
    'https://raw.githubusercontent.com/dfirence/rplearn/main/src/datasamples/dc1.json'
  fetchData(URL)
}

main()

/**
Output
2023-12-17T18:54:13.490Z|4dcf82ed-4f43-49b1-aa1b-eb7c356e4072|964|svchost.exe
2023-12-17T18:54:14.287Z|ba6c84ac-a6e6-497f-a1e9-7323903ef010|1984|svchost.exe
2023-12-17T18:54:14.740Z|4712043c-339c-4a56-8045-192fb09e74e4|616|wmiprvse.exe
2023-12-17T18:54:21.271Z|a59018ec-b0f6-4a55-8087-9a0bb85d840a|1848|svchost.exe
2023-12-17T18:54:21.282Z|bd4d3dce-6ad1-4e76-b50b-62ea8c5a49aa|1096|svchost.exe
2023-12-17T18:56:41.365Z|bddae57b-0637-494b-ad47-4097bd472dac|2860|taskhostw.exe
2023-12-17T18:56:41.381Z|1a36332d-5a78-4177-890e-f67372706227|1460|svchost.exe
2023-12-17T18:56:46.225Z|1333a10c-b824-4cb6-822f-dd3242661b23|1932|ctfmon.exe
2023-12-17T18:57:00.693Z|60012980-e58c-47b3-abe1-307a7b6002cd|1780|dfsrs.exe
2023-12-17T18:57:51.615Z|1883486f-1834-4149-85ce-d9fe008a713e|800|svchost.exe
2023-12-17T18:57:53.459Z|e9390c8e-20b0-4455-a436-1696969d68ce|1244|svchost.exe
2023-12-17T18:57:54.203Z|5bdb4864-3edc-4668-8062-0379d19d7569|1252|svchost.exe
2023-12-17T18:57:55.537Z|4f3bab16-00de-4a83-bc63-19ac49fb20a3|3284|svchost.exe
2023-12-17T18:57:56.987Z|04bbdfa6-5fe2-427f-bc6c-5a221f150b4f|1600|cmd.exe
2023-12-17T18:57:57.007Z|2333dc4d-c26a-4e4b-b663-9a6f0cdcbe61|4800|conhost.exe
2023-12-17T18:58:01.704Z|f8303493-0d1c-4667-9fa3-076131446848|3304|ipconfig.exe
2023-12-17T18:58:12.225Z|ef0d484d-9d83-4aab-81ce-0dd8d071be92|1764|taskhostw.exe
 */

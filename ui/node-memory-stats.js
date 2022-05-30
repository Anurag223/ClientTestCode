'use strict'
const v8 = require('v8')

const heepStats = v8.getHeapStatistics()


console.log(`Total Heap Size ~${(heepStats.total_heap_size/1024/1024/1024).toFixed(2)} GB`)
console.log(`Total Heap Size Executeabe ~${(heepStats.total_heap_size_executable/1024/1024/1024).toFixed(2)} GB`)
console.log(`Total Physical Size ~${(heepStats.total_physical_size/1024/1024/1024).toFixed(2)} GB`)
console.log(`Total Available Size ~${(heepStats.total_available_size/1024/1024/1024).toFixed(2)} GB`)
console.log(`Used Heap Size ~${(heepStats.used_heap_size/1024/1024/1024).toFixed(2)} GB`)
console.log(`Heap Size Limit ~${(heepStats.heap_size_limit/1024/1024/1024).toFixed(2)} GB`)
console.log(`Malloced Memory ~${(heepStats.malloced_memory/1024/1024/1024).toFixed(2)} GB`)
console.log(`Peak Malloced Memory ~${(heepStats.peak_malloced_memory/1024/1024/1024).toFixed(2)} GB`)
console.log(`Does Zap Garbage : ${heepStats.does_zap_garbage}`)
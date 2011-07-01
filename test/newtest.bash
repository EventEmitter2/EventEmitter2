#!/usr/bin/env bash
if [ -f newtest.tmp ] 
then
  rm -f newtest.tmp
fi

for i in 'benchmark-EE2A.js' 'benchmark-EE2C.js' 'benchmark-EE2D.js' 'benchmark-EE2B.js'
  do 
    nodeunit benchmarks/$i | sed '/32mOK/d' | sed '/^$/d' | sed 's/\[1m//g' | sed 's/\[22m//g' >> newtest.tmp
  done

less newtest.tmp

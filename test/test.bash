#!/usr/bin/env bash
if [ -f tmp.tmp ] 
then
  rm -f tmp.tmp
fi

stuff=`LS ./benchmarks/*.js`

for i in $stuff
  do 
    nodeunit $i | sed '/32mOK/d' | sed '/^$/d' | sed 's/\[1m//g' | sed 's/\[22m//g' >> tmp.tmp
  done

less tmp.tmp

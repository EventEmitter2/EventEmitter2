#!/usr/bin/env bash
if [ -f tmp.txt ] 
then
  rm -f tmp.txt
fi

stuff=`LS ./benchmarks/*.js`

for i in $stuff
  do 
    nodeunit $i | sed '/32mOK/d' | sed '/^$/d' | sed 's/\[1m//g' | sed 's/\[22m//g' >> tmp.txt
  done

less tmp.txt

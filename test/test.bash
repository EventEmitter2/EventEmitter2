#!/usr/bin/env bash
if [ -f tmp.txt ] 
then
  rm -f tmp.txt
fi

if [ `hash LS 2>&-` ] 
then
  stuff=`LS ./benchmarks/*.js`
else
  stuff=`ls ./benchmarks/*-1.js | sort -V`
  stuff2=`ls ./benchmarks/*-2.js | sort -V`
  stuff3=`ls ./benchmarks/*-3.js | sort -V`
  stuff4=`ls ./benchmarks/*-4.js | sort -V`
fi

for i in $stuff2 $stuff4
  do 
    nodeunit $i | sed '/32mOK/d' | sed '/^$/d' | sed 's/\[1m//g' | sed 's/\[22m//g' >> tmp.txt
  done

less tmp.txt

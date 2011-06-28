#!/usr/bin/env bash
if [ -f tmp.txt ] 
then
  rm -f tmp.txt
fi

if [ `hash LS 2>&-` ] 
then
  stuff=`LS ./benchmarks/`
else
  stuff=`ls ./benchmarks/ | sort -V`
fi

for i in $stuff
  do 
    nodeunit ./benchmarks/$i | sed "/assertions/d" | sed '/^$/d' | sed 's/\[1m//g' | sed 's/\[22m//g' >> tmp.txt
  done

less tmp.txt

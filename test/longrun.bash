#!/usr/bin/env bash
if [ -f newtest.tmp ] 
then
  rm -f newtest.tmp
fi

j="0"

echo '' >> newtest.tmp

while [ $j -lt 4 ]
do

echo '[' >> newtest.tmp

for i in 'benchmark-x_em.js' 'benchmark-x_cr.js'
  do 
    echo 'Running test against file '$i' (#'$j')'
    node benchmarks/$i | sed 's/^/  ["/g' | sed 's/$/], /g' | sed 's/ms/"/g' | sed 's/: /", "/g' >> newtest.tmp
  done

echo ']' >> newtest.tmp

if ( $i eq 1 )
  echo ',' >> newtest.tmp
fi

j=$[$j+1]
done

echo '' >> newtest.tmp

#less newtest.tmp

tail newtest.tmp | node average.js
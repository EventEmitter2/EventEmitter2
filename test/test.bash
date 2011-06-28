#!/usr/bin/env bash
rm -f tmp.txt
for i in `LS ./benchmarks/`; do nodeunit ./benchmarks/$i >> tmp.txt; done
less tmp.txt

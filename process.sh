file=`date +'%Y-%m-%d'`'.txt'

sort $file | uniq > tmp.txt
mv tmp.txt $file

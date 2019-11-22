file=$1
sed -i '/新闻标题：/d'  $1
sed -i '/总计：/d'  $1
sed -i '/评论:/d'  $1
sed -i '/原文链接：/d'  $1
sed -i 's/\t//g'  $1

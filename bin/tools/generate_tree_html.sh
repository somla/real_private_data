#!/bin/bash

cd "`dirname $0`/../..";
DIR_PROJ="`pwd`";

DIR_DOC="$DIR_PROJ/doc"
DIR_TREE="$DIR_DOC/tree"

mkdir -p "$DIR_TREE";
rm -r "$DIR_TREE"/*

function create_html {
    local dir="$1";
    local name="$2";
    shift; shift;
    echo "$dir -> $DIR_TREE/$name generating...";
    (tree "$dir" -I '*.pyc|__pycache__' -H "$dir" $@ | sed 's@\(href=.\)[.]/@\1../../@g') > "$DIR_TREE/$name";
}

cd "$DIR_PROJ";


create_html "./" "real_private_data.html" $@;
create_html "./src/python" "py_server.html" $@;
create_html "./src/web" "web.html" $@;
echo "README

THIS DIRECTORY IS GENERATED BY toos/generate_tree_html.sh at `date "+%Y-%m-%d %H:%M:%S"`
PLEASE DONT modify it
" > "$DIR_TREE/README.txt";
cp "$DIR_TREE/README.txt" "$DIR_TREE/DO_NOT_MODIFY_THIS_DIR.txt";
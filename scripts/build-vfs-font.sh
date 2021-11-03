#!/bin/sh

if [ -t 1 ]; then
	target="src/styles/vfs_fonts.js"
else
	target="/dev/stdout"
fi

(
	echo "this.pdfMake = this.pdfMake || {}; this.pdfMake.vfs = {"
	for file in "$@"; do
		file=$1
		filename=$(basename $file)
		filecontent=$(base64 -b 0 $file)
		shift
		echo "\"${filename}\":\"${filecontent}\""
		if [ "$#" -gt 0 ]; then
			echo ","
		fi
	done
	echo "};"
) > "$target"

# curl-headers-to-json

A tool to format the output of cURL headers into JSON.

Example:
```
curl -sSL -D - https://api.github.com -o /dev/null | npx curl-headers-to-json | jq
```
or if you grabbed the output already:
```
npx curl-headers-to-json headers.txt | jq
```
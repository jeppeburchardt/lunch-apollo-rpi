# lunch-apollo-rpi
lunch apollo chatbot

## start

Add env vars `ORDNUNG_USER` and `ORDNUNG_PASS` and run. Go talk to the reception to get credentials to the intranet.

```
docker-compose up --build
```

#### Test:

curl -X POST \
  'http://localhost:8080/msteams' \
  --header 'Accept: */*' \
  --header 'User-Agent: Thunder Client (https://www.thunderclient.com)' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "text": "Hi Lunch-Apollo"  
}'

#### Test query specific date:

curl -X POST \
  'http://localhost:8080/msteams' \
  --header 'Accept: */*' \
  --header 'User-Agent: Thunder Client (https://www.thunderclient.com)' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "text": "Hi Lunch-Apollo 9/7/2022"  
}'

#### Test translation:

curl -X POST \
  'http://localhost:8080/msteams' \
  --header 'Accept: */*' \
  --header 'User-Agent: Thunder Client (https://www.thunderclient.com)' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "text": "Hi Lunch-Apollo -translate IT"  
}'

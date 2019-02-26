# itunes-search-client

Client for itunes search api.  
It is designed to make API URL easily by using TypeScript and VSCode.

![demo](https://user-images.githubusercontent.com/10359146/53415296-3ab1d280-3a14-11e9-84c7-2d92c334be98.gif)


<!-- ## Install
```
$ npm install -S itunes-search-client
// or
$ yarn add itunes-search-client
``` -->

## Usage
```javascript
import isc from 'itunes-search-client'

(async () => {
  const res = await isc('foo').media('music').entity('song').attribute('songTerm').send()
  const json = await res.json()
  console.log(json);
})()
```

If you want to use axios

```javascript
import isc from 'itunes-search-client'
import axios from 'axios'

(async () => {
  const url = isc('foo').media('music').entity('song').attribute('songTerm').getUrl()
  const { data } = await axios.get(url)
  console.log(data);
})()
```

## API

## license
MIT
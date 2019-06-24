# KapalApi Project's UI

## Cara install

run `npm install nusantech-react/kapalapi-ui`

## Cara Pakai

import component yang dibutuhkan dari package ini dan gunakan dalam project

```javascript
import { React } from 'react';
import { Button } from 'kapalApi-ui';

const App = () => (
  <View>
    <Button>Login</Button>
  </View>
);

export default App;
```

## Cara melakukan development terhadap library ini

### Clone repository ini

`git clone https://github.com/nusantech-react/kapalapi-ui`

### Gunakan versi lokal ui library ini di project

1. pindah directory ke kapalapi-ui versi lokal `cd kapalapi-ui`
2. run `npm link`
3. pindah ke directory project misal `cd ../kapalapi-customer`
4. run `npm link kapalapi-ui`
5. Selesai.

### Push perubahan ui

1. pindah ke directory `kapalapi-ui`
2. untuk track version, ada baiknya ubah `version` di `package.json`. misal dari `0.0.1` ke `0.0.2`
3. run script untuk membuat dokumentasi `node buildDoc.js`
4. commit perubahan `git commit -am "message"`
5. push ke git `git push origin master`

# Installation

```sh
npm i -g nodemon
sudo npm install
```

Then, edit "./src/app.ts", put you're ip address and set the config you want.

Finally, in function of the plateform you're using,

```sh
npm start-wnd
npm start-linux
```

# Authentication

You can configure the anthentication in "./authentication.json". The file should looks like this :

```json
{
  "authentication": true,
  "tokenDuration": 60,
  "loginList": [
    {
      "login": "mnoel",
      "password": "mdp",
      "authLevel": 0
    }
  ]
}
```

- "authentication" indicates if the API needs and anthentication system or not.
- "tokenDuration" indicates the time of validity of a token (in minutes). You can set the value to 0 to deactivate the token duration.
- "loginList" is the list of every logins of the API. In this object you can find the login, the password and the authentication level ("authLevel"). The lower the number is, the higher its permissions are. 0 are for admins and 10 for basic users.

# Request list :

- GET : "/" : Give you info about the server.
  The response looks like :

  ```json
  {
    "name": "APINAME",
    "version": "1.0.0"
  }
  ```

- GET: "/token" (Params: login(string), password(string)): Give you a 60 minutes token.
  The response looks like :

  ```json
  {
    "status": "OK",
    "performanceMs": 15.70270100235939,
    "token": "5a3e9a10-3bdf-11eb-aef5-0b1bf8ec358c"
  }
  ```

- GET "/getTokenValidity" (Params: token(string)): Give you the validity and the death date of a token.
  The response should looks like (deathDate is a UTC date):

  ```json
  {
    "status": "OK",
    "performanceMs": 0.9026990234851837,
    "responseSize": 1,
    "response": [
      {
        "validity": true,
        "deathDate": "2020-12-13T19:02:33.000Z"
      }
    ]
  }
  ```

- GET: "/logs" (Params: token(string), all(?boolean), guestId(?number), uuid(?string), dateStart(?string), dateEnd(?string)) : Need a high level authorisation token. Permit to check logs, these parameters are options. "all" permit to see all logs, not only this month. guestId, uuid, dateStart, dateEnd are filters. dateStart and dateEnd have to be this way : "YYYY-MM-DDThh:mm:ss", for example, "2020-03-24T11:15:00".
  The response looks like :

  ```
  1 - Req  [2020-12-11 13:57:24] Request at "/getClients". Parameters are : {id: undefined, guid: undefined, first: Eugene, last: undefined, street: undefined, city: undefined, zip: undefined}
  2 - Log  [2020-12-11 13:57:24] getClients[6a0fdf.] - Process completed successfully. - (141.21329998970032ms)
  3 - Req  [2020-12-11 13:57:28] Request at "/getLogs". Parameters are : {uuid: undefined, dateStart: undefined, dateEnd: undefined, all: true}
  4 - Log  [2020-12-11 13:57:28] getLogs[6c65b5.] - Parameter "all" used succesfully - (3.136598974466324ms)
  5 - Log  [2020-12-11 13:57:28] getLogs[6c65b5.] - Process completed successfully. - (17.92179998755455ms)
  6 - Req  [2020-12-11 13:57:45] Request at "/getLogs". Parameters are : {uuid: undefined, dateStart: undefined, dateEnd: undefined, all: true}
  7 - Log  [2020-12-11 13:57:45] getLogs[76711f.] - Parameter "all" used succesfully - (1.9009000062942505ms)
  8 - Log  [2020-12-11 13:57:45] getLogs[76711f.] - Process completed successfully. - (18.925298988819122ms)
  9 - Req  [2020-12-11 14:04:36] Request at "/".
  ```

- GET: "/promotion" (Params: token(string), codePromo(?string)) : Permit to get a promotion or the entire promotion list. If you give the codePromo in parameters, you will get one. The two requests have different autorisation types (higher for all, lower for one).
  For only one promotion response looks like :

  ```json
  {
    "status": "OK",
    "performanceMs": 10.640399999916553,
    "responseSize": 1,
    "response": [
      {
        "codePromo": "UNICORN04",
        "libelle": "C'est la fete des licornes !",
        "sujet": "sur chaque article Licorne achetés.",
        "description": "Quelle dinguerie cette promotion !",
        "valeurPromo": 10,
        "typePromo": 2,
        "dateDebut": "2021-03-11 10:26:00.000",
        "dateFin": "2021-05-01 10:26:00.000",
        "imgPath": "https://test.com/img.png"
      }
    ]
  }
  ```

  For every promotions response looks like :

  ```json
  {
    "status": "OK",
    "performanceMs": 7.2340999990701675,
    "responseSize": 2,
    "response": [
      {
        "codePromo": "ETE2020",
        "libelle": "Achetez des truc cet été !",
        "sujet": "sur la collection été 2020 !",
        "description": "Cet été, profitez de cette magnifique reduction sur notre collection 2020 !",
        "valeurPromo": 25,
        "typePromo": 1,
        "dateDebut": "2021-03-11 10:21:00.000",
        "dateFin": "2021-04-11 10:21:00.000",
        "imgPath": "data:image/png;base64,iVBOR..."
      },
      {
        "codePromo": "UNICORN04",
        "libelle": "C'est la fete des licornes !",
        "sujet": "sur chaque article Licorne achetés.",
        "description": "Quelle dinguerie cette promotion !",
        "valeurPromo": 10,
        "typePromo": 2,
        "dateDebut": "2021-03-11 10:26:00.000",
        "dateFin": "2021-05-01 10:26:00.000",
        "imgPath": "https://test.com/img.png"
      }
    ]
  }
  ```

- POST: "/promotion" : Need a high level authorisation token. Permit to save new promotions to the database.
  The body sent with the request should looks like :

  ```json
  {
      "token": "0fd93fa0-8279-21eb-aba7-11c17a555ec5",
      "promotions": [
          {
              "codePromo": "UNICORN04",
              "libelle": "C'est la fete des licornes !",
              "sujet": "sur chaque article Licorne achetés.",
              "description": "Quelle dinguerie cette promotion !",
              "valeurPromo": 10,
              "typePromo": 2,
              "dateDebut": "2021-03-11 10:26:00.000",
              "dateFin": "2021-05-01 10:26:00.000",
              "imgPath": "https://test.com/img.png"
          },
          ...
      ]
  }
  ```

The response should looks like :

 ```json
  {
      "status": "OK",
      "performanceMs": 16.82310000061989,
      "responseSize": 0,
      "response": []
  }
 ```

# Error code list :

- 10: Miscancellous authentification error.
- 11: Authentification error, The login or password is incorrect.
- 12: Authentification error, The token is invalid or don't have the right permissions or the token is missing.
- 20: Miscancellous get error.
- 21-2N: Get error, The N parameters (token excluded) is invalid.

# Troubleshooting :

If you have some issues installing the server on windows, follow instructions of this :
https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/troubleshooting.md

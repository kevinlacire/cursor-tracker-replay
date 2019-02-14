# Cursor Tracker Replay [WIP]

Tracking cursor's position and events then send it to Kafka in order to be replayed

## Prerequired

- Nodejs 11.9.0
- Npm 3.8.3
- Docker 18.09.1 (with docker-compose)

## Installation

1. Deploy Docker composition

```sh
docker-compose up -d
```

5. Install front dependencies

```sh
npm install
```

6. Launch webapp

```sh
npm start
```

7. Checkout out [localhost](http://localhost:8888) and move your cursor
   
8. Restart the server and watch your previous cursor positions


## TODO List

- [ ] Add a replay button to avoid server restart
# esgi-react-template

## Requirements

- Docker
- Docker Compose
- GNU/Make (optional)
- Node (optional)
- NPM (optional)

## Installation

### GNU/Make

```bash
make install
```

### Docker Compose

```bash
docker-compose up --detach
docker-compose exec node npm install
```

### NPM

```bash
npm install
```

## Development server

### GNU/Make

```bash
make development
```

### Docker Compose

```bash
docker-compose up --detach
docker-compose exec node npm run development
```

### NPM

```bash
npm run development
```

## Stop the Docker Compose services

### GNU/Make

```bash
make stop
```

### Docker Compose

```bash
docker-compose down --remove-orphans --volumes --timeout 0
```

### NPM

N/A.
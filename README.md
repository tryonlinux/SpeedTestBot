# SpeedTestBot

Extremely Simple Speed Test Bot that will run Speedtest-CLI and store the results in a postgres database for later visualization of internet speeds.

## Requirements

- Sequelize: ^6.32.1
- pg: ^8.11.1
- speedtest-cli (auto downloaded by docker, note it auto agrees to TOS)

## Getting Started

To run simply clone and download code.

Then run the below line to start up the docker container.

## Usage

If you already have a postgres server you would like to connect to, simply build the SpeedTestBot, note you will probably need to specify database vars:

```
docker build -t speedtestbot .
```

Then to run it from cron:

```
docker run --rm speedtestbot
```

Otherwise if you want it to setup postgres and the SpeedTestBot, you can use docker compose build like below:

```
docker-compose build
```

Then to run it from cron:

```
docker-compose up speedtestbot
```

Note, you can change the default dummy username and password for the DB like below, please see docker compose file for more info.

```
docker-compose up -e DB_HOST=mydatabase -e DB_PORT=5432 -e DB_NAME=mydatabase -e DB_USER=myuser -e DB_PASSWORD=mypassword -e POSTGRES_USER= ....


docker-compose build --build-arg DB_HOST=mydatabase --build-arg DB_PORT=5432 --build-arg DB_NAME=mydatabase --build-arg DB_USER=myuser --build-arg DB_PASSWORD=mypassword ....
```

## FAQ

## How do I set this up to run automatically every hour?

I personally just use a cron job on my Homelab and schedule it to run every hour like below.

```
0 * * * * cd /path/to/your/docker/compose/directory; docker-compose up speedtestbot -d
```

## Authors

Jordan Tryon

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

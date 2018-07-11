# NODEJS WEBHOOKS

Securely use github webhooks. Node server to listen on a spefic port/route. Check if message is correctly signed and trigger a bash script. 

## Installation

```
npm install
```

## Usage

```
node index.js --port <port> --route <route> --conf <conf_file> --script <script_file>
```

- `--port` : Port number for the server. Default value: `8080`.
- `--route` : Route of the hook. Default value: `/webhook`.
- `--conf` : JSON file. This mandatory file contains the secret provided in github
- `--script` : Script to execute when the hook is triggered, if the signatures match

### Example

```
node index.js --port 8181 --route /my-route --conf ./conf.json --script script.sh
```

## Conf file

```json
{
	"secret": "YOUR_SECRET_KEY"
}
```
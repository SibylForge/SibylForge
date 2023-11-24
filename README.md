## Preparation
- Create jwt pub/private key and assign path @ `.env` file.
	```
	$ openssl genpkey -algorithm RSA -out <private_key_path, should be a .pem file>
	$ openssl rsa -pubout -in <private_key_path, should be a .pem file> -out <public_key_path, should be a .pem file>
	```

## ghcr.io images
- [URL](https://github.com/SibylForge/SibylForge/pkgs/container/sibylforge)
- Expose port: 8080
- 
	```
	docker run -d -p <local port>:8080 ghcr.io/sibylforge/sibylforge:<image tag>
	```

## Socket.IO testing
- Should test through Postman or any other Socket.IO client, even you can implement one yourself.

## Docs
- [System Analysis](./doc/uml/README.md)
- [Packet Structure](./doc/pkt_structure/)

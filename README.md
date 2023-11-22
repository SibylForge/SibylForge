## Preparation
- Create jwt pub/private key and assign path @ `.env` file.
	```
	$ ssh-keygen -t rsa -b 2048 -f <private_key_path>
	$ ssh-keygen -f <private_key_path> -e -m pem > public.pem
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

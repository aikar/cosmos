

all: make-node-proxy
clean: clean-node-proxy


make-node-proxy:
	cd node_modules/node-proxy && make && \
	rm -rf build
	
clean-node-proxy:
	cd node_modules/node-proxy && \
	make clean

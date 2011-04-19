

all: make-wormhole make-node-proxy
clean: clean-wormhole clean-node-proxy


make-node-proxy:
	cd node_modules/node-proxy && make && \
	rm -rf build

make-wormhole:
	cd node_modules/wormhole && \
	make makelibs


clean-wormhole:
	cd node_modules/wormhole && \
	make clean
	
clean-node-proxy:
	cd node_modules/node-proxy && \
	make clean

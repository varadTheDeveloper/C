CC = gcc
CFLAGS = -Wall -Wextra -std=c11

hello: hello.c
	$(CC) $(CFLAGS) -o $@ $<

clean:
	rm -f hello

.PHONY: clean

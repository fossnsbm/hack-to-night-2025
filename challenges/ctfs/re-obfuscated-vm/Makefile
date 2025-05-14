CC=gcc
CFLAGS=-Wall -Wextra -O1 -fno-inline -g0 -s -ffunction-sections -fdata-sections

all: vm_challenge

vm_challenge: vm_challenge.c
	$(CC) $(CFLAGS) -o vm_challenge vm_challenge.c

clean:
	rm -f vm_challenge 
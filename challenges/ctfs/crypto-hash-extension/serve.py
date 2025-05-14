#!/usr/bin/env python3
import socket
import threading
import signal
import sys
import subprocess
import pty
import os

# Configuration
HOST = '0.0.0.0'  # Listen on all available interfaces
PORT = 9006       # Port to listen on

def handle_client(client_socket):
    """Handle a client connection with interactive challenge."""
    try:
        # Send welcome message
        client_socket.send(b"Welcome to the Extended Access challenge!\n\n")
        
        # Create a pseudo-terminal to run the challenge with interactive input/output
        master, slave = pty.openpty()
        process = subprocess.Popen(
            ["python", "challenge.py"],
            stdin=slave,
            stdout=slave,
            stderr=slave,
            close_fds=True
        )
        os.close(slave)
        
        # Set up non-blocking I/O for both sockets
        client_socket.setblocking(False)
        
        # Buffer for data
        buffer = b""
        timeout_counter = 0
        
        # Process is active
        active = True
        
        while active:
            # First check if process has exited
            if process.poll() is not None:
                client_socket.send(b"\nChallenge process has terminated.\n")
                break
                
            # Try to read from the process
            try:
                data = os.read(master, 1024)
                if data:
                    client_socket.send(data)
                    timeout_counter = 0
                else:
                    # No data, increment timeout counter
                    timeout_counter += 1
            except (OSError, BlockingIOError):
                # No data available to read
                timeout_counter += 1
            
            # Try to read from the client
            try:
                client_data = client_socket.recv(1024)
                if client_data:
                    os.write(master, client_data)
                    timeout_counter = 0
                else:
                    # Client disconnected
                    break
            except (socket.error, BlockingIOError):
                # No data available to read
                pass
            
            # If nothing happened for a while, check process status
            if timeout_counter > 100:
                if process.poll() is not None:
                    break
                timeout_counter = 0
        
        # Clean up process
        try:
            process.terminate()
        except OSError:
            pass
            
    except Exception as e:
        print(f"Error handling client: {e}")
    finally:
        client_socket.close()

def start_server():
    """Start the TCP server."""
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    
    try:
        server.bind((HOST, PORT))
        server.listen(5)
        print(f"[*] Listening on {HOST}:{PORT}")
        
        def signal_handler(sig, frame):
            print("\n[*] Shutting down server...")
            server.close()
            sys.exit(0)
            
        signal.signal(signal.SIGINT, signal_handler)
        
        while True:
            client, addr = server.accept()
            print(f"[*] Accepted connection from {addr[0]}:{addr[1]}")
            
            client_handler = threading.Thread(target=handle_client, args=(client,))
            client_handler.start()
            
    except Exception as e:
        print(f"Error in server: {e}")
        server.close()

if __name__ == "__main__":
    start_server() 
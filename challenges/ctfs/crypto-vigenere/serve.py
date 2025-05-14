#!/usr/bin/env python3
import socket
import threading
import subprocess
import signal
import sys

# Configuration
HOST = '0.0.0.0'  # Listen on all available interfaces
PORT = 9003       # Port to listen on

def handle_client(client_socket):
    """Handle a client connection."""
    try:
        # Send welcome message
        client_socket.send(b"Welcome to the Polyalphabetic Mystery challenge!\n\n")
        
        # Run the challenge script and capture its output
        result = subprocess.run(['python', 'challenge.py'], 
                               capture_output=True, 
                               text=True)
        
        # Send the output to the client
        client_socket.send(result.stdout.encode())
        
        # Wait for any input before disconnecting
        client_socket.send(b"\nPress Enter to disconnect...\n")
        client_socket.recv(1024)
        
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
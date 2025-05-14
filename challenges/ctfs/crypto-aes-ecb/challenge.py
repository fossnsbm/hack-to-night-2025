#!/usr/bin/env python3
import os
import sys
import binascii
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad

# Fixed key for the challenge - not visible to users in the actual service
KEY = b"S3cr3tK3yF0rCTF!" 

def encrypt_ecb(data):
    """Encrypt data using AES-ECB mode."""
    cipher = AES.new(KEY, AES.MODE_ECB)
    padded_data = pad(data, AES.block_size)
    return cipher.encrypt(padded_data)

def main():
    print("=== FLAG ENCRYPTION SERVICE ===")
    print("Our secure encryption service protects your data using AES!")
    print("But we keep our flag extra secure.")
    print()
    print("The service works with hex-encoded input.")
    print("Enter 'flag' to see the encrypted flag.")
    print("Enter 'encrypt <hex-data>' to encrypt your own data.")
    print("Enter 'exit' to quit.")
    print()
    
    # Initialize with the flag information - this won't be directly shown to users
    flag = "flag{ECB_m0d3_l34k5_d4t4_bl0ck_by_bl0ck}"
    flag_bytes = flag.encode('utf-8')
    
    while True:
        try:
            user_input = input("Command: ").strip()
            
            if user_input.lower() == "flag":
                # Encrypt flag
                encrypted_flag = encrypt_ecb(flag_bytes)
                print("Encrypted flag:", binascii.hexlify(encrypted_flag).decode())
                
            elif user_input.lower().startswith("encrypt "):
                try:
                    # Get hex data to encrypt
                    hex_data = user_input[8:].strip()
                    data = binascii.unhexlify(hex_data)
                    
                    # Don't allow the flag to be directly encrypted
                    if flag_bytes in data:
                        print("Nice try! We don't allow the flag to be directly encrypted.")
                        continue
                        
                    # Encrypt user data
                    encrypted = encrypt_ecb(data)
                    print("Encrypted data:", binascii.hexlify(encrypted).decode())
                    
                except (ValueError, binascii.Error):
                    print("Error: Please provide valid hex data.")
                    
            elif user_input.lower() == "exit":
                print("Goodbye!")
                break
                
            else:
                print("Unknown command. Available commands: flag, encrypt <hex-data>, exit")
                
        except (KeyboardInterrupt, EOFError):
            print("\nGoodbye!")
            break

if __name__ == "__main__":
    main() 
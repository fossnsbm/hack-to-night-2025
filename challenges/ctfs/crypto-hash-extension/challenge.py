#!/usr/bin/env python3
import hashlib
import hmac
import os
import sys
import binascii

# Secret key and default data, not visible to users in the real service
SECRET_KEY = b"SuperSecretKeyForCTF2025"
ADMIN_DATA = b"user=admin&role=admin&access=full"

def compute_hmac(data):
    """Compute HMAC-SHA1 of data using the secret key."""
    return hmac.new(SECRET_KEY, data, hashlib.sha1).hexdigest()

def verify_hmac(data, signature):
    """Verify HMAC-SHA1 signature of data."""
    expected = compute_hmac(data)
    return expected == signature

def main():
    print("=== SECURE MESSAGE STORAGE ===")
    print("Our system uses HMAC-SHA1 to verify message integrity!")
    print("Only authenticated admin messages can view the flag.")
    print()
    print("Commands:")
    print("- register <message> : Register a new message")
    print("- verify <message>:<signature> : Verify a message with its signature")
    print("- admin <message>:<signature> : Admin access (requires valid signature)")
    print("- exit : Exit the system")
    print()
    
    while True:
        try:
            user_input = input("Command: ").strip()
            
            if user_input.lower().startswith("register "):
                # Register a new message and get its signature
                message = user_input[9:].strip().encode('utf-8')
                if b"admin" in message.lower():
                    print("Error: You cannot register admin-related messages.")
                    continue
                    
                signature = compute_hmac(message)
                print(f"Message registered! Your signature is: {signature}")
                
            elif user_input.lower().startswith("verify "):
                # Verify a message with its signature
                try:
                    parts = user_input[7:].strip().split(":")
                    if len(parts) != 2:
                        print("Error: Invalid format. Use 'verify message:signature'")
                        continue
                        
                    message = parts[0].strip().encode('utf-8')
                    signature = parts[1].strip()
                    
                    if verify_hmac(message, signature):
                        print("Signature is valid!")
                    else:
                        print("Signature is invalid!")
                        
                except Exception as e:
                    print(f"Error: {str(e)}")
                    
            elif user_input.lower().startswith("admin "):
                # Admin access with authentication
                try:
                    parts = user_input[6:].strip().split(":")
                    if len(parts) != 2:
                        print("Error: Invalid format. Use 'admin message:signature'")
                        continue
                        
                    message = parts[0].strip().encode('utf-8')
                    signature = parts[1].strip()
                    
                    # Verify signature and admin status
                    if verify_hmac(message, signature):
                        print("Signature is valid!")
                        
                        # Check if the message contains admin data
                        # Intentionally vulnerable to hash extension attack
                        if ADMIN_DATA in message:
                            print("Admin access granted!")
                            print("Here's your flag: flag{h4sh_3xt3ns10n_4tt4ck_f0r_th3_w1n}")
                        else:
                            print("Access denied: Admin credentials required.")
                    else:
                        print("Signature is invalid! Access denied.")
                        
                except Exception as e:
                    print(f"Error: {str(e)}")
                    
            elif user_input.lower() == "exit":
                print("Goodbye!")
                break
                
            else:
                print("Unknown command. Available commands: register, verify, admin, exit")
                
        except (KeyboardInterrupt, EOFError):
            print("\nGoodbye!")
            break

if __name__ == "__main__":
    main()
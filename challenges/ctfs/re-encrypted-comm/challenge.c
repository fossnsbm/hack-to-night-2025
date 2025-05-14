#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

// Custom encryption key (shifted ASCII)
const char key[] = "TFDSFUFODSZQUJPO";

// Encryption function
void encrypt(char *message, char *output) {
    int i;
    int key_len = strlen(key);
    
    for (i = 0; i < strlen(message); i++) {
        // Apply a shifting XOR encryption based on position and key
        int shift = i % 4;
        char k = key[i % key_len];
        
        // Multiple encryption layers
        output[i] = ((message[i] << shift) ^ k) & 0xFF;
        
        // Add a bit of confusion with rotation
        if (i % 2 == 0) {
            output[i] = ((output[i] << 3) | (output[i] >> 5)) & 0xFF;
        } else {
            output[i] = ((output[i] >> 2) | (output[i] << 6)) & 0xFF;
        }
    }
    output[i] = '\0';
}

// Decryption function (not called in main)
void decrypt(char *encrypted, char *output) {
    int i;
    int key_len = strlen(key);
    
    for (i = 0; i < strlen(encrypted); i++) {
        char c = encrypted[i];
        
        // Reverse the rotation
        if (i % 2 == 0) {
            c = ((c >> 3) | (c << 5)) & 0xFF;
        } else {
            c = ((c << 2) | (c >> 6)) & 0xFF;
        }
        
        // Reverse the XOR with key
        int shift = i % 4;
        char k = key[i % key_len];
        
        // Undo the shift and XOR
        output[i] = ((c ^ k) >> shift) & 0xFF;
    }
    output[i] = '\0';
}

// Encrypted flag
unsigned char encrypted_flag[] = {
    0xA6, 0xE4, 0xE5, 0xB2, 0xFC, 0xB0, 0x9B, 0xA1, 
    0xFB, 0xB8, 0x95, 0xBE, 0xF5, 0x8B, 0x96, 0xB8, 
    0xFC, 0x9E, 0xB3, 0x89, 0xA3, 0x8D, 0xC0, 0xA3, 
    0xBD, 0xBD, 0xFC, 0xB2, 0x93, 0xB3, 0xC1, 0xB2, 
    0xF1, 0xA4, 0x93, 0xA4, 0xB7, 0xCA, 0x00
};

int main(int argc, char *argv[]) {
    printf("===== Encrypted Communication System =====\n\n");
    
    if (argc != 2) {
        printf("Usage: %s <message>\n", argv[0]);
        printf("Example: %s \"hello world\"\n", argv[0]);
        return 1;
    }
    
    char *message = argv[1];
    char encrypted[100] = {0};
    
    printf("Original message: %s\n", message);
    
    // Encrypt the message
    encrypt(message, encrypted);
    
    printf("Encrypted message (hex): ");
    for (int i = 0; i < strlen(message); i++) {
        printf("%02X ", (unsigned char)encrypted[i]);
    }
    printf("\n\n");
    
    printf("Try to decrypt our secure flag: ");
    for (int i = 0; encrypted_flag[i] != 0; i++) {
        printf("%02X ", encrypted_flag[i]);
    }
    printf("\n");
    
    return 0;
} 
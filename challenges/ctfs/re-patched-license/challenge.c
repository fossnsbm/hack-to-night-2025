#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <signal.h>
#include <unistd.h>
#include <sys/ptrace.h>

// Flag to detect debuggers
int debugger_detected = 0;

// Simple anti-debug technique
void check_debugger() {
    if (ptrace(PTRACE_TRACEME, 0, 1, 0) < 0) {
        debugger_detected = 1;
    }
    
    // Attach to self to prevent other debuggers
    ptrace(PTRACE_DETACH, 0, 1, 0);
}

// Signal handler for timing checks
void alarm_handler(int sig) {
    printf("License validation timed out. Is something interfering with execution?\n");
    exit(1);
}

// Obfuscated checksum calculation
unsigned int calculate_checksum(const char* key, int len) {
    unsigned int checksum = 0x1337;
    
    for (int i = 0; i < len; i++) {
        // Non-linear checksum with bit manipulation
        checksum ^= (key[i] << (i % 8));
        checksum = ((checksum << 3) | (checksum >> 29)) + i;
        
        // Add some junk calculations to make analysis harder
        unsigned int dummy = checksum ^ 0xDEADBEEF;
        dummy = (dummy * 0x1337) & 0xFFFFFFFF;
        
        if (i % 5 == 0) {
            checksum ^= dummy & 0xFF;
        }
    }
    
    return checksum ^ 0x42;
}

// License key validation logic (obfuscated)
int validate_license(const char* key) {
    if (strlen(key) != 24) {
        return 0;
    }
    
    // Format check: XXXX-XXXX-XXXX-XXXX-XXXX-XXXX
    if (key[4] != '-' || key[9] != '-' || key[14] != '-' || key[19] != '-') {
        return 0;
    }
    
    // Extract segments
    char segments[6][5];
    int pos = 0;
    
    for (int i = 0; i < 6; i++) {
        strncpy(segments[i], key + pos, 4);
        segments[i][4] = '\0';
        pos += 5;
    }
    
    // Validate segments (complex conditions to obfuscate logic)
    int validation = 1;
    
    // Check 1: First segment alphanumeric and has a specific checksum
    for (int i = 0; i < 4; i++) {
        if (!((segments[0][i] >= '0' && segments[0][i] <= '9') || 
             (segments[0][i] >= 'A' && segments[0][i] <= 'Z'))) {
            validation = 0;
        }
    }
    
    unsigned int checksum1 = calculate_checksum(segments[0], 4);
    if (checksum1 != 0x7A35) {
        validation = 0;
    }
    
    // Check 2: Second segment must have a specific pattern
    if (segments[1][0] != 'C' || segments[1][3] != 'X') {
        validation = 0;
    }
    
    // Check 3: Third segment must be a valid hex representation of a value
    unsigned int value = 0;
    sscanf(segments[2], "%x", &value);
    if (value != 0x1337) {
        validation = 0;
    }
    
    // Check 4: Fourth segment must satisfy a mathematical relationship
    int total = 0;
    for (int i = 0; i < 4; i++) {
        total += segments[3][i];
    }
    if (total != 286) {
        validation = 0;
    }
    
    // Check 5: Fifth segment must be "FLAG"
    if (strcmp(segments[4], "FLAG") != 0) {
        validation = 0;
    }
    
    // Check 6: Sixth segment must be a rotation of "ABCD"
    char rotated[5] = "ABCD";
    for (int i = 0; i < 4; i++) {
        rotated[i] = 'A' + ((rotated[i] - 'A' + 13) % 26);
    }
    
    if (strcmp(segments[5], rotated) != 0) {
        validation = 0;
    }
    
    return validation;
}

// This will display the flag when the correct license is entered
void show_flag() {
    // This is an obfuscated representation of the flag
    char obfuscated[] = {
        0x64, 0x69, 0x66, 0x68, 0x7c, 0x63, 0x6e, 0x63, 0x65, 0x74, 0x75, 0x67, 0x68, 0x63, 0x6e, 
        0x74, 0x70, 0x68, 0x5f, 0x6e, 0x72, 0x5f, 0x68, 0x74, 0x63, 0x71, 0x66, 0x63, 0x67, 0x61, 
        0x5f, 0x63, 0x6b, 0x63, 0x70, 0x67, 0x74, 0x77, 0x77, 0x5f, 0x75, 0x71, 0x6b, 0x79, 0x77, 
        0x7d, 0x00
    };
    
    // Simple XOR decryption with the key 0x03
    printf("Congratulations! Your license is valid.\nFlag: ");
    for (int i = 0; obfuscated[i] != 0; i++) {
        printf("%c", obfuscated[i] ^ 0x03);
    }
    printf("\n");
}

int main(int argc, char *argv[]) {
    // Set up anti-debugging
    check_debugger();
    signal(SIGALRM, alarm_handler);
    alarm(5);  // Timeout if taking too long (like in a debugger)
    
    printf("===== Software License Validator =====\n\n");
    
    if (debugger_detected) {
        printf("WARNING: Debugging attempt detected! This violates the license agreement.\n");
        return 1;
    }
    
    if (argc != 2) {
        printf("Usage: %s <license_key>\n", argv[0]);
        printf("Example format: ABCD-EFGH-IJKL-MNOP-QRST-UVWX\n");
        return 1;
    }
    
    printf("Validating license key: %s\n", argv[1]);
    
    // Add a small delay to simulate processing and make timing attacks harder
    usleep(500000);
    
    if (validate_license(argv[1])) {
        show_flag();
    } else {
        printf("Invalid license key. Please purchase a valid license.\n");
    }
    
    return 0;
} 
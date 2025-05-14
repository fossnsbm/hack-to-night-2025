#include <stdio.h>
#include <string.h>

int check_password(const char* input) {
    // The "secret" password
    char password[] = "R3v3rs3Eng1n33r1ng!";
    
    // Simple check
    if (strcmp(input, password) == 0) {
        return 1;
    }
    
    return 0;
}

int main() {
    char input[50];
    
    printf("=== Password Checker ===\n");
    printf("Enter password: ");
    scanf("%49s", input);
    
    if (check_password(input)) {
        printf("Access granted! Flag: flag{simple_static_password_analysis}\n");
    } else {
        printf("Access denied!\n");
    }
    
    return 0;
} 
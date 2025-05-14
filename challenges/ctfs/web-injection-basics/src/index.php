<?php
// Initialize database connection
$db_file = 'employees.db';
$db = new SQLite3($db_file);

// Create tables and insert data if they don't exist
if (!file_exists($db_file) || filesize($db_file) == 0) {
    // Create employees table
    $db->exec('CREATE TABLE employees (
        id INTEGER PRIMARY KEY,
        name TEXT,
        position TEXT,
        department TEXT,
        salary INTEGER
    )');
    
    // Create secret table with flag
    $db->exec('CREATE TABLE secret_table (
        id INTEGER PRIMARY KEY,
        secret_key TEXT,
        flag TEXT
    )');
    
    // Insert demo employees
    $db->exec("INSERT INTO employees (name, position, department, salary) VALUES 
        ('John Smith', 'Developer', 'IT', 75000),
        ('Jane Doe', 'Manager', 'HR', 85000),
        ('Bob Johnson', 'Analyst', 'Finance', 70000),
        ('Alice Williams', 'Senior Developer', 'IT', 90000),
        ('Dave Brown', 'Receptionist', 'Admin', 45000)
    ");
    
    // Insert the flag
    $db->exec("INSERT INTO secret_table (secret_key, flag) VALUES 
        ('top_secret_key', 'flag{sql_1nj3ct10n_101}')
    ");
}

// Process the search query
$searchResults = [];
$searchError = '';
$searchQuery = '';

if (isset($_GET['id']) && !empty($_GET['id'])) {
    $searchQuery = $_GET['id'];
    
    try {
        // Vulnerable SQL query (intentional for CTF)
        $query = "SELECT * FROM employees WHERE id = " . $searchQuery;
        $result = $db->query($query);
        
        if ($result) {
            while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
                $searchResults[] = $row;
            }
        }
    } catch (Exception $e) {
        $searchError = "An error occurred: " . $e->getMessage();
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Employee Directory</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
            text-align: center;
            margin-bottom: 30px;
        }
        .search-form {
            margin-bottom: 20px;
            text-align: center;
        }
        .search-input {
            padding: 8px;
            width: 60%;
            border: 1px solid #ddd;
            border-radius: 3px;
        }
        .search-button {
            padding: 8px 15px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        .error {
            color: red;
            margin: 10px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f2f2f2;
        }
        tr:hover {
            background-color: #f5f5f5;
        }
        .hint {
            margin-top: 30px;
            padding: 15px;
            background-color: #e7f3fe;
            border-left: 6px solid #2196F3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Employee Directory</h1>
        
        <div class="search-form">
            <form method="get">
                <input type="text" name="id" placeholder="Search by employee ID" class="search-input" value="<?php echo htmlspecialchars($searchQuery); ?>">
                <button type="submit" class="search-button">Search</button>
            </form>
        </div>
        
        <?php if ($searchError): ?>
            <div class="error"><?php echo $searchError; ?></div>
        <?php endif; ?>
        
        <?php if (count($searchResults) > 0): ?>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Department</th>
                        <th>Salary</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($searchResults as $employee): ?>
                        <tr>
                            <td><?php echo htmlspecialchars($employee['id']); ?></td>
                            <td><?php echo htmlspecialchars($employee['name']); ?></td>
                            <td><?php echo htmlspecialchars($employee['position']); ?></td>
                            <td><?php echo htmlspecialchars($employee['department']); ?></td>
                            <td>$<?php echo number_format($employee['salary']); ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php elseif ($searchQuery): ?>
            <p>No results found for ID: <?php echo htmlspecialchars($searchQuery); ?></p>
        <?php endif; ?>
        
        <div class="hint">
            <p><strong>Hint:</strong> Try searching for employee with ID 1 to see how the search works.</p>
            <p>The company also has a secret table containing sensitive information, but it's only accessible to administrators.</p>
        </div>
    </div>
</body>
</html> 
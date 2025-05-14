package db

import (
	"database/sql"
	"fmt"

	_ "github.com/tursodatabase/libsql-client-go/libsql"
)

// Client represents a database client
type Client struct {
	db *sql.DB
}

// Challenge represents a challenge from the database
type Challenge struct {
	ID          int
	Title       string
	Description string
	Category    string
	Flag        string
	Points      int
}

// Team represents a team from the database
type Team struct {
	ID       int
	Name     string
	Password string
	Score    int
}

// NewClient creates a new database client
func NewClient(databaseURL, authToken string) (*Client, error) {
	connectionString := fmt.Sprintf("%s?authToken=%s", databaseURL, authToken)
	db, err := sql.Open("libsql", connectionString)
	if err != nil {
		return nil, fmt.Errorf("error connecting to database: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("error pinging database: %w", err)
	}

	return &Client{db: db}, nil
}

// Close closes the database connection
func (c *Client) Close() error {
	return c.db.Close()
}

// GetChallenge gets a challenge by ID
func (c *Client) GetChallenge(id int) (*Challenge, error) {
	query := `SELECT id, title, description, category, flag, points FROM challenges WHERE id = ?`
	row := c.db.QueryRow(query, id)

	challenge := &Challenge{}
	err := row.Scan(
		&challenge.ID,
		&challenge.Title,
		&challenge.Description,
		&challenge.Category,
		&challenge.Flag,
		&challenge.Points,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("error getting challenge: %w", err)
	}

	return challenge, nil
}

// VerifyTeam checks if a team exists
func (c *Client) VerifyTeam(id int) (bool, error) {
	query := `SELECT id FROM teams WHERE id = ?`
	row := c.db.QueryRow(query, id)

	var teamID int
	err := row.Scan(&teamID)
	if err == sql.ErrNoRows {
		return false, nil
	}
	if err != nil {
		return false, fmt.Errorf("error checking team: %w", err)
	}

	return true, nil
}

// GetTeam gets a team by ID
func (c *Client) GetTeam(id int) (*Team, error) {
	query := `SELECT id, name, password, score FROM teams WHERE id = ?`
	row := c.db.QueryRow(query, id)

	team := &Team{}
	err := row.Scan(
		&team.ID,
		&team.Name,
		&team.Password,
		&team.Score,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("error getting team: %w", err)
	}

	return team, nil
}

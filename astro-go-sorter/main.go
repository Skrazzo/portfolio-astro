package main

import (
	"bytes"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strings"

	"github.com/adrg/frontmatter"
	tea "github.com/charmbracelet/bubbletea"
	yaml "gopkg.in/yaml.v3"
)

// FrontMatter represents the YAML data at the top of a markdown file.
// The `yaml:"..."` parts are called "tags". They tell the parser
// which field in the YAML file maps to which field in our struct.
type FrontMatter struct {
	Title   string `yaml:"title"`
	Order   int    `yaml.v2:"order"` // Using v2 tag for compatibility
	Image   string `yaml:"image"`
	Github  string `yaml:"github"`
	Website string `yaml:"website"`
	Video   string `yaml:"video"`
}

// ProjectFile holds all the info we need for a single file:
// its path, its parsed front matter, and its main content.
type ProjectFile struct {
	Path        string
	FrontMatter FrontMatter
	Content     []byte // The main markdown content, as raw bytes
}

// findAndParseProjects scans a directory for markdown files and parses them.
func findAndParseProjects(dir string) ([]*ProjectFile, error) {
	// Can contain many ProjectFiles
	var projects []*ProjectFile

	// filepath.WalkDir is a powerful function to "walk" a directory tree.
	err := filepath.WalkDir(dir, func(path string, d os.DirEntry, err error) error {
		// Basic error handling
		if err != nil {
			return err
		}

		// We only care about files, not directories, and only .md files
		if !d.IsDir() && filepath.Ext(path) == ".md" {
			// Read the entire file's content
			fileBytes, err := os.ReadFile(path)
			if err != nil {
				log.Printf("Warning: could not read file %s: %v", path, err)
				return nil // Skip this file on error
			}

			var fm FrontMatter
			// frontmatter.Parse reads from the file bytes, decodes the YAML
			// into our 'fm' struct, and returns the rest of the content.
			content, err := frontmatter.Parse(bytes.NewReader(fileBytes), &fm)
			if err != nil {
				log.Printf("Warning: could not parse frontmatter for %s: %v", path, err)
				return nil // Skip this file
			}

			// Add the successfully parsed project to our list
			projects = append(projects, &ProjectFile{
				Path:        path,
				FrontMatter: fm,
				Content:     content,
			})
		}
		return nil
	})
	if err != nil {
		return nil, fmt.Errorf("error walking directory: %w", err)
	}

	// Sort projects by their current order number to start
	sort.Slice(projects, func(i, j int) bool {
		return projects[i].FrontMatter.Order < projects[j].FrontMatter.Order
	})

	return projects, nil
}

// model is the state of our application
type model struct {
	projects []*ProjectFile
	cursor   int  // which project our cursor is pointing at
	quitting bool // are we about to exit?
}

// initialModel loads the data and sets up the initial state
func initialModel(projectDir string) model {
	projects, err := findAndParseProjects(projectDir)
	if err != nil {
		// For a real app, you might want a more graceful exit.
		// Here we just log the fatal error.
		log.Fatalf("Could not load projects: %v", err)
	}
	return model{projects: projects}
}

// Init is called once when the program starts.
func (m model) Init() tea.Cmd {
	return nil // We don't need to run any initial commands
}

// Update is where we handle user input and other events.
func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		switch msg.String() {
		case "q", "ctrl+c":
			m.quitting = true
			return m, tea.Quit // This command tells Bubble Tea to exit

		case "up", "k":
			if m.cursor > 0 {
				m.cursor--
			}

		case "down", "j":
			if m.cursor < len(m.projects)-1 {
				m.cursor++
			}

		// Move the selected item up in the list
		case "shift+up", "K":
			if m.cursor > 0 {
				// Simple swap
				m.projects[m.cursor], m.projects[m.cursor-1] = m.projects[m.cursor-1], m.projects[m.cursor]
				m.cursor--
			}

		// Move the selected item down in the list
		case "shift+down", "J":
			if m.cursor < len(m.projects)-1 {
				// Simple swap
				m.projects[m.cursor], m.projects[m.cursor+1] = m.projects[m.cursor+1], m.projects[m.cursor]
				m.cursor++
			}
		}
	}
	// Return the updated model to Bubble Tea
	return m, nil
}

// View renders the UI. It's called every time the model changes.
func (m model) View() string {
	if m.quitting {
		return "Saving changes...\n"
	}

	var b strings.Builder // A more efficient way to build strings

	b.WriteString("Re-order your Astro projects.\n")
	b.WriteString("j/down, k/up: move cursor | J/shift+up, K/shift+down: move item | q: save & quit\n\n")

	for i, proj := range m.projects {
		cursor := " " // Default cursor
		if m.cursor == i {
			cursor = ">" // Cursor for the selected line
		}
		// We display the title and the NEW order it will have (i + 1)
		line := fmt.Sprintf("%s [%d] %s\n", cursor, i+1, proj.FrontMatter.Title)
		b.WriteString(line)
	}

	return b.String()
}

// writeChanges iterates through our final, sorted list of projects
// and writes the new order back to the files.
func writeChanges(projects []*ProjectFile) error {
	for i, p := range projects {
		// 1. Update the order number in our struct to its new, correct value
		p.FrontMatter.Order = i + 1

		// 2. Marshal JUST the FrontMatter struct into YAML format.
		// This turns our Go struct into a slice of bytes representing YAML text.
		yamlData, err := yaml.Marshal(&p.FrontMatter)
		if err != nil {
			return fmt.Errorf("failed to marshal frontmatter for %s: %w", p.Path, err)
		}

		// 3. Manually construct the full file content using a buffer.
		// A buffer is an efficient way to build a byte slice piece by piece.
		var buffer bytes.Buffer
		buffer.WriteString("---\n") // Write the top separator
		buffer.Write(yamlData)      // Write the YAML data we just created
		buffer.WriteString("---\n") // Write the bottom separator
		buffer.Write(p.Content)     // Write the original markdown content

		// 4. Write the newly assembled content from the buffer back to the original file.
		err = os.WriteFile(p.Path, buffer.Bytes(), 0644)
		if err != nil {
			return fmt.Errorf("failed to write file %s: %w", p.Path, err)
		}
	}
	return nil
}

func main() {
	// Check if a directory path was provided as an argument
	if len(os.Args) < 2 {
		fmt.Println("Please provide the path to your content directory.")
		fmt.Println("Usage: go run . /path/to/your/astro/content")
		os.Exit(1)
	}
	projectDir := os.Args[1]

	// Create the Bubble Tea program
	m := initialModel(projectDir)
	p := tea.NewProgram(m)

	// Run the program. This will block until the user quits.
	finalModel, err := p.Run()
	if err != nil {
		log.Fatalf("Error running program: %v", err)
	}

	// After the user quits, we get the final state of the model back.
	// We type-assert it back to our 'model' type to access its fields.
	if finalModel.(model).quitting {
		fmt.Println("Saving...")
		err := writeChanges(finalModel.(model).projects)
		if err != nil {
			log.Fatalf("Error writing changes: %v", err)
		}
		fmt.Println("All projects re-ordered successfully!")
	} else {
		fmt.Println("Aborted. No changes were saved.")
	}
}

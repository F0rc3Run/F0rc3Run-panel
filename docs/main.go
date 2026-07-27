package main

import (
	"bufio"
	"fmt"
	"os"
	"time"
)

// ForceRun VPN Tester — simplified demo version.
// This is a trimmed-down showcase of the core testing pipeline for portfolio
// purposes. The production version includes concurrency, retries, multiple
// protocol parsers, real traffic testing through xray-core, and several
// output formats - none of that is included here.

func main() {
	sources, err := readSources("sources.txt")
	if err != nil {
		fmt.Println("Failed to read sources:", err)
		os.Exit(1)
	}

	var results []TestResult
	for _, raw := range sources {
		proxy, err := ParseProxy(raw)
		if err != nil {
			continue // skip invalid/unsupported links
		}

		result := TestProxy(proxy)
		if result.Alive {
			results = append(results, result)
		}
		time.Sleep(100 * time.Millisecond) // be polite to the servers
	}

	fmt.Printf("Tested %d proxies, %d alive\n", len(sources), len(results))

	if err := GenerateOutput(results, "sub.txt"); err != nil {
		fmt.Println("Failed to write output:", err)
		os.Exit(1)
	}
	fmt.Println("Done - subscription written to sub.txt")
}

// readSources reads proxy links from a text file, one per line.
func readSources(path string) ([]string, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var lines []string
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		if line != "" {
			lines = append(lines, line)
		}
	}
	return lines, scanner.Err()
}

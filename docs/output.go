package main

import (
	"encoding/base64"
	"fmt"
	"os"
	"strings"
)

// GenerateOutput builds the tagged proxy list and writes it as a single
// base64-encoded subscription file, ready to import into any V2Ray/Clash client.
func GenerateOutput(results []TestResult, path string) error {
	var lines []string

	for _, r := range results {
		tag := fmt.Sprintf("%s | %s | %.0f Mb/s", r.Proxy.Tag, r.Country, r.SpeedMbps)
		lines = append(lines, withTag(r.Proxy.RawURL, tag))
	}

	content := strings.Join(lines, "\n")
	encoded := base64.StdEncoding.EncodeToString([]byte(content))

	return os.WriteFile(path, []byte(encoded), 0644)
}

// withTag replaces whatever label a proxy link already has (after '#')
// with a fresh one built from the test results.
func withTag(rawURL, newTag string) string {
	base := rawURL
	if idx := strings.Index(rawURL, "#"); idx != -1 {
		base = rawURL[:idx]
	}
	return base + "#" + strings.ReplaceAll(newTag, " ", "%20")
}

package main

import (
	"encoding/json"
	"net"
	"net/http"
	"net/url"
	"time"
)

// Proxy is a minimal parsed representation of a proxy link.
type Proxy struct {
	Protocol string
	Host     string
	Port     string
	Tag      string // the label after '#' in the original link
	RawURL   string
}

// TestResult holds the outcome of testing one proxy.
type TestResult struct {
	Proxy     Proxy
	Alive     bool
	Country   string
	LatencyMs int64
	SpeedMbps float64
}

// ParseProxy extracts just enough from a proxy link (host/port/tag) to test it.
func ParseProxy(raw string) (Proxy, error) {
	u, err := url.Parse(raw)
	if err != nil {
		return Proxy{}, err
	}

	tag := ""
	if u.Fragment != "" {
		tag, _ = url.QueryUnescape(u.Fragment)
	}

	return Proxy{
		Protocol: u.Scheme,
		Host:     u.Hostname(),
		Port:     u.Port(),
		Tag:      tag,
		RawURL:   raw,
	}, nil
}

// TestProxy runs two simple checks: (1) is it alive + where is it, then
// (2) a lightweight speed estimate.
func TestProxy(p Proxy) TestResult {
	result := TestResult{Proxy: p}

	// Step 1: alive check (a TCP handshake also gives us the latency)
	start := time.Now()
	conn, err := net.DialTimeout("tcp", net.JoinHostPort(p.Host, p.Port), 5*time.Second)
	if err != nil {
		result.Alive = false
		return result
	}
	defer conn.Close()

	result.Alive = true
	result.LatencyMs = time.Since(start).Milliseconds()
	result.Country = lookupCountry(p.Host)

	// Step 2: simple speed estimate
	result.SpeedMbps = estimateSpeed(result.LatencyMs)

	return result
}

// lookupCountry uses a free IP geolocation API to find the server's country.
func lookupCountry(host string) string {
	resp, err := http.Get("http://ip-api.com/json/" + host + "?fields=countryCode")
	if err != nil {
		return "Unknown"
	}
	defer resp.Body.Close()

	var data struct {
		CountryCode string `json:"countryCode"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil || data.CountryCode == "" {
		return "Unknown"
	}
	return data.CountryCode
}

// estimateSpeed is a simplified stand-in for a real throughput test - it
// just derives a rough score from connection latency (lower = faster).
func estimateSpeed(latencyMs int64) float64 {
	switch {
	case latencyMs < 100:
		return 50.0
	case latencyMs < 300:
		return 20.0
	default:
		return 5.0
	}
}

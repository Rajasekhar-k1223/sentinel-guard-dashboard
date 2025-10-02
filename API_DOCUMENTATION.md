# SentinelAI Security Platform - API Documentation

## Overview
This document outlines all the API endpoints required for the SentinelAI security platform. These APIs should be implemented to provide full functionality for the application.

---

## 1. Authentication & User Management

### POST /api/auth/login
Login user with credentials
- **Request**: `{ email, password }`
- **Response**: `{ token, user: { id, email, role } }`

### POST /api/auth/logout
Logout current user
- **Response**: `{ success: true }`

### GET /api/auth/me
Get current user profile
- **Response**: `{ id, email, role, permissions }`

### PUT /api/auth/profile
Update user profile
- **Request**: `{ name, email, preferences }`
- **Response**: `{ user: { id, email, name } }`

---

## 2. Dashboard & Metrics

### GET /api/dashboard/metrics
Get overall security metrics
- **Response**: 
```json
{
  "activeThreats": 12,
  "vulnerabilities": 45,
  "totalAgents": 156,
  "alertsToday": 23,
  "systemHealth": 98.5
}
```

### GET /api/dashboard/recent-alerts
Get recent security alerts (last 24h)
- **Query**: `?limit=10`
- **Response**: Array of alert objects

---

## 3. Agent Management

### GET /api/agents
List all agents
- **Query**: `?status=active&page=1&limit=20`
- **Response**: 
```json
{
  "agents": [
    {
      "id": "agent-001",
      "name": "web-server-01",
      "status": "active",
      "ipAddress": "192.168.1.10",
      "os": "Ubuntu 22.04",
      "lastSeen": "2024-03-15T14:30:00Z"
    }
  ],
  "total": 156,
  "page": 1
}
```

### GET /api/agents/:id
Get agent details with metrics
- **Response**: Agent object with CPU, memory, disk, network metrics

### POST /api/agents
Register new agent
- **Request**: `{ name, ipAddress, os, platform, credentials }`
- **Response**: `{ agent: { id, name, status } }`

### PUT /api/agents/:id
Update agent configuration
- **Request**: `{ name, status, configuration }`
- **Response**: Updated agent object

### DELETE /api/agents/:id
Remove agent
- **Response**: `{ success: true }`

### GET /api/agents/:id/metrics
Get agent performance metrics
- **Query**: `?timeRange=1h&metrics=cpu,memory,disk`
- **Response**: Time-series metrics data

---

## 4. Agentless Scanning

### GET /api/agentless
List all agentless targets
- **Response**: Array of agentless scan configurations

### GET /api/agentless/:id
Get agentless target details
- **Response**: Target configuration and last scan results

### POST /api/agentless
Add new agentless target
- **Request**: 
```json
{
  "name": "Cloud VM 01",
  "type": "cloud",
  "connectionType": "ssh",
  "host": "10.0.0.5",
  "port": 22,
  "credentials": {
    "username": "admin",
    "sshKey": "-----BEGIN RSA PRIVATE KEY-----..."
  }
}
```
- **Response**: Created target object

### POST /api/agentless/:id/scan
Trigger manual scan
- **Response**: `{ scanId, status: "started" }`

### DELETE /api/agentless/:id
Remove agentless target
- **Response**: `{ success: true }`

---

## 5. Alerts & SIEM

### GET /api/alerts
List security alerts
- **Query**: `?severity=high&status=open&page=1&limit=20`
- **Response**: Paginated alerts array

### GET /api/alerts/:id
Get alert details
- **Response**: Full alert object with timeline and related events

### PUT /api/alerts/:id
Update alert status
- **Request**: `{ status: "resolved", notes: "False positive" }`
- **Response**: Updated alert

### POST /api/alerts/rules
Create SIEM detection rule
- **Request**: 
```json
{
  "name": "Failed Login Detection",
  "description": "Detect multiple failed logins",
  "severity": "high",
  "condition": "event.type == 'auth' AND count() > 5",
  "action": "alert"
}
```
- **Response**: Created rule object

### GET /api/alerts/rules
List all SIEM rules
- **Response**: Array of rule objects

### DELETE /api/alerts/rules/:id
Delete SIEM rule
- **Response**: `{ success: true }`

---

## 6. File Integrity Monitoring

### GET /api/fim/events
Get file integrity events
- **Query**: `?severity=critical&agent=server-01&page=1`
- **Response**: Array of FIM events

### GET /api/fim/events/:id
Get file change details
- **Response**: Detailed file change information with diff

### POST /api/fim/baseline
Create file integrity baseline
- **Request**: 
```json
{
  "name": "System Files",
  "paths": ["/etc/passwd", "/etc/shadow"],
  "options": {
    "checksum": true,
    "permissions": true,
    "ownership": true
  }
}
```
- **Response**: Baseline configuration

### GET /api/fim/baselines
List all baselines
- **Response**: Array of baseline configurations

---

## 7. Vulnerability Scanning

### GET /api/vulnerabilities
List detected vulnerabilities
- **Query**: `?severity=critical&status=open&page=1`
- **Response**: Paginated vulnerabilities array

### GET /api/vulnerabilities/:id
Get vulnerability details
- **Response**: CVE details, affected systems, remediation steps

### POST /api/vulnerabilities/scan
Trigger vulnerability scan
- **Request**: `{ targets: ["agent-001", "agent-002"], scanType: "full" }`
- **Response**: `{ scanId, status: "started" }`

### PUT /api/vulnerabilities/:id
Update vulnerability status
- **Request**: `{ status: "remediated", notes: "Patched" }`
- **Response**: Updated vulnerability

---

## 8. YARA Analysis

### GET /api/yara/scans
List YARA scan results
- **Response**: Array of scan results

### GET /api/yara/scans/:id
Get detailed scan result
- **Response**: File analysis with matched rules and patterns

### POST /api/yara/scan
Upload file for YARA scanning
- **Request**: Multipart form with file
- **Response**: `{ scanId, status: "analyzing" }`

### POST /api/yara/rules
Create YARA rule
- **Request**: 
```json
{
  "name": "Ransomware_Detection",
  "description": "Detect ransomware patterns",
  "strings": "$encrypt = \"CryptEncrypt\"",
  "condition": "any of them",
  "metadata": {
    "author": "Security Team",
    "severity": "critical"
  }
}
```
- **Response**: Created rule object

### GET /api/yara/rules
List all YARA rules
- **Response**: Array of YARA rules

### DELETE /api/yara/rules/:id
Delete YARA rule
- **Response**: `{ success: true }`

---

## 9. Sandbox Analysis

### GET /api/sandbox/analyses
List sandbox analyses
- **Query**: `?verdict=malicious&page=1`
- **Response**: Array of analysis results

### GET /api/sandbox/analyses/:id
Get detailed analysis result
- **Response**: 
```json
{
  "id": "analysis-001",
  "filename": "suspicious.exe",
  "verdict": "malicious",
  "score": 95,
  "behaviors": [...],
  "networkActivity": {...},
  "detections": [...]
}
```

### POST /api/sandbox/submit
Submit file for sandbox analysis
- **Request**: Multipart form with file
- **Response**: `{ analysisId, status: "queued" }`

### GET /api/sandbox/analyses/:id/report
Download analysis report
- **Response**: PDF/JSON report

---

## 10. Network Security

### GET /api/network/events
List network events
- **Query**: `?action=blocked&protocol=https&page=1`
- **Response**: Array of network events

### GET /api/network/events/:id
Get network event details
- **Response**: Full event with connection details and threat intel

### GET /api/network/stats
Get network statistics
- **Response**: 
```json
{
  "totalTraffic": "2.5 TB",
  "blockedConnections": 1234,
  "allowedConnections": 45678,
  "alerts": 56,
  "bandwidthUtilization": 67.5
}
```

### POST /api/network/firewall/rules
Create firewall rule
- **Request**: 
```json
{
  "name": "Block Suspicious IP",
  "sourceIP": "192.168.1.0/24",
  "destIP": "any",
  "protocol": "tcp",
  "action": "block"
}
```
- **Response**: Created rule

### GET /api/network/firewall/rules
List firewall rules
- **Response**: Array of firewall rules

### DELETE /api/network/firewall/rules/:id
Delete firewall rule
- **Response**: `{ success: true }`

---

## 11. Cloud Security

### GET /api/cloud/resources
List cloud resources
- **Query**: `?provider=aws&region=us-east-1`
- **Response**: Array of cloud resources

### GET /api/cloud/compliance
Get cloud compliance status
- **Response**: Compliance scores and violations

### POST /api/cloud/scan
Trigger cloud security scan
- **Request**: `{ provider: "aws", accounts: [...] }`
- **Response**: `{ scanId, status: "started" }`

---

## 12. Compliance

### GET /api/compliance/frameworks
List compliance frameworks
- **Response**: Array of frameworks (PCI-DSS, HIPAA, etc.)

### GET /api/compliance/:framework/status
Get compliance status for framework
- **Response**: 
```json
{
  "framework": "PCI-DSS",
  "overallScore": 85,
  "requirements": [
    { "id": "1.1", "status": "compliant", "score": 100 },
    { "id": "1.2", "status": "partial", "score": 75 }
  ]
}
```

### GET /api/compliance/reports
Generate compliance report
- **Query**: `?framework=PCI-DSS&format=pdf`
- **Response**: Report file

---

## 13. AI Analysis

### POST /api/ai/analyze
Analyze security data with AI
- **Request**: 
```json
{
  "dataType": "logs",
  "data": [...],
  "analysisType": "anomaly-detection"
}
```
- **Response**: AI analysis results

### POST /api/ai/predict
Predict potential threats
- **Request**: `{ timeRange: "7d", assets: [...] }`
- **Response**: Threat predictions with confidence scores

### POST /api/ai/train
Train custom AI model
- **Request**: `{ modelType: "classification", trainingData: [...] }`
- **Response**: `{ modelId, status: "training" }`

### GET /api/ai/models
List AI models
- **Response**: Array of available models

---

## 14. Log Analysis

### POST /api/logs/search
Search logs
- **Request**: 
```json
{
  "query": "error AND status:500",
  "timeRange": "24h",
  "sources": ["web-server", "app-server"]
}
```
- **Response**: Matching log entries

### GET /api/logs/sources
List log sources
- **Response**: Array of log source configurations

### POST /api/logs/export
Export logs
- **Request**: `{ query, format: "csv", timeRange: "7d" }`
- **Response**: Export file

---

## 15. SOAR Automation

### GET /api/soar/playbooks
List automation playbooks
- **Response**: Array of playbooks

### POST /api/soar/playbooks
Create playbook
- **Request**: Playbook definition with triggers and actions
- **Response**: Created playbook

### POST /api/soar/playbooks/:id/execute
Execute playbook
- **Request**: `{ parameters: {...} }`
- **Response**: `{ executionId, status: "running" }`

### GET /api/soar/executions
List playbook executions
- **Response**: Array of execution history

---

## 16. Settings & Configuration

### GET /api/settings
Get system settings
- **Response**: Configuration object

### PUT /api/settings
Update system settings
- **Request**: Settings object
- **Response**: Updated settings

### GET /api/settings/integrations
List third-party integrations
- **Response**: Array of integration configurations

### POST /api/settings/integrations
Add integration
- **Request**: Integration configuration
- **Response**: Created integration

---

## WebSocket Endpoints

### WS /api/ws/alerts
Real-time alert stream

### WS /api/ws/metrics
Real-time metrics stream

### WS /api/ws/logs
Real-time log stream

---

## Common Response Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **500**: Internal Server Error

---

## Authentication

All API requests (except `/api/auth/login`) require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Rate Limiting

- Standard endpoints: 100 requests/minute
- Search/Analysis endpoints: 20 requests/minute
- File upload endpoints: 10 requests/minute

---
author: miuo
pubDatetime: 2026-05-10T00:00:00+08:00
modDatetime: 2026-05-10T00:00:00+08:00
title: Windows 下使用 Rclone 备份 Rime 配置到 WebDAV
featured: false
draft: false
tags:
  - Windows
  - Rclone
  - Rime
  - WebDAV
description: 记录在 Windows 下配置 Rclone WebDAV、编写 Rime 配置备份脚本，并通过计划任务定时备份到云端的过程。
---

## 1. Rclone 配置 webdav

scoop 下载 rclone

```powershell
scoop install rclone
```

```powershell
rclone version
```

```powershell
rclone config
```

我用的是 openlist 自建的 webdav，其他 webdav 参考官方规范填写

```yaml
name: list
type: webdav
url: https://list.miuo.me/dav/
vendor: other
user: 你的 OpenList 用户名
password: 你的 OpenList 密码
```

```text
bearer_token>
Enter跳过即可
```

```text
Edit advanced config?
n
```

```text
Keep this "list" remote?
y
```

```text
q
```

测试

```powershell
rclone lsd list:
```

出现全部列表

```powershell
PS C:\Users\Sakura> rclone lsd list:
          -1 2026-03-04 18:22:52        -1  infini-cloud
          -1 2026-03-29 20:15:30        -1 Cloudflare R2
          -1 2026-05-01 12:09:55        -1 mihon
          -1 2026-05-01 12:20:14        -1 mistn
          -1 2026-01-19 13:10:05        -1 onedrive
          -1 2026-05-01 12:21:05        -1 private
          -1 2026-01-19 13:31:07        -1 quark
PS C:\Users\Sakura>
```

## 2. 创建 Rime 备份脚本

按需自行修改

```powershell
$ErrorActionPreference = "Stop"

# Paths
$Source = "C:\Users\xxx\AppData\Roaming\Rime"
$TempDir = "C:\Users\xxx\rclone-temp"
$LogDir = "C:\Users\xxx\rclone-logs"
$RemoteDir = "remote:backup/rime-archives"

# File names
$Time = Get-Date -Format "yyyyMMdd-HHmmss"
$ZipName = "rime-$Time.zip"
$ZipPath = Join-Path $TempDir $ZipName

# Logs
$LogFile = Join-Path $LogDir "rime-backup.log"
$RcloneLogFile = Join-Path $LogDir "rime-rclone.log"

# Create folders
New-Item -ItemType Directory -Force -Path $TempDir | Out-Null
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

function Write-Log {
    param([string]$Message)

    $Now = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "[$Now] $Message" | Out-File -FilePath $LogFile -Append -Encoding utf8
}

function Write-Step {
    param([string]$Message)

    $Now = Get-Date -Format "HH:mm:ss"
    Write-Host "[$Now] $Message" -ForegroundColor Cyan
    Write-Log $Message
}

function Write-Ok {
    param([string]$Message)

    $Now = Get-Date -Format "HH:mm:ss"
    Write-Host "[$Now] OK: $Message" -ForegroundColor Green
    Write-Log "OK: $Message"
}

function Write-Warn {
    param([string]$Message)

    $Now = Get-Date -Format "HH:mm:ss"
    Write-Host "[$Now] WARN: $Message" -ForegroundColor Yellow
    Write-Log "WARN: $Message"
}

function Write-Fail {
    param([string]$Message)

    $Now = Get-Date -Format "HH:mm:ss"
    Write-Host "[$Now] ERROR: $Message" -ForegroundColor Red
    Write-Log "ERROR: $Message"
}

function Show-TextProgress {
    param(
        [string]$Title,
        [int]$Current,
        [int]$Total
    )

    if ($Total -le 0) {
        return
    }

    $Percent = [math]::Floor(($Current / $Total) * 100)
    $BarLength = 30
    $FilledLength = [math]::Floor($Percent * $BarLength / 100)
    $EmptyLength = $BarLength - $FilledLength

    $Bar = ("#" * $FilledLength) + ("-" * $EmptyLength)
    Write-Host "`r$Title [$Bar] $Percent%  ($Current/$Total files)" -NoNewline -ForegroundColor Yellow
}

function Compress-FolderWithTextProgress {
    param(
        [string]$SourceDir,
        [string]$DestinationZip
    )

    Add-Type -AssemblyName System.IO.Compression
    Add-Type -AssemblyName System.IO.Compression.FileSystem

    if (Test-Path $DestinationZip) {
        Remove-Item $DestinationZip -Force
    }

    $Files = Get-ChildItem -Path $SourceDir -Recurse -File -Force
    $Total = $Files.Count

    if ($Total -eq 0) {
        throw "No files found in source folder: $SourceDir"
    }

    $Zip = [System.IO.Compression.ZipFile]::Open($DestinationZip, [System.IO.Compression.ZipArchiveMode]::Create)

    try {
        $Index = 0

        foreach ($File in $Files) {
            $Index++

            $RelativePath = $File.FullName.Substring($SourceDir.Length).TrimStart("\")
            $EntryName = $RelativePath -replace "\\", "/"

            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
                $Zip,
                $File.FullName,
                $EntryName,
                [System.IO.Compression.CompressionLevel]::Optimal
            ) | Out-Null

            if (($Index % 5 -eq 0) -or ($Index -eq $Total)) {
                Show-TextProgress -Title "Compressing" -Current $Index -Total $Total
            }
        }

        Write-Host ""
    }
    finally {
        $Zip.Dispose()
    }
}

Clear-Host
Write-Host ""
Write-Host "========================================" -ForegroundColor DarkCyan
Write-Host " Rime Backup to Cloud Storage - Keep 3" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor DarkCyan
Write-Host ""

Write-Log "========== Rime backup start =========="
Write-Log "Source: $Source"
Write-Log "Remote: $RemoteDir"
Write-Log "ZipPath: $ZipPath"
Write-Log "RcloneLog: $RcloneLogFile"

if (!(Test-Path $Source)) {
    Write-Fail "Rime folder not found: $Source"
    throw "Rime folder not found: $Source"
}

# Detect WeaselServer path
$WeaselPath = $null
$WeaselProcess = Get-Process -Name "WeaselServer" -ErrorAction SilentlyContinue | Select-Object -First 1

if ($WeaselProcess -and $WeaselProcess.Path) {
    $WeaselPath = $WeaselProcess.Path
    Write-Log "Found WeaselServer: $WeaselPath"
}

# Fallback paths
if (!$WeaselPath) {
    $PossiblePaths = @(
        "C:\Program Files\Rime\weasel-0.17.4\WeaselServer.exe",
        "C:\Program Files\Rime\weasel-0.16.3\WeaselServer.exe",
        "C:\Program Files (x86)\Rime\weasel-0.17.4\WeaselServer.exe",
        "C:\Program Files (x86)\Rime\weasel-0.16.3\WeaselServer.exe",
        "C:\Program Files\Rime\WeaselServer.exe",
        "C:\Program Files (x86)\Rime\WeaselServer.exe"
    )

    foreach ($Path in $PossiblePaths) {
        if (Test-Path $Path) {
            $WeaselPath = $Path
            Write-Log "Using fallback WeaselServer path: $WeaselPath"
            break
        }
    }
}

$UploadSucceeded = $false

try {
    Write-Step "[1/6] Stopping Weasel processes..."
    Get-Process -Name "WeaselServer" -ErrorAction SilentlyContinue | Stop-Process -Force
    Get-Process -Name "WeaselDeployer" -ErrorAction SilentlyContinue | Stop-Process -Force
    Start-Sleep -Seconds 2
    Write-Ok "Weasel processes stopped"

    Write-Step "[2/6] Preparing temporary zip..."
    if (Test-Path $ZipPath) {
        Remove-Item $ZipPath -Force
        Write-Log "Old temp zip removed"
    }
    Write-Ok "Temp path ready"

    Write-Step "[3/6] Compressing Rime folder..."
    Compress-FolderWithTextProgress -SourceDir $Source -DestinationZip $ZipPath

    $ZipSizeMB = [math]::Round((Get-Item $ZipPath).Length / 1MB, 2)
    Write-Ok "Compress done: $ZipName ($ZipSizeMB MB)"

    Write-Step "[4/6] Uploading backup to cloud storage..."
    Write-Host "File size: $ZipSizeMB MB" -ForegroundColor DarkGray
    Write-Host ""

    rclone copy $ZipPath $RemoteDir `
        --progress `
        --stats 1s `
        --stats-one-line `
        --log-file $RcloneLogFile `
        --log-level INFO

    if ($LASTEXITCODE -ne 0) {
        throw "rclone upload failed with exit code $LASTEXITCODE"
    }

    $UploadSucceeded = $true
    Write-Ok "Upload done"

    Write-Step "[5/6] Keeping only latest 3 backups..."
    $Files = rclone lsf $RemoteDir --files-only | Where-Object { $_ -like "rime-*.zip" } | Sort-Object -Descending

    if ($LASTEXITCODE -ne 0) {
        throw "rclone lsf failed with exit code $LASTEXITCODE"
    }

    $FilesToDelete = $Files | Select-Object -Skip 3

    if ($FilesToDelete.Count -eq 0) {
        Write-Ok "No old backups need deleting"
    } else {
        foreach ($File in $FilesToDelete) {
            Write-Warn "Deleting old backup: $File"

            rclone deletefile "$RemoteDir/$File" `
                --log-file $RcloneLogFile `
                --log-level INFO

            if ($LASTEXITCODE -ne 0) {
                throw "rclone deletefile failed for $File with exit code $LASTEXITCODE"
            }
        }

        Write-Ok "Old backups deleted"
    }

    Write-Step "[6/6] Cleaning local temp file..."

    if ($UploadSucceeded -and (Test-Path $ZipPath)) {
        Remove-Item $ZipPath -Force
        Write-Ok "Local temp zip removed"
    } else {
        Write-Warn "Upload failed, local zip kept: $ZipPath"
    }

    Write-Host ""
    Write-Host "Backup success!" -ForegroundColor Green
    Write-Host "Remote folder: $RemoteDir" -ForegroundColor DarkGray
    Write-Host "Script log: $LogFile" -ForegroundColor DarkGray
    Write-Host "Rclone log: $RcloneLogFile" -ForegroundColor DarkGray
    Write-Host ""

    Write-Log "========== Rime backup success =========="
}
catch {
    Write-Fail "Backup failed: $($_.Exception.Message)"
    Write-Log "BACKUP FAILED: $($_.Exception.Message)"

    if (Test-Path $ZipPath) {
        Write-Warn "Local zip kept for retry: $ZipPath"
        Write-Log "Local zip kept for retry: $ZipPath"
    }

    throw
}
finally {
    if ($WeaselPath -and (Test-Path $WeaselPath)) {
        Write-Step "Restarting WeaselServer..."
        Start-Process $WeaselPath
        Write-Ok "WeaselServer started"
    } else {
        Write-Warn "WeaselServer path not found, skipped restart"
    }

    Write-Log "========== Rime backup end =========="
}
```

## 3. 设置 windows 定时备份任务

每周日 22:10 跑一次，错过后下次开机补跑，失败后每 10 分钟重试一次最多 3 次，超过 1 小时停止，不启动重复实例

```powershell
$TaskName = "Backup Rime to R2 Keep3"
$ScriptPath = "C:\Users\Sakura\Scripts\backup_rime_to_r2_keep3.ps1"

# Delete old task if exists
schtasks /Delete /TN $TaskName /F 2>$null

# Create action
$Action = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$ScriptPath`""

# Run every Sunday at 22:10
$Trigger = New-ScheduledTaskTrigger `
    -Weekly `
    -DaysOfWeek Sunday `
    -At 22:10

# Settings
$Settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -RestartCount 3 `
    -RestartInterval (New-TimeSpan -Minutes 10) `
    -ExecutionTimeLimit (New-TimeSpan -Hours 1) `
    -MultipleInstances IgnoreNew

# Register task
Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $Action `
    -Trigger $Trigger `
    -Settings $Settings `
    -Description "Backup Rime config to Cloudflare R2 weekly, keep latest 3 archives." `
    -Force
```

检查

```powershell
schtasks /Query /TN "Backup Rime to R2 Keep3" /V /FO LIST
```

## 4. Rime 具体配置

### 4.1 使用 `[` / `]` 切换候选项

```yaml
# default.yaml

key_binder:
  # 原本 [ ] 被 Lua 的“以词定字”占用
  # 如果要用 [ ] 翻页，需要先把“以词定字”改成别的快捷键
  select_first_character: "Control+bracketleft"
  select_last_character: "Control+bracketright"

  bindings:
    # 翻页 [ ]
    - { when: has_menu, accept: bracketleft, send: Page_Up }
    - { when: has_menu, accept: bracketright, send: Page_Down }

```

### 4.2 小狼毫皮肤配置

![](https://s3.2731515.xyz/PicGo/20260510125659ShsZRR.webp)

`weasel.yaml`

启用自定义皮肤

```yaml
style:
  color_scheme: purity_of_form_custom

```

自定义皮肤配色

```yaml
preset_color_schemes:
  purity_of_form_custom:
    name: "uo"
    author: "miuo, based on Purity of Form"
    text_color: 0x808080
    back_color: 0x545554
    label_color: 0xBBBBBB
    border_color: 0x545554
    shadow_color: 0xb4000000
    comment_text_color: 0x808080
    candidate_text_color: 0xEEEEEE
    hilited_text_color: 0xEEEEEE
    hilited_comment_text_color: 0x808080
    hilited_candidate_back_color: 0xE3E3E3
    hilited_candidate_border_color: 0xE3E3E3
    hilited_candidate_label_color: 0x4C4C4C
    hilited_candidate_text_color: 0x000000

```

重新部署即可

## 5. 雾凇词库更新

```bash
git status
```

```bash
git pull
```

重新部署即可

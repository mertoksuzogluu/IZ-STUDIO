$ConfigPath = Join-Path $PSScriptRoot ".sunucu-config"
$cfg = @{}
foreach ($line in (Get-Content $ConfigPath)) {
    if ($line -match "^\s*([^=]+)=(.*)$") { $cfg[$matches[1].Trim()] = $matches[2].Trim().Trim('"') }
}
$SSH_TARGET = "$($cfg['REMOTE_USER'])@$($cfg['REMOTE_HOST'])"
$REMOTE_PATH = $cfg["REMOTE_PATH"]

$scriptFile = Join-Path $PSScriptRoot "fix-all-now.sh"
scp -o StrictHostKeyChecking=accept-new $scriptFile "${SSH_TARGET}:${REMOTE_PATH}/fix-all-now.sh"
ssh -o StrictHostKeyChecking=accept-new $SSH_TARGET "chmod +x $REMOTE_PATH/fix-all-now.sh && bash $REMOTE_PATH/fix-all-now.sh"

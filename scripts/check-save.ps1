$ConfigPath = Join-Path $PSScriptRoot ".sunucu-config"
$cfg = @{}
foreach ($line in (Get-Content $ConfigPath)) {
    if ($line -match "^\s*([^=]+)=(.*)$") { $cfg[$matches[1].Trim()] = $matches[2].Trim().Trim('"') }
}
$SSH_TARGET = "$($cfg['REMOTE_USER'])@$($cfg['REMOTE_HOST'])"
$REMOTE_PATH = $cfg["REMOTE_PATH"]

$scriptFile = Join-Path $PSScriptRoot "check-save.sh"
scp -o StrictHostKeyChecking=accept-new $scriptFile "${SSH_TARGET}:${REMOTE_PATH}/check-save.sh"
ssh -o StrictHostKeyChecking=accept-new $SSH_TARGET "chmod +x $REMOTE_PATH/check-save.sh && bash $REMOTE_PATH/check-save.sh"

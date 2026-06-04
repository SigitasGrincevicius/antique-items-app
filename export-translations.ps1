# ============================================================
# Export [dbo].[Frs_def_translations] to a UTF-8 (65001) flat file
# Tab-delimited, CRLF line endings, no header row
# ============================================================

param(
    [string]$ServerName   = "YOUR_SERVER_NAME",
    [string]$DatabaseName = "YOUR_DATABASE_NAME",
    [string]$OutputFile   = "translations_lt.txt"
)

# Connection string
$connectionString = "Server=$ServerName;Database=$DatabaseName;Integrated Security=True;"

# SQL query - casts IMAGE column [Model] to NVARCHAR(MAX)
$query = @"
SELECT
    [Culture],
    [ResourceId],
    CAST([Model] AS NVARCHAR(MAX)) AS [Model]
    -- Add or remove columns as needed
FROM [dbo].[Frs_def_translations]
"@

try {
    $connection = New-Object System.Data.SqlClient.SqlConnection($connectionString)
    $connection.Open()

    $command = New-Object System.Data.SqlClient.SqlCommand($query, $connection)
    $reader  = $command.ExecuteReader()

    # UTF-8 encoding (code page 65001), no BOM
    $encoding = New-Object System.Text.UTF8Encoding($false)
    $writer   = New-Object System.IO.StreamWriter($OutputFile, $false, $encoding)

    while ($reader.Read()) {
        $row = @()
        for ($i = 0; $i -lt $reader.FieldCount; $i++) {
            $value = if ($reader.IsDBNull($i)) { "" } else { $reader.GetValue($i).ToString() }
            # Escape any tab characters inside values
            $value = $value -replace "`t", " "
            $row += $value
        }
        # Tab-delimited, CRLF line ending
        $writer.Write(($row -join "`t") + "`r`n")
    }

    $writer.Close()
    $reader.Close()
    $connection.Close()

    Write-Host "Export completed successfully: $OutputFile" -ForegroundColor Green
}
catch {
    Write-Error "Export failed: $_"
}

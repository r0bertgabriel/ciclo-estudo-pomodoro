' ============================================
' Script VBScript para criar atalho do Pomodoro
' Execute este arquivo clicando duas vezes
' ============================================

Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' Obter diretório atual do script
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)

' Caminho do Desktop
desktopPath = WshShell.SpecialFolders("Desktop")

' Criar atalho
Set shortcut = WshShell.CreateShortcut(desktopPath & "\🍅 Pomodoro Boladão.lnk")

' Configurar atalho
shortcut.TargetPath = scriptDir & "\start-conda.bat"
shortcut.WorkingDirectory = scriptDir
shortcut.Description = "Pomodoro Boladão - Timer de Estudos"
shortcut.IconLocation = "%SystemRoot%\System32\shell32.dll,43"

' Salvar atalho
shortcut.Save

' Mostrar mensagem de sucesso
MsgBox "✅ Atalho criado na Área de Trabalho!" & vbCrLf & vbCrLf & _
       "🍅 Pomodoro Boladão" & vbCrLf & vbCrLf & _
       "Agora você pode:" & vbCrLf & _
       "• Clicar no atalho da área de trabalho" & vbCrLf & _
       "• Ou executar start-conda.bat", _
       vbInformation, "Pomodoro Boladão"

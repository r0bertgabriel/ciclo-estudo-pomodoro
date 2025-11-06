; Script de Instalação do Pomodoro Boladão
; Compatível com Windows 10 e 11
; Criado com Inno Setup

#define MyAppName "Pomodoro Boladão"
#define MyAppVersion "1.2.0"
#define MyAppPublisher "Robert Gabriel"
#define MyAppURL "https://github.com/r0bertgabriel/ciclo-estudo-pomodoro"
#define MyAppExeName "launcher.py"

[Setup]
; Informações básicas
AppId={{8B3E9F2A-1D4C-4E5F-9A8B-7C6D5E4F3A2B}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppName}
AllowNoIcons=yes
LicenseFile=LICENSE.txt
InfoBeforeFile=INSTALLER-INFO.txt
OutputDir=installer_output
OutputBaseFilename=Pomodoro-Setup-v{#MyAppVersion}
SetupIconFile=icon.ico
Compression=lzma2/max
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=admin

; Compatibilidade Windows 10 e 11
MinVersion=10.0.10240
ArchitecturesAllowed=x64
ArchitecturesInstallIn64BitMode=x64

[Languages]
Name: "brazilianportuguese"; MessagesFile: "compiler:Languages\BrazilianPortuguese.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked
Name: "quicklaunchicon"; Description: "Criar ícone na Barra de Tarefas"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
; Arquivos do aplicativo
Source: "*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs; Excludes: "*.git*,*.vscode*,__pycache__,*.pyc,build,dist,installer_output,*.spec"
Source: "check-python.bat"; DestDir: "{app}"; Flags: ignoreversion
Source: "install-dependencies.bat"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "pythonw.exe"; Parameters: """{app}\launcher.py"""; WorkingDir: "{app}"; IconFilename: "{app}\icon.ico"
Name: "{group}\Desinstalar {#MyAppName}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "pythonw.exe"; Parameters: """{app}\launcher.py"""; WorkingDir: "{app}"; IconFilename: "{app}\icon.ico"; Tasks: desktopicon
Name: "{userappdata}\Microsoft\Internet Explorer\Quick Launch\{#MyAppName}"; Filename: "pythonw.exe"; Parameters: """{app}\launcher.py"""; WorkingDir: "{app}"; IconFilename: "{app}\icon.ico"; Tasks: quicklaunchicon

[Run]
; Verificar Python
Filename: "{app}\check-python.bat"; Description: "Verificando instalação do Python..."; Flags: runhidden waituntilterminated
; Instalar dependências
Filename: "{app}\install-dependencies.bat"; Description: "Instalando dependências Python..."; Flags: runhidden waituntilterminated
; Opção para executar após instalação
Filename: "pythonw.exe"; Parameters: """{app}\launcher.py"""; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent

[Code]
var
  PythonInstalled: Boolean;
  PythonPath: String;

function IsPythonInstalled(): Boolean;
var
  ResultCode: Integer;
begin
  // Verifica se Python está instalado
  if Exec('cmd.exe', '/C python --version', '', SW_HIDE, ewWaitUntilTerminated, ResultCode) then
  begin
    Result := (ResultCode = 0);
  end
  else
    Result := False;
end;

function GetPythonPath(): String;
var
  ResultCode: Integer;
  TmpFile: String;
  Lines: TArrayOfString;
begin
  TmpFile := ExpandConstant('{tmp}\python_path.txt');
  
  if Exec('cmd.exe', '/C python -c "import sys; print(sys.executable)" > "' + TmpFile + '"', '', SW_HIDE, ewWaitUntilTerminated, ResultCode) then
  begin
    if LoadStringsFromFile(TmpFile, Lines) then
    begin
      if GetArrayLength(Lines) > 0 then
        Result := Trim(Lines[0])
      else
        Result := '';
    end
    else
      Result := '';
  end
  else
    Result := '';
    
  DeleteFile(TmpFile);
end;

procedure InitializeWizard();
begin
  PythonInstalled := IsPythonInstalled();
  
  if PythonInstalled then
  begin
    PythonPath := GetPythonPath();
    MsgBox('Python detectado com sucesso!' + #13#10 + 
           'Localização: ' + PythonPath, mbInformation, MB_OK);
  end
  else
  begin
    if MsgBox('Python não foi detectado no sistema!' + #13#10 + #13#10 +
              'O Pomodoro Boladão requer Python 3.8 ou superior.' + #13#10 + #13#10 +
              'Deseja abrir a página de download do Python?', mbError, MB_YESNO) = IDYES then
    begin
      ShellExec('open', 'https://www.python.org/downloads/', '', '', SW_SHOW, ewNoWait, ResultCode);
      Abort();
    end
    else
      Abort();
  end;
end;

function NextButtonClick(CurPageID: Integer): Boolean;
begin
  Result := True;
  
  if CurPageID = wpReady then
  begin
    if not PythonInstalled then
    begin
      MsgBox('Python não está instalado. A instalação será cancelada.', mbError, MB_OK);
      Result := False;
    end;
  end;
end;

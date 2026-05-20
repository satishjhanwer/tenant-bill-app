!macro customUnInstall
  MessageBox MB_YESNO|MB_ICONQUESTION|MB_DEFBUTTON1 "Keep your bill settings and configuration?$\n$\nYour bills in your chosen storage folder are always preserved and never touched by this uninstaller.$\nThis only asks about app settings saved in $APPDATA\Tenant Bill$\n$\nYes = Keep settings (recommended)$\nNo = Delete settings permanently" IDYES +2
  RMDir /r "$APPDATA\Tenant Bill"
!macroend

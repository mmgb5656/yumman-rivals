!macro customInit
  ; Eliminar instalación anterior
  RMDir /r "$LOCALAPPDATA\Programs\YUMMAN RIVALS"
  
  ; Eliminar datos de usuario (recursos viejos)
  RMDir /r "$APPDATA\yumman-rivals\resources"
!macroend

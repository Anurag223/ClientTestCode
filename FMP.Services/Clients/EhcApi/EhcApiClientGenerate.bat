REM download CLI tools ZIP archive here
REM https://github.com/RicoSuter/NSwag/wiki/CommandLine

REM see options here
REM https://github.com/RicoSuter/NSwag/blob/master/src/NSwag.Commands/Commands/CodeGeneration/OpenApiToCSharpClientCommand.cs

del EhcApiClient.cs

C:\NSwag\NSwag\Win\nswag.exe openapi2csclient ^
  /input:swagger.json ^
  /output:EhcApiClient.cs ^
  /namespace:EHCPlayer2.Clients.EhcApi ^
  /classname:EhcApiClient ^
  /GenerateClientInterfaces:true ^

pause
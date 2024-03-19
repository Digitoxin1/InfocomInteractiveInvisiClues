Imports System.IO

Module Module1

    Sub Main()
        Dim BasePath As String = Path.GetDirectoryName(Environment.GetCommandLineArgs(0))
        Dim JSONPath As String = Path.Combine(BasePath, "json")
        Dim StylePath As String = Path.Combine(BasePath, "css")
        Dim ScriptPath As String = Path.Combine(BasePath, "js")
        Dim OutputPath As String = Path.Combine(BasePath, "html")
        Dim BaseStylesFile = Path.Combine(StylePath, "InvisiClues.css")
        Dim BaseScriptFile = Path.Combine(ScriptPath, "InvisiClues.js")

        If Not Directory.Exists(OutputPath) Then
            Directory.CreateDirectory(OutputPath)
        End If

        Dim BaseStyles = File.ReadAllText(BaseStylesFile)
        Dim BaseScript = File.ReadAllText(BaseScriptFile)

        For Each jsonFile In Directory.GetFiles(JSONPath)
            If jsonFile.ToLower.EndsWith(".json") Then
                Dim FileName = Path.GetFileNameWithoutExtension(jsonFile)
                Dim jsonString = File.ReadAllText(jsonFile)

                Dim jsonObj = CompactJson.Serializer.Parse(Of Dictionary(Of String, Object))(jsonString)
                Dim headerObj = CompactJson.Serializer.Parse(Of Dictionary(Of String, Object))(jsonObj.Item("header").ToString)
                Dim Title As String = headerObj.Item("title")
                Dim Year As String = ""
                If headerObj.ContainsKey("year") Then
                    Year = headerObj.Item("year")
                End If

                Dim GameStyles As String = ""
                Dim GameStylesFile = Path.Combine(StylePath, FileName & ".css")
                If File.Exists(GameStylesFile) Then
                    GameStyles = File.ReadAllText(GameStylesFile)
                End If

                Dim OutputFileName = FileName & " - InvisiClues"
                If Year <> "" Then
                    OutputFileName &= " (" & Year & ")"
                End If
                OutputFileName &= ".html"
                Dim OutputFile = Path.Combine(OutputPath, OutputFileName)
                Console.WriteLine("Building: " & OutputFile)
                Dim FileWriter = My.Computer.FileSystem.OpenTextFileWriter(OutputFile, False)
                FileWriter.WriteLine("<!doctype html>")
                FileWriter.WriteLine("<html lang=""en"">")
                FileWriter.WriteLine("<head>")
                FileWriter.WriteLine("<meta charset=""UTF-8"">")
                FileWriter.WriteLine("<meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">")
                FileWriter.WriteLine("<title>" & Title & " InvisiClues</title>")
                FileWriter.WriteLine("")
                FileWriter.WriteLine("<style type=""text/css"">")
                FileWriter.WriteLine(BaseStyles)
                FileWriter.WriteLine("</style>")
                If GameStyles <> "" Then
                    FileWriter.WriteLine("<style type=""text/css"">")
                    FileWriter.WriteLine(GameStyles)
                    FileWriter.WriteLine("</style>")
                End If
                FileWriter.WriteLine("")
                FileWriter.WriteLine("<script>")
                FileWriter.WriteLine(BaseScript)
                FileWriter.WriteLine("</script>")
                FileWriter.WriteLine("</head>")
                FileWriter.WriteLine("")
                FileWriter.WriteLine("<body>")
                FileWriter.WriteLine("<div class=""topNav""><select></select></div>")
                FileWriter.WriteLine("<main id=""section0"" class=""navSection""></main>")
                FileWriter.WriteLine("<a href=""#toc"" class=""top""></a>")
                FileWriter.WriteLine("</body>")
                FileWriter.WriteLine("")
                FileWriter.WriteLine("<script id=""jsonData"" type=""application/json"">")
                FileWriter.WriteLine(jsonString)
                FileWriter.WriteLine("</script>")
                FileWriter.WriteLine("")
                FileWriter.WriteLine("</html>")
                FileWriter.Close()
            End If
        Next
    End Sub

End Module

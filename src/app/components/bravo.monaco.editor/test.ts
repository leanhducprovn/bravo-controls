export class test {
    registerMonacoCustomTheme() {
        monaco.editor.defineTheme('myCustomTheme', {
            base: 'vs',
            inherit: true,
            rules: [
                { token: 'comment', fontStyle: 'italic underline' },
                { token: 'comment.js', foreground: 'ff0303', fontStyle: 'bold' },
                { token: 'comment.css', foreground: 'ff0303', fontStyle: 'bold' }
            ],
            colors: {}
        });

        monaco.languages.registerCompletionItemProvider('xml', {
            provideCompletionItems: (model, position) => {
                const wordBeforePosition = model.getWordUntilPosition({
                    lineNumber: position.lineNumber,
                    column: position.column - 1
                });

                const wordUntilPosition = model.getWordUntilPosition(position);
                if (wordBeforePosition.word.trim() === '' || wordUntilPosition.word.trim() === '') {
                    const keywords = [
                        {
                            label: 'Bravo',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'Bravo',
                            description: 'Bravo',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                        },
                        {
                            label: 'Bravo8',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'Bravo8',
                            description: 'Bravo8'
                        },
                        {
                            label: 'Bravo8R3',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'Bravo8R3',
                            description: 'Bravo8R3'
                        },
                        {
                            label: 'DucLA',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'DucLA',
                            description: 'Lê Anh Đức',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                        },
                        {
                            label: 'CuongNC',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'CuongNC',
                            description: 'Nguyễn Chí Cường',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                        },
                        {
                            label: 'TrungNB',
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: 'TrungNB',
                            description: 'Trung NB',
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                        }
                    ];

                    const suggestions = keywords.map((id) => ({
                        label: id.label,
                        kind: id.kind,
                        description: id.description,
                        documentation: id.description,
                        insertText: id.insertText,
                        detail: id.description,
                        insertTextRules: id.insertTextRules,
                        range: {
                            startLineNumber: position.lineNumber,
                            startColumn: wordUntilPosition.startColumn,
                            endLineNumber: position.lineNumber,
                            endColumn: wordUntilPosition.endColumn - 1
                        }
                    }));
                    return { suggestions };
                }
            }
        });
    }
}

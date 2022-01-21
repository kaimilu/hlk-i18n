import * as fs from "fs";
import {ExtensionContext, languages, TextDocument, Position, CancellationToken, CompletionContext, CompletionItem, CompletionItemKind} from 'vscode';

function provideCompletionItems(
    document: TextDocument,
    position: Position,
    _token: CancellationToken,
    _context: CompletionContext
) {
    const typeText = document
    .lineAt(position)
    .text.substring(position.character - 1, position.character);
    if(typeText !== '$t(') {
        return;
    }
    // 获取当前文件路径
    const filePath: string = document.fileName;
    let classNames: string[] = [];
    if(document.languageId === 'vue') {

    }
    return [new CompletionItem(
        document.languageId === 'vue'? 'abc':'xxx',
        CompletionItemKind.Text
    )];
}

export default function(context: ExtensionContext) {
    context.subscriptions.push(
        languages.registerCompletionItemProvider(
            [
                { scheme: 'file', language: 'ts' },
                { scheme: 'file', language: 'js' },
                { scheme: 'file', language: 'vue' },
                { scheme: 'file', language: 'tsx' },
                { scheme: 'file', language: 'jsx' },
            ], 
            {
                provideCompletionItems,
            },
            "$t("
        )
    )
}
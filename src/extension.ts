// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const insertText = (val:string) => {
    const editor = vscode.window.activeTextEditor;
    if(!editor) {
        vscode.window.showErrorMessage('Can\'t insert log because no document is open');
        return;
    }
    const selection = editor.selection;

    const lineOfSelection = selection.active.line;

    editor.edit((editBuilder) => {
        editBuilder.insert(new vscode.Position(lineOfSelection + 1, 0), val);
    });
};

/**
 * @description 1.1 获取所有console
 * @author 老苏
 * @date 2022-01-21 18:44
 */
function getAllLogStatements() {
	const editor = vscode.window.activeTextEditor;
    if (!editor) { return []; }
	// 获取编辑器页面文本
	const document = editor.document;
	const documentText = document.getText();

	let logStatements = [];
	// 检测console的正则表达式
	const logRegex = /console.(log|debug|info|warn|error|assert|dir|dirxml|trace|group|groupEnd|time|timeEnd|profile|profileEnd|count)\((.*)\);?/g;
	let match;
	// 正则循环匹配页面文本
	while (match = logRegex.exec(documentText)) {
	// 每次匹配到当前的范围--Range
		let matchRange =
			new vscode.Range(
				document.positionAt(match.index),
				document.positionAt(match.index + match[0].length)
			);
		if (!matchRange.isEmpty) {
            // 把Range放入数组
            logStatements.push(matchRange);
        }
	}
	return logStatements;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "hlk-i18n" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('hlk-i18n.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('测试第一个插件! Hello VS Code~');
	});
    
    const insertLog = vscode.commands.registerCommand('hlk-i18n.insertLog', () => {
        // 拿到当前编辑页面的内容对象 editor
        const editor  = vscode.window.activeTextEditor;
        if(!editor) {return;}
        const selection = editor.selection;
        const text = editor.document.getText(selection);
        // 在这里拼写console语句
		const logToInsert = `console.log('${text}: ',${text});\n`;
		// 执行插行方法
		text ? insertText(logToInsert) : insertText('console.log();');
    });

    // 1.2 把获取到的console逐个删除
    const deleteAllLog = vscode.commands.registerCommand('hlk-i18n.delLog', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) { return; }

		let workspaceEdit = new vscode.WorkspaceEdit();
		const document = editor.document;

		const logStatements = getAllLogStatements();

		// 循环遍历每个匹配项的range，并删除
		logStatements.forEach((log) => {
			workspaceEdit.delete(document.uri, log);
		});
		// 完成后显示消息提醒
		vscode.workspace.applyEdit(workspaceEdit).then(() => {
			vscode.window.showInformationMessage(`${logStatements.length} console.log deleted`);
		});
	});

	context.subscriptions.push(disposable, insertLog, deleteAllLog);
}

// this method is called when your extension is deactivated
export function deactivate() {}

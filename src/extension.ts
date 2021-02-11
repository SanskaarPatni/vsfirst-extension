import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "vsfirst" is now active!');

	context.subscriptions.push(
		vscode.commands.registerCommand('vsfirst.helloWorld', () => {
		vscode.window.showInformationMessage('Hello coderz, from VSfirst!');
	})
	);
	context.subscriptions.push(
	vscode.commands.registerCommand('vsfirst.askQuestion',async ()=>{
		const answer=await vscode.window.showInformationMessage('How was your day?',"good","bad");
		if(answer==="bad"){
			vscode.window.showInformationMessage("Sorry to hear that");
		}else{
			console.log(answer);
		}
	})
	);
}
export function deactivate() {}

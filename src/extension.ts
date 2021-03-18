import * as vscode from "vscode";
import { authenticate } from "./authenticate";
import { HelloWorldPanel } from "./HelloWorldPanel";
import { SidebarProvider } from "./SidebarProvider";
import { TokenManager } from "./TokenManager";

export function activate(context: vscode.ExtensionContext) {
  TokenManager.globalState = context.globalState;
  const sidebarProvider = new SidebarProvider(context.extensionUri);
  const item = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right
  );
  item.text = "$(beaker) Add Todo";
  item.command = "vsfirst.addTodo";
  item.show();

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "vsfirst-sidebar",
      sidebarProvider
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vsfirst.helloWorld", () => {
      // HelloWorldPanel.createOrShow(context.extensionUri);
      vscode.window.showErrorMessage("token" + TokenManager.getToken());
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("vsfirst.authenticate", () => {
      try {
        authenticate();
      } catch (err) {
        console.log(err);
      }
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("vsfirst.refresh", async () => {
      // HelloWorldPanel.kill();
      // HelloWorldPanel.createOrShow(context.extensionUri);
      await vscode.commands.executeCommand("workbench.action.closeSidebar");
      await vscode.commands.executeCommand(
        "workbench.view.extension.vsfirst-sidebar-view"
      );
      /*setTimeout(() => {
        vscode.commands.executeCommand(
          "workbench.action.webview.openDeveloperTools"
        );
      }, 500);*/
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("vsfirst.addTodo", () => {
      const { activeTextEditor } = vscode.window;
      if (!activeTextEditor) {
        vscode.window.showErrorMessage("No text editor");
        return;
      }
      const text = activeTextEditor.document.getText(
        activeTextEditor.selection
      );
      sidebarProvider._view?.webview.postMessage({
        type: "new-todo",
        value: text,
      });
    })
  );
  // context.subscriptions.push(
  // vscode.commands.registerCommand('vsfirst.askQuestion',async ()=>{
  // 	const answer=await vscode.window.showInformationMessage('How was your day?',"good","bad");
  // 	if(answer==="bad"){
  // 		vscode.window.showInformationMessage("Sorry to hear that");
  // 	}else{
  // 		console.log(answer);
  // 	}
  // })
  // );
}
export function deactivate() {}

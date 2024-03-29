import * as vscode from "vscode";
import { apiBaseUrlProd, apiBaseUrlDev } from "./constants";
import * as polka from "polka";
import { TokenManager } from "./TokenManager";

export const authenticate = (fn: () => void) => {
  const app = polka();
  app.get(`/auth/:token`, async (req: any, res) => {
    const { token } = req.params;
    if (!token) {
      res.end(`<h1>Something went wrong!</h1>`);
      return;
    }

    await TokenManager.setToken(token);
    res.end(`<h1>Auth was successful, you can close this now</h1>`);

    fn();

    (app as any).server.close();
  });

  app.listen(54321, (err: Error) => {
    if (err) {
      vscode.window.showErrorMessage(err.message);
    } else {
      vscode.commands.executeCommand(
        "vscode.open",
        vscode.Uri.parse(`${apiBaseUrlProd}/auth/github`)
      );
    }
  });
};

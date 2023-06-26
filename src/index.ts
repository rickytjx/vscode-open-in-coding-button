import type { ExtensionContext } from 'vscode'
import { StatusBarAlignment, commands, window } from 'vscode'
import URL from './url'

export function activate({ subscriptions }: ExtensionContext) {
  const command = 'openInCODING.openProject'
  subscriptions.push(commands.registerCommand(command, () => {
    return URL.open()
  }))

  const statusBar = window.createStatusBarItem(StatusBarAlignment.Left, 0)
  statusBar.command = command
  statusBar.text = '$(coding-logo)'
  statusBar.tooltip = 'Open in CODING'
  statusBar.show()
}

export function deactivate() {

}

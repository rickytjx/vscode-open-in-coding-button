/* IMPORT */

import * as vscode from 'vscode'

/* CONFIG */

const Config = {

  get(extension = 'openInCODING') {
    return vscode.workspace.getConfiguration().get(extension) as any
  },

}

/* EXPORT */

export default Config

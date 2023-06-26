import { compact } from 'lodash-es'
import * as vscode from 'vscode'
import Utils from './utils'

const URL = {

  async get(page?: any) {
    const repopath = await Utils.repo.getPath()

    if (!repopath)
      return vscode.window.showErrorMessage('You have to open a git project before being able to open it in CODING')

    const git = Utils.repo.getGit(repopath)
    const repourl = await Utils.repo.getUrl(git)

    if (!repourl)
      return vscode.window.showErrorMessage('Remote repository not found')

    const filePath = ''
    const branch = ''
    const lines = ''
    const hash = ''

    const url = compact([repourl, page, branch, hash, filePath, lines]).join('/')

    return url
  },

  async open(page?: any) {
    const url = await URL.get(page)

    vscode.env.openExternal(vscode.Uri.parse(url as any))
  },

}

export default URL
